import { BattleSession, legalCommands } from "../battle/battle-session";
import type { CombatPlayback } from "../battle/combat-playback";
import type { CardInstance, Cell, Command, EngineEvent } from "../rules/model";

export function createBattleControls(
  battle: BattleSession,
  playback: CombatPlayback,
  changed: () => void,
  present: () => void,
  restart: () => void,
) {
  let selected: string | null = null;
  let abilityMode: "heal" | "shot" | null = null;
  const status = document.querySelector<HTMLElement>("#status")!;
  const inspection = document.querySelector<HTMLElement>("#inspection")!;
  const prompt = document.querySelector<HTMLElement>("#prompt")!;
  const log = document.querySelector<HTMLElement>("#log")!;
  const shot = document.querySelector<HTMLButtonElement>("#shot")!;
  const heal = document.querySelector<HTMLButtonElement>("#heal")!;
  const endTurn = document.querySelector<HTMLButtonElement>("#end-turn")!;
  const takeAttack = document.querySelector<HTMLButtonElement>("#take-attack")!;
  const prepareFlight = document.querySelector<HTMLButtonElement>("#prepare-flight")!;
  const actionMenu = document.querySelector<HTMLElement>("#action-menu")!;
  const actionsToggle = document.querySelector<HTMLButtonElement>("#actions-toggle")!;
  const creatureInfo = document.querySelector<HTMLDetailsElement>("#creature-info")!;
  const history = document.querySelector<HTMLDetailsElement>("#history")!;
  const selectedName = document.querySelector<HTMLElement>("#selected-name")!;
  const settings = document.querySelector<HTMLDetailsElement>("#settings")!;
  settings.ontoggle = () => {
    if (settings.open) {
      closeActions();
      creatureInfo.open = false;
    }
  };

  function closeActions(): void {
    actionMenu.hidden = true;
    actionsToggle.setAttribute("aria-expanded", "false");
    actionsToggle.setAttribute("aria-label", "Open battle actions");
    history.open = false;
  }
  actionsToggle.onclick = () => {
    settings.open = false;
    creatureInfo.open = false;
    actionMenu.hidden = !actionMenu.hidden;
    actionsToggle.setAttribute("aria-expanded", String(!actionMenu.hidden));
    actionsToggle.setAttribute(
      "aria-label",
      actionMenu.hidden ? "Open battle actions" : "Close battle actions",
    );
  };
  creatureInfo.ontoggle = () => {
    if (creatureInfo.open) {
      closeActions();
      settings.open = false;
    }
  };
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (settings.open) {
        settings.open = false;
        settings.querySelector("summary")!.focus();
        return;
      }
      closeActions();
      creatureInfo.open = false;
      actionsToggle.focus();
    }
  });

  function name(id: string): string {
    const card = battle.state.cards.find((candidate) => candidate.id === id)!;
    return `${card.controller} ${battle.state.definitions.find((definition) => definition.id === card.definition)!.name}`;
  }

  function describe(event: EngineEvent): string | null {
    switch (event.type) {
      case "moved":
        return `${name(event.card)} moved ${event.from} → ${event.to}.`;
      case "prepared-flight":
        return `${name(event.card)} prepared an air strike for next turn.`;
      case "rolled":
        return `${name(event.card)} rolled ${event.value}.`;
      case "healed":
        return `${name(event.source)} healed ${name(event.card)} for ${event.amount}.`;
      case "prevented":
        return `${name(event.card)} armor prevented ${event.amount}.`;
      case "wounded":
        return `${name(event.card)} took ${event.amount} damage.`;
      case "destroyed":
        return `${name(event.card)} died.`;
      case "redirected":
        return `${name(event.to)} defended ${name(event.from)}.`;
      default:
        return null;
    }
  }

  function act(command: Command): void {
    closeActions();
    creatureInfo.open = false;
    battle.command(command);
    abilityMode = null;
    present();
  }

  function clickTarget(occupant: CardInstance | undefined, cell?: Cell): void {
    settings.open = false;
    closeActions();
    creatureInfo.open = false;
    if (playback.busy || battle.state.priorityPlayer !== "north") return;
    if (occupant && battle.defenders.includes(occupant.id)) {
      act({ type: "defend", player: occupant.controller, card: occupant.id });
      return;
    }
    const command = selected
      ? legalCommands(battle.state, selected).find((candidate) =>
          abilityMode
            ? candidate.type === abilityMode && candidate.target === occupant?.id
            : (candidate.type === "move" && candidate.to === cell) ||
              (candidate.type === "strike" && candidate.target === occupant?.id),
        )
      : undefined;
    if (command) act(command);
    else {
      selected = occupant?.id ?? null;
      abilityMode = null;
      changed();
    }
  }

  function cardText(card: CardInstance): string {
    const definition = playback.state.definitions.find(
      (candidate) => candidate.id === card.definition,
    )!;
    return `${definition.name}\n${Math.max(0, definition.lifeAllowance - card.wounds)} life\n${card.status === "closed" ? "Action spent" : definition.flight ? "Flight" : `${definition.movementAllowance - card.movementMarkers} move`}`;
  }

  function render() {
    const state = playback.state;
    const defenders = battle.defenders;
    const card = state.cards.find((candidate) => candidate.id === selected);
    const bot = state.priorityPlayer === "south";
    const exchange = playback.exchange;
    const available = selected && !bot && !playback.busy ? legalCommands(state, selected) : [];
    const commands = available.filter((command) =>
      abilityMode
        ? command.type === abilityMode
        : command.type !== "heal" && command.type !== "shot",
    );
    status.textContent = playback.busy
      ? playback.step?.animation === "move"
        ? "Moving…"
        : playback.step?.animation === "heal"
          ? "Healing…"
          : "Resolving attack…"
      : state.outcome
        ? state.outcome.kind === "win"
          ? state.outcome.winner === "north"
            ? "You win"
            : "Opponent wins"
          : "Draw"
        : bot
          ? "Opponent’s turn"
          : defenders.length
            ? "Choose a defender"
            : state.activePlayer === "north"
              ? "Your turn"
              : "Opponent’s turn";
    prompt.textContent =
      battle.error ??
      (playback.busy
        ? playback.step?.animation === "move"
          ? `${name(playback.step.actors[0]!.card)} moves ${playback.step.actors[0]!.from} → ${playback.step.actors[0]!.to}.`
          : exchange
            ? `${name(exchange.source)} → ${name(exchange.target)}`
            : "Watch the attack resolve."
        : state.outcome
          ? "Battle finished. Restart to play again."
          : bot
            ? "You control north. South plays automatically."
            : defenders.length
              ? "Tap a gold creature to defend, or take the attack."
              : abilityMode === "shot"
                ? "Tap a red enemy to shoot. No counterstrike or defender. Archer closes."
                : abilityMode === "heal"
                  ? "Tap a green ally to heal. Ward closes after healing."
                  : card && state.definitions.find((def) => def.id === card.definition)?.flight
                    ? "Flight: tap a red enemy on the battlefield or air zone to strike."
                    : "North: tap a creature, then green to move or red to attack.");
    const definition = card
      ? state.definitions.find((def) => def.id === card.definition)
      : undefined;
    const armor = definition?.abilities?.armor;
    const healing = definition?.abilities?.heal;
    const shooting = definition?.abilities?.shot;
    prepareFlight.hidden = !available.some((command) => command.type === "prepare-flight");
    for (const [mode, button, label, enabled] of [
      ["shot", shot, `Shot ${shooting?.strength.join("/") ?? "1/2/3"}`, Boolean(shooting)],
      ["heal", heal, `Heal ${healing ?? 2}`, Boolean(healing)],
    ] as const) {
      button.hidden = !enabled || bot || defenders.length > 0;
      button.disabled = playback.busy || !available.some((command) => command.type === mode);
      button.querySelector("span")!.textContent = abilityMode === mode ? `Cancel ${mode}` : label;
      button.setAttribute("aria-pressed", String(abilityMode === mode));
    }
    inspection.textContent = card
      ? `${name(card.id)} · ${cardText(card).split("\n").slice(1).join(" · ")}${armor ? ` · Armor ${Math.max(0, armor - (card.armorSpent ?? 0))}/${armor}` : ""}${healing ? ` · Close: heal an adjacent wounded ally for ${healing}` : ""}${shooting ? ` · Close: Shot ${shooting.strength.join("/")} · Range ${shooting.range}` : ""} · ${card.location.zone === "battlefield" ? card.location.cell : card.location.zone === "additional" ? "Air zone" : "Graveyard"}${card.flightStrike === "pending" ? " · Air strike next turn" : card.flightStrike === "ready" ? " · Air strike ready this turn" : ""} · strike ${state.definitions.find((definition) => definition.id === card.definition)!.simpleStrike.join("/")}${card.location.zone === "graveyard" ? " · dead" : ""}`
      : "Tap any creature to inspect it.";
    selectedName.textContent = card
      ? state.definitions.find((definition) => definition.id === card.definition)!.name
      : "Tap a creature";
    prompt.hidden =
      !battle.error && !playback.busy && !state.outcome && !defenders.length && !abilityMode;
    actionsToggle.disabled = playback.busy;
    if (playback.busy || defenders.length || state.outcome) closeActions();
    endTurn.hidden = !playback.busy && !bot && defenders.length > 0;
    endTurn.disabled = Boolean(playback.busy || bot || state.outcome || state.stack.length);
    takeAttack.hidden = playback.busy || bot || !defenders.length;

    log.textContent =
      battle.events
        .slice(0, playback.eventCount)
        .map(describe)
        .filter((line) => line !== null)
        .slice(-4)
        .reverse()
        .join(" · ") || "No actions yet.";
    return { selected, commands, defenders };
  }
  for (const [mode, button] of [
    ["shot", shot],
    ["heal", heal],
  ] as const) {
    button.onclick = () => {
      if (button.disabled || playback.busy) return;
      closeActions();
      abilityMode = abilityMode === mode ? null : mode;
      changed();
    };
  }
  endTurn.onclick = () => {
    if (playback.busy || battle.state.priorityPlayer !== "north") return;
    closeActions();
    creatureInfo.open = false;
    battle.decide({ type: "end-turn" });
    selected = null;
    abilityMode = null;
    present();
  };
  takeAttack.onclick = () => {
    if (playback.busy || battle.state.priorityPlayer !== "north") return;
    closeActions();
    creatureInfo.open = false;
    battle.decide({ type: "take-attack" });
    present();
  };
  prepareFlight.onclick = () => {
    if (!selected || playback.busy) return;
    act({ type: "prepare-flight", player: "north", card: selected });
  };
  function reset(): void {
    settings.open = false;
    closeActions();
    creatureInfo.open = false;
    selected = null;
    abilityMode = null;
  }
  document.querySelector<HTMLButtonElement>("#restart")!.onclick = restart;
  return {
    render,
    clickTarget,
    reset,
    animationFailed: () => {
      prompt.textContent = "Animation failed. You can continue or restart.";
    },
  };
}
