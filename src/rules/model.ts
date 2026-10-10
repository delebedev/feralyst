export type PlayerId = string;
export type CardId = string;
export type ActionId = number;
export type Die = 1 | 2 | 3 | 4 | 5 | 6;
export type Cell = `${"A" | "B" | "C" | "D" | "E"}${"3" | "2" | "1" | "1′" | "2′" | "3′"}`;
export type Phase = "preliminary" | "initial" | "main" | "final";
export type StrikeProfile = readonly [weak: number, medium: number, strong: number];

export type Location =
  | Readonly<{ zone: "battlefield"; cell: Cell }>
  | Readonly<{ zone: "deck" | "deal" | "recruitment" | "graveyard" | "additional" }>;

// Ability values describe the browser creatures; ordinary fixtures omit them.
export type CardDefinition = Readonly<{
  id: string;
  name: string;
  movementAllowance: number;
  lifeAllowance: number;
  simpleStrike: StrikeProfile;
  flight?: true;
  abilities?: Readonly<{
    armor?: number;
    heal?: number;
    shot?: Readonly<{ strength: StrikeProfile; range: number }>;
  }>;
}>;

export type CardInstance = Readonly<{
  id: CardId;
  definition: string;
  owner: PlayerId;
  controller: PlayerId;
  location: Location;
  status: "open" | "closed";
  movementMarkers: number;
  wounds: number;
  armorSpent?: number;
  flightStrike?: "pending" | "ready";
}>;

type ActionBase = Readonly<{
  id: ActionId;
  source: CardId;
  controller: PlayerId;
  effectsProduced: boolean;
}>;

export type MovementAction = ActionBase & Readonly<{ kind: "movement"; target: Cell }>;
export type StrikeAction = ActionBase &
  (Readonly<{ kind: "strike" }> | Readonly<{ kind: "shot" }>) &
  Readonly<{
    initialTarget: CardId;
    target: CardId;
    closeOnPayment: readonly CardId[];
    rolls: Readonly<{ source: Die; responder: Die | null }> | null;
    damage: Readonly<{ toTarget: number; toSource: number }> | null;
  }>;
export type HealAction = ActionBase & Readonly<{ kind: "heal"; target: CardId; amount: number }>;
export type DefenderAction = ActionBase & Readonly<{ kind: "defender"; attack: ActionId }>;
export type DestructionAction = ActionBase & Readonly<{ kind: "destruction" }>;
export type PrepareFlightAction = ActionBase & Readonly<{ kind: "prepare-flight" }>;
export type Action =
  | MovementAction
  | StrikeAction
  | HealAction
  | DefenderAction
  | PrepareFlightAction
  | DestructionAction;
export type Stage =
  | "declaration"
  | "target"
  | "roll"
  | "result"
  | "calculation"
  | "protection"
  | "wound"
  | "payment"
  | "ending";
export type StackObject = Readonly<{ stage: Stage; action: ActionId }>;
export type Outcome = Readonly<{ kind: "win"; winner: PlayerId }> | Readonly<{ kind: "draw" }>;

export type MatchState = Readonly<{
  players: readonly [PlayerId, PlayerId];
  definitions: readonly CardDefinition[];
  cards: readonly CardInstance[];
  activePlayer: PlayerId;
  priorityPlayer: PlayerId | null;
  phase: Phase;
  actions: Readonly<Record<ActionId, Action>>;
  nextActionId: number;
  stack: readonly StackObject[];
  pendingDestructions: readonly CardId[];
  consecutivePasses: 0 | 1;
  outcome: Outcome | null;
}>;

export type MoveCommand = Readonly<{ type: "move"; player: PlayerId; card: CardId; to: string }>;
export type StrikeCommand = (Readonly<{ type: "strike" }> | Readonly<{ type: "shot" }>) &
  Readonly<{
    player: PlayerId;
    card: CardId;
    target: CardId;
  }>;
export type HealCommand = Readonly<{
  type: "heal";
  player: PlayerId;
  card: CardId;
  target: CardId;
}>;
export type DefenderCommand = Readonly<{ type: "defend"; player: PlayerId; card: CardId }>;
export type PassCommand = Readonly<{ type: "pass"; player: PlayerId }>;
export type Command =
  | MoveCommand
  | StrikeCommand
  | HealCommand
  | DefenderCommand
  | PassCommand
  | Readonly<{ type: "prepare-flight"; player: PlayerId; card: CardId }>;
export type Rejection =
  | "battle-ended"
  | "unknown-player"
  | "unknown-card"
  | "not-controller"
  | "not-active-player"
  | "not-main-phase"
  | "no-priority"
  | "stack-not-empty"
  | "not-on-battlefield"
  | "card-closed"
  | "movement-exhausted"
  | "invalid-cell"
  | "not-orthogonal-neighbor"
  | "cell-occupied"
  | "unknown-target"
  | "target-not-on-battlefield"
  | "not-adjacent"
  | "not-inactive-player"
  | "no-defender-window"
  | "already-redirected"
  | "defender-not-adjacent"
  | "preliminary-phase-unsupported"
  | "no-heal-ability"
  | "invalid-heal-target"
  | "no-shot-ability"
  | "invalid-shot-target"
  | "flying-no-movement"
  | "cannot-strike-flyer"
  | "cannot-prepare-flight";

export type EngineEvent =
  | Readonly<{ type: "declared"; action: Action }>
  | Readonly<{ type: "resolved"; action: ActionId; stage: Stage }>
  | Readonly<{ type: "moved"; card: CardId; from: Cell; to: Cell }>
  | Readonly<{ type: "movement-paid"; card: CardId }>
  | Readonly<{ type: "rolled"; action: ActionId; card: CardId; value: Die }>
  | Readonly<{ type: "calculated"; action: ActionId; toTarget: number; toSource: number }>
  | Readonly<{ type: "redirected"; attack: ActionId; from: CardId; to: CardId }>
  | Readonly<{ type: "healed"; card: CardId; source: CardId; amount: number }>
  | Readonly<{ type: "prevented"; card: CardId; source: CardId; amount: number }>
  | Readonly<{ type: "wounded"; card: CardId; source: CardId; amount: number }>
  | Readonly<{ type: "destroyed"; card: CardId; owner: PlayerId }>
  | Readonly<{ type: "closed" | "refreshed"; card: CardId }>
  | Readonly<{ type: "prepared-flight"; card: CardId }>
  | Readonly<{ type: "phase-started"; phase: Phase; player: PlayerId }>
  | Readonly<{ type: "cancelled"; action: ActionId }>
  | Readonly<{ type: "ended"; outcome: Outcome }>;

export type CommandResult =
  | Readonly<{ ok: true; state: MatchState; events: readonly EngineEvent[] }>
  | Readonly<{ ok: false; reason: Rejection; state: MatchState }>;
export type DiceSource = () => number;
