import { strikeDamage } from "./combat";
import type {
  Action,
  CardDefinition,
  CardId,
  CardInstance,
  Cell,
  Command,
  CommandResult,
  DiceSource,
  Die,
  EngineEvent,
  MatchState,
  PlayerId,
  Rejection,
  Stage,
  StrikeAction,
} from "./model";

const rows = ["3", "2", "1", "1′", "2′", "3′"];
const fullChain: readonly Stage[] = [
  "ending",
  "payment",
  "wound",
  "protection",
  "calculation",
  "result",
  "roll",
  "target",
  "declaration",
];
const shortChain = fullChain.filter((stage) => !["roll", "result", "calculation"].includes(stage));

function coordinates(cell: string) {
  return { column: "ABCDE".indexOf(cell[0] ?? "?"), row: rows.indexOf(cell.slice(1)) };
}
function isCell(cell: string): cell is Cell {
  const { column, row } = coordinates(cell);
  return column >= 0 && row >= 0;
}
function adjacent(a: Cell, b: Cell, orthogonal = false): boolean {
  const first = coordinates(a),
    second = coordinates(b);
  const x = Math.abs(first.column - second.column),
    y = Math.abs(first.row - second.row);
  return orthogonal ? x + y === 1 : Math.max(x, y) === 1;
}
function getCard(state: MatchState, id: CardId): CardInstance {
  const card = state.cards.find((candidate) => candidate.id === id);
  if (!card) throw new Error(`Missing card: ${id}`);
  return card;
}
function getDefinition(state: MatchState, card: CardInstance): CardDefinition {
  const definition = state.definitions.find((candidate) => candidate.id === card.definition);
  if (!definition) throw new Error(`Missing card definition: ${card.definition}`);
  return definition;
}
function getAction(state: MatchState, id: number): Action {
  const action = state.actions[id];
  if (!action) throw new Error(`Missing action: ${id}`);
  return action;
}
function getStrike(state: MatchState, id: number): StrikeAction {
  const action = getAction(state, id);
  if (action.kind !== "strike") throw new Error(`Not a strike: ${id}`);
  return action;
}
function inSquad(card: CardInstance): boolean {
  return card.location.zone === "battlefield" || card.location.zone === "additional";
}
function currentLife(state: MatchState, card: CardInstance): number {
  return getDefinition(state, card).lifeAllowance - card.wounds;
}
function canHeal(state: MatchState, source: CardInstance, target: CardInstance): boolean {
  return (
    Boolean(getDefinition(state, source).abilities?.heal) &&
    source.location.zone === "battlefield" &&
    target.location.zone === "battlefield" &&
    source.controller === target.controller &&
    adjacent(source.location.cell, target.location.cell) &&
    target.wounds > 0
  );
}

function replaceCard(state: MatchState, updated: CardInstance): MatchState {
  return { ...state, cards: state.cards.map((card) => (card.id === updated.id ? updated : card)) };
}
function replaceAction(state: MatchState, action: Action): MatchState {
  return { ...state, actions: { ...state.actions, [action.id]: action } };
}
function removeAction(state: MatchState, action: Action): MatchState {
  const actions = { ...state.actions };
  delete actions[action.id];
  return { ...state, actions, stack: state.stack.filter((object) => object.action !== action.id) };
}
function base(state: MatchState, card: CardInstance) {
  return {
    id: state.nextActionId,
    source: card.id,
    controller: card.controller,
    effectsProduced: false,
  };
}
function declare(state: MatchState, action: Action, events: EngineEvent[]): MatchState {
  const stages =
    action.kind === "strike"
      ? fullChain
      : action.kind === "defender"
        ? (["payment", "wound"] as const)
        : shortChain;
  events.push({ type: "declared", action });
  return {
    ...state,
    actions: { ...state.actions, [action.id]: action },
    nextActionId: action.id + 1,
    stack: [...state.stack, ...stages.map((stage) => ({ stage, action: action.id }))],
    consecutivePasses: 0,
    priorityPlayer: state.activePlayer,
  };
}

// Forced destruction triggers are declared when their controller gets priority (405.2).
function grantPriority(state: MatchState, player: PlayerId, events: EngineEvent[]): MatchState {
  state = { ...state, priorityPlayer: player };
  const due = state.pendingDestructions.filter((id) => getCard(state, id).controller === player);
  state = {
    ...state,
    pendingDestructions: state.pendingDestructions.filter((id) => !due.includes(id)),
  };
  for (const id of due) {
    const card = getCard(state, id);
    state = declare(state, { ...base(state, card), kind: "destruction" }, events);
  }
  if (state.stack.length === 0) {
    const survivors = state.players.filter((owner) =>
      state.cards.some((card) => card.controller === owner && inSquad(card)),
    );
    const [winner] = survivors;
    const outcome =
      survivors.length === 2
        ? null
        : winner !== undefined
          ? { kind: "win" as const, winner }
          : { kind: "draw" as const };
    if (outcome) {
      events.push({ type: "ended", outcome });
      state = { ...state, outcome, priorityPlayer: null };
    }
  }
  return state;
}

export function createBattle(
  input: Readonly<{
    players: readonly [PlayerId, PlayerId];
    definitions: readonly CardDefinition[];
    cards: readonly CardInstance[];
    activePlayer: PlayerId;
  }>,
): MatchState {
  if (input.players[0] === input.players[1] || !input.players.includes(input.activePlayer)) {
    throw new Error("Invalid battle players");
  }
  if (new Set(input.definitions.map((card) => card.id)).size !== input.definitions.length) {
    throw new Error("Duplicate card definition");
  }
  for (const definition of input.definitions) {
    const values = [definition.movementAllowance, ...definition.simpleStrike];
    if (
      Object.values(definition.abilities ?? {}).some(
        (value) => !Number.isInteger(value) || value <= 0,
      )
    )
      throw new Error(`Invalid creature ability: ${definition.id}`);
    if (
      definition.simpleStrike.length !== 3 ||
      values.some((value) => !Number.isInteger(value) || value < 0) ||
      !Number.isInteger(definition.lifeAllowance) ||
      definition.lifeAllowance < 1
    ) {
      throw new Error(`Invalid card definition: ${definition.id}`);
    }
  }
  const state: MatchState = {
    ...input,
    phase: "main",
    priorityPlayer: input.activePlayer,
    stack: [],
    actions: {},
    nextActionId: 1,
    pendingDestructions: [],
    consecutivePasses: 0,
    outcome: null,
  };
  const ids = new Set<CardId>(),
    occupied = new Set<Cell>();
  for (const card of state.cards) {
    if (ids.has(card.id)) throw new Error(`Duplicate card: ${card.id}`);
    ids.add(card.id);
    getDefinition(state, card);
    if (!state.players.includes(card.owner) || !state.players.includes(card.controller)) {
      throw new Error(`Invalid card player: ${card.id}`);
    }
    if (
      ![card.wounds, card.movementMarkers, card.armorSpent ?? 0].every(
        (value) => Number.isInteger(value) && value >= 0,
      )
    ) {
      throw new Error(`Invalid card markers: ${card.id}`);
    }
    if (card.location.zone === "battlefield") {
      if (!isCell(card.location.cell) || occupied.has(card.location.cell))
        throw new Error(`Invalid occupied cell: ${card.id}`);
      occupied.add(card.location.cell);
    }
    if (inSquad(card) && currentLife(state, card) <= 0)
      throw new Error(`Deployed creature has no life: ${card.id}`);
  }
  return grantPriority(state, state.activePlayer, []);
}

export function applyCommand(
  state: MatchState,
  command: Command,
  rollDie?: DiceSource,
): CommandResult {
  const reject = (reason: Rejection): CommandResult => ({ ok: false, reason, state });
  if (state.outcome) return reject("battle-ended");
  if (!state.players.includes(command.player)) return reject("unknown-player");
  if (state.priorityPlayer !== command.player) return reject("no-priority");
  const events: EngineEvent[] = [];
  if (command.type === "pass") {
    if (state.phase === "preliminary") return reject("preliminary-phase-unsupported");
    if (state.consecutivePasses === 0) {
      const other = state.players[0] === command.player ? state.players[1] : state.players[0];
      const next = grantPriority({ ...state, consecutivePasses: 1 }, other, events);
      return { ok: true, state: next, events };
    }
    const ready = { ...state, consecutivePasses: 0 as const };
    const resolved = state.stack.length
      ? resolveTop(ready, events, rollDie)
      : {
          state: advancePhase(ready, events),
          priority: ready.activePlayer,
        };
    // Final -> Initial changes the active player; cancellations can choose their controller.
    const priority = state.stack.length ? resolved.priority : resolved.state.activePlayer;
    return { ok: true, state: grantPriority(resolved.state, priority, events), events };
  }
  const card = state.cards.find((candidate) => candidate.id === command.card);
  if (!card) return reject("unknown-card");
  if (card.controller !== command.player) return reject("not-controller");
  if (card.location.zone !== "battlefield") return reject("not-on-battlefield");
  if (card.status !== "open") return reject("card-closed");

  let action: Action;
  if (command.type === "defend") {
    if (command.player === state.activePlayer) return reject("not-inactive-player");
    const top = state.stack[state.stack.length - 1];
    if (!top || top.stage !== "target") return reject("no-defender-window");
    const attack = getAction(state, top.action);
    if (attack.kind !== "strike") return reject("no-defender-window");
    if (attack.target !== attack.initialTarget) return reject("already-redirected");
    const source = getCard(state, attack.source),
      target = getCard(state, attack.target);
    if (
      source.location.zone !== "battlefield" ||
      target.location.zone !== "battlefield" ||
      !adjacent(card.location.cell, source.location.cell) ||
      !adjacent(card.location.cell, target.location.cell)
    ) {
      return reject("defender-not-adjacent");
    }
    action = { ...base(state, card), kind: "defender", attack: attack.id };
  } else {
    if (state.activePlayer !== command.player) return reject("not-active-player");
    if (state.phase !== "main") return reject("not-main-phase");
    if (state.stack.length) return reject("stack-not-empty");
    if (command.type === "move") {
      if (card.movementMarkers >= getDefinition(state, card).movementAllowance)
        return reject("movement-exhausted");
      if (!isCell(command.to)) return reject("invalid-cell");
      if (!adjacent(card.location.cell, command.to, true)) return reject("not-orthogonal-neighbor");
      if (
        state.cards.some(
          (other) => other.location.zone === "battlefield" && other.location.cell === command.to,
        )
      ) {
        return reject("cell-occupied");
      }
      action = { ...base(state, card), kind: "movement", target: command.to };
    } else {
      const target = state.cards.find((other) => other.id === command.target);
      if (!target) return reject("unknown-target");
      if (target.location.zone !== "battlefield") return reject("target-not-on-battlefield");
      if (!adjacent(card.location.cell, target.location.cell)) return reject("not-adjacent");
      if (command.type === "heal") {
        const amount = getDefinition(state, card).abilities?.heal;
        if (!amount) return reject("no-heal-ability");
        if (!canHeal(state, card, target)) return reject("invalid-heal-target");
        action = { ...base(state, card), kind: "heal", target: target.id, amount };
      } else
        action = {
          ...base(state, card),
          kind: "strike",
          initialTarget: target.id,
          target: target.id,
          closeOnPayment: [card.id],
          rolls: null,
          damage: null,
        };
    }
  }
  const next = declare(state, action, events);
  return { ok: true, state: grantPriority(next, state.activePlayer, events), events };
}

function legal(state: MatchState, action: Action): boolean {
  const source = getCard(state, action.source);
  if (action.kind === "destruction") return inSquad(source) && currentLife(state, source) <= 0;
  if (source.location.zone !== "battlefield" || source.status !== "open") return false;
  if (action.kind === "movement") {
    return (
      source.movementMarkers < getDefinition(state, source).movementAllowance &&
      adjacent(source.location.cell, action.target, true) &&
      !state.cards.some(
        (card) => card.location.zone === "battlefield" && card.location.cell === action.target,
      )
    );
  }
  if (action.kind === "heal") return canHeal(state, source, getCard(state, action.target));
  const target = getCard(
    state,
    action.kind === "strike" ? action.target : getStrike(state, action.attack).target,
  );
  if (target.location.zone !== "battlefield") return false;
  if (action.kind === "strike") return adjacent(source.location.cell, target.location.cell);
  const attack = getStrike(state, action.attack),
    attacker = getCard(state, attack.source);
  return (
    attack.target === attack.initialTarget &&
    attacker.location.zone === "battlefield" &&
    adjacent(source.location.cell, attacker.location.cell) &&
    adjacent(source.location.cell, target.location.cell)
  );
}

function readDie(rollDie: DiceSource | undefined): Die {
  if (!rollDie) throw new Error("A dice source is required to resolve combat");
  const value = rollDie();
  if (!Number.isInteger(value) || value < 1 || value > 6)
    throw new Error(`Invalid die result: ${value}`);
  return value as Die;
}

function resolveTop(state: MatchState, events: EngineEvent[], rollDie?: DiceSource) {
  const object = state.stack.at(-1);
  if (!object) throw new Error("Cannot resolve an empty stack");
  const action = getAction(state, object.action);
  state = { ...state, stack: state.stack.slice(0, -1) };
  if (object.stage !== "payment" && object.stage !== "ending" && !legal(state, action)) {
    events.push({ type: "cancelled", action: action.id });
    if (!action.effectsProduced) state = removeAction(state, action);
    else
      state = {
        ...state,
        stack: state.stack.filter(
          (item) =>
            item.action !== action.id || item.stage === "payment" || item.stage === "ending",
        ),
      };
    return { state, priority: action.controller };
  }
  events.push({ type: "resolved", action: action.id, stage: object.stage });
  const source = getCard(state, action.source);
  if (action.kind === "strike" && object.stage === "roll") {
    const target = getCard(state, action.target);
    const sourceDie = readDie(rollDie);
    events.push({ type: "rolled", action: action.id, card: source.id, value: sourceDie });
    // Only an open opposing creature fights back (209.2–3, 205.5.b).
    const responder =
      target.status === "open" && target.controller !== source.controller ? readDie(rollDie) : null;
    if (responder !== null)
      events.push({ type: "rolled", action: action.id, card: target.id, value: responder });
    state = replaceAction(state, {
      ...action,
      rolls: { source: sourceDie, responder },
      effectsProduced: true,
    });
  } else if (action.kind === "strike" && object.stage === "calculation") {
    if (!action.rolls) throw new Error("Strike dice have not been rolled");
    const target = getCard(state, action.target);
    const damage = strikeDamage(
      action.rolls.source,
      action.rolls.responder,
      getDefinition(state, source).simpleStrike,
      getDefinition(state, target).simpleStrike,
    );
    state = replaceAction(state, { ...action, damage });
    events.push({ type: "calculated", action: action.id, ...damage });
  } else if (object.stage === "wound") {
    if (action.kind === "movement") {
      if (source.location.zone !== "battlefield")
        throw new Error("Movement source left the battlefield");
      state = replaceCard(state, {
        ...source,
        location: { zone: "battlefield", cell: action.target },
      });
      events.push({
        type: "moved",
        card: source.id,
        from: source.location.cell,
        to: action.target,
      });
    } else if (action.kind === "defender") {
      const attack = getStrike(state, action.attack);
      state = replaceAction(state, { ...attack, target: source.id });
      events.push({ type: "redirected", attack: attack.id, from: attack.target, to: source.id });
    } else if (action.kind === "heal") {
      const target = getCard(state, action.target);
      const amount = Math.min(action.amount, target.wounds);
      state = replaceCard(state, { ...target, wounds: target.wounds - amount });
      events.push({ type: "healed", card: target.id, source: source.id, amount });
    } else if (action.kind === "destruction") {
      state = replaceCard(state, {
        ...source,
        location: { zone: "graveyard" },
        controller: source.owner,
      });
      events.push({ type: "destroyed", card: source.id, owner: source.owner });
    } else {
      if (!action.damage) throw new Error("Strike damage has not been calculated");
      const target = getCard(state, action.target);
      const wounds = [
        [target, source.id, action.damage.toTarget],
        [source, target.id, action.damage.toSource],
      ] as const;
      for (const [card, attacker, rawAmount] of wounds) {
        const remaining = Math.max(
          0,
          (getDefinition(state, card).abilities?.armor ?? 0) - (card.armorSpent ?? 0),
        );
        const prevented = Math.min(rawAmount, remaining);
        const amount = rawAmount - prevented;
        if (rawAmount === 0) continue;
        const updated = {
          ...card,
          wounds: card.wounds + amount,
          ...(prevented ? { armorSpent: (card.armorSpent ?? 0) + prevented } : {}),
        };
        if (prevented)
          events.push({ type: "prevented", card: card.id, source: attacker, amount: prevented });
        state = replaceCard(state, updated);
        if (amount) events.push({ type: "wounded", card: card.id, source: attacker, amount });
        if (currentLife(state, card) > 0 && currentLife(state, updated) <= 0) {
          state = { ...state, pendingDestructions: [...state.pendingDestructions, card.id] };
        }
      }
    }
    state = replaceAction(state, { ...action, effectsProduced: true });
  } else if (object.stage === "payment") {
    if (action.kind === "movement") {
      state = replaceCard(state, { ...source, movementMarkers: source.movementMarkers + 1 });
      events.push({ type: "movement-paid", card: source.id });
    } else if (action.kind === "defender") {
      const attack = getStrike(state, action.attack);
      state = replaceAction(state, {
        ...attack,
        closeOnPayment: [...attack.closeOnPayment, source.id],
      });
    } else if (action.kind === "strike" || action.kind === "heal") {
      // Effects already happened: pay as far as possible even if the source died (423.1.a, 416.2).
      for (const id of action.kind === "heal" ? [source.id] : action.closeOnPayment) {
        const card = getCard(state, id);
        if (!inSquad(card) || card.status === "closed") continue;
        state = replaceCard(state, { ...card, status: "closed" });
        events.push({ type: "closed", card: id });
      }
    }
  }
  if (!state.stack.some((item) => item.action === action.id)) state = removeAction(state, action);
  return { state, priority: state.activePlayer };
}

// Ordinary creatures have no preparation choices or phase-triggered abilities.
function advancePhase(state: MatchState, events: EngineEvent[]): MatchState {
  if (state.phase === "main") state = { ...state, phase: "final" };
  else if (state.phase === "initial") state = { ...state, phase: "main" };
  else {
    const activePlayer =
      state.players[0] === state.activePlayer ? state.players[1] : state.players[0];
    state = { ...state, phase: "initial", activePlayer };
    // Armor's allowance resets on either player's turn, independently of opening (Armor X).
    for (const card of state.cards) {
      if (card.armorSpent && inSquad(card)) state = replaceCard(state, { ...card, armorSpent: 0 });
    }
    for (const card of state.cards) {
      if (card.controller !== activePlayer || !inSquad(card)) continue;
      if (card.status === "closed" || card.movementMarkers > 0) {
        state = replaceCard(state, { ...card, status: "open", movementMarkers: 0 });
        events.push({ type: "refreshed", card: card.id });
      }
    }
  }
  events.push({ type: "phase-started", phase: state.phase, player: state.activePlayer });
  return state;
}
