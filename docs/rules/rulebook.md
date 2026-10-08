# Feralyst rulebook

This English edition is Feralyst's authoritative rules text. It translates the [archived *Berserk Online* expanded rules](https://web.archive.org/web/20131006081326/http://berserk.mail.ru/rashirennye_pravila.html), preserved in this repository as [original HTML](source/expanded-rules.html.txt) with [provenance](source/provenance.json). The source identifies its copyright holder as © ООО БЕРСЕРК ОНЛАЙН. Rule numbers and inherited examples are retained. English wording awaits Denis's translation review. Notes explicitly marked **Translator's note** describe gaps or inconsistencies in the source; they do not change the rules.

**Terms.** *Card* translates карта; *battlefield* translates поле боя; *cell* translates клетка; *token* translates фишка; *marker* translates маркер. A card's *owner* is its original deck holder; its *controller* is the player whose squad currently contains it. *Game action* translates игродействие; *ability* translates особенность; *property* translates свойство; *wound* translates рана; *close* and *open* describe the source's two card states. *Bring into a squad* translates взять в отряд, which includes several methods; *recruit* translates the narrower набрать в отряд. Square-bracketed labels such as **[Close]** render symbols whose meanings the source states in words.

## Contents

1. [The game](#part-1)
2. [Components of play](#part-2)
3. [Battle and turn structure](#part-3)
4. [Abilities, properties, effects, and modifiers](#part-4)
5. [Dictionary](#part-5)
6. [Glossary](#part-6)

<a id="part-1"></a>

## 1. The game

<a id="r-100"></a>

### 100. General provisions

<a id="r-100-1"></a>**100.1** These rules describe a game between two players. Most also apply to games with three or more players, but complete multiplayer rules are not given here. **Translator's note:** The source contains a placeholder for a link saying that multiplayer rules are in development; no such rules are supplied.

<a id="r-100-2"></a>**100.2** Play requires a battlefield of 5 × 6 cells, a die, and small objects to show wounds, tokens, and permanent and temporary effects.

<a id="r-100-2-a"></a>**100.2.a** Each player also needs a physical *Berserk* CCG deck of at least 30 cards for constructed play, or at least 20 cards for draft or sealed play.

<a id="r-100-2-b"></a>**100.2.b** In constructed play, a deck may contain no more than three copies of a card with the same name.

<a id="r-100-3"></a>**100.3** A deck may contain no more than 50 cards.

<a id="r-100-4"></a>**100.4** Most *Berserk* CCG tournaments have specific rules that may prohibit certain cards and restrict the permitted editions. For details, consult the Tournament Rules. **Translator's note:** The source does not include those rules.

<a id="r-101"></a>

### 101. Starting the game

<a id="r-101-1"></a>**101.1** Before the game, each player receives starting game crystals: 23 gold and 22 silver.

<a id="r-101-2"></a>**101.2** Players then shuffle their decks into random order. Either player may then shuffle the opponent's deck. Cutting the opponent's deck counts as shuffling it.

<a id="r-101-3"></a>**101.3** After the player who goes second has been determined, that player receives one additional silver crystal. If turn order changes, the crystal passes to the other player as well.

<a id="r-102"></a>

### 102. Victory and defeat

<a id="r-102-1"></a>**102.1** The game ends immediately when a player wins or loses, or when the game ends in a draw.

<a id="r-102-2"></a>**102.2** There are several ways to win.

<a id="r-102-2-a"></a>**102.2.a** A player who controls creatures wins if the opponent loses.

<a id="r-102-2-b"></a>**102.2.b** Resolving certain effects may cause a player to win.

<a id="r-102-3"></a>**102.3** There are several ways to lose.

<a id="r-102-3-a"></a>**102.3.a** If a player controls no creatures on the battlefield or in the additional zone and the stack is empty, that player loses when either player gains priority. This is a **base effect** (see [421](#r-421)). The opponent wins in this case.

<a id="r-102-3-b"></a>**102.3.b** A player may concede at any time and loses immediately.

<a id="r-102-3-c"></a>**102.3.c** A player who wins and loses simultaneously loses.

<a id="r-102-3-d"></a>**102.3.d** Resolving certain effects may cause a player to lose.

<a id="r-102-4"></a>**102.4** If both players win or both players lose simultaneously, the game ends in a draw.

<a id="r-102-5"></a>**102.5** Players may agree to a draw at any time.

<a id="r-103"></a>

### 103. Golden rules of the *Berserk* CCG

<a id="r-103-1"></a>**103.1** If a card's text directly contradicts a rule, the card's text overrides that rule. This always applies except to verbal declarations that end the game (the source cites [102.3.b](#r-102-3-b) and 102.6). A direct contradiction means an explicit instruction to bypass a rule. *Example:* Mirage says, “You may bring two different terrain cards into your squad; the second terrain costs one crystal less.” This explicitly bypasses [212.3](#r-212-3). **Translator's note:** The source contains no rule 102.6.

<a id="r-103-2"></a>**103.2** Prohibiting abilities and effects take precedence over corresponding permissions. *Example:* Jilla's text lets opposing creatures accumulate tokens. An opposing Joker whose text says it cannot accumulate tokens still cannot do so.

<a id="r-103-3"></a>**103.3** If resolving an ability or effect requires an impossible action, that ability or effect is canceled without payment.

<a id="r-103-4"></a>**103.4** If resolving abilities or effects creates an infinite chain, block the first effect that exactly repeats an earlier effect in that chain, and block every later effect in that chain. *Example:* A player's Charon gains a token. The opponent's Cursed Mage gains a token because of Charon. The player's Cursed Mage gains a token because of the opponent's Cursed Mage. The opponent's Cursed Mage would gain another token because of the player's Cursed Mage. Its earlier token was gained because of Charon, so the chain continues. The player's Cursed Mage would then gain another token because of the opponent's Cursed Mage. That exact effect has already occurred, so the chain stops. Charon and the player's Cursed Mage gain one token each; the opponent's Cursed Mage gains two.

<a id="r-103-5"></a>**103.5** If both players must declare a game action or make a choice simultaneously, the active player declares first, then the inactive player (see [200.4](#r-200-4)).

<a id="r-103-6"></a>**103.6** A card cannot declare or perform a game action unless it has the resources to pay for it. *Example:* An Elf Scout has declared “intercept” against a creature. Until it pays for intercept, it cannot declare another game action that requires closing.

<a id="r-103-7"></a>**103.7** A non-attack ability or property with a numerical value of zero cannot be declared or performed. **Translator's note:** The source reads “property ability” without a conjunction; both terms are retained here.

<a id="r-103-7-a"></a>**103.7.a** An ability requiring zero tokens as payment cannot be declared.

<a id="r-103-7-b"></a>**103.7.b** An attack that deals zero wounds deals no wounds.

<a id="r-104"></a>

### 104. Numbers and symbols

<a id="r-104-1"></a>**104.1** The *Berserk* CCG uses only integers. If an ability or effect would produce a fraction, the text of the card that is its source specifies whether to round up or down.

<a id="r-104-2"></a>**104.2** The *Berserk* CCG uses only positive numbers and zero unless stated otherwise. If an effect, ability, or property lowers a value below zero, treat it as zero for all references to that value except references that modify it, and except when calculating the difference between two creatures' die rolls in combat. *Example:* Tree Keeper's healing effect gives Umpi −2 to its strike. Umpi's printed strike is 1–1–1. If Umpi strikes, its strength is zero; nevertheless, Ingri's ability granting +2 to strike treats Umpi's simple strike as (−1)–(−1)–(−1). *Example:* A Cursed Stone Golem attacking the opponent's Zendar rolls 1. After modifiers the roll result is −1; that is the value compared with Zendar's roll.

<a id="r-104-2-a"></a>**104.2.a** Outside the calculation of combat results between two open creatures, die-roll results below 1 or above 6 become the nearest number from 1 to 6. *Example:* If a Cursed Stone Golem attacks a closed creature and rolls 1, the result remains 1 even after all modifiers.

<a id="r-104-2-b"></a>**104.2.b** If an ability or effect requires determining or stating the strength of one of a card's attacks, determine it without modifiers. The Great Anvil grants a chosen dwarf a throw with strength equal to its weak simple strike. Tugarin Zmeyevich in the same squad gives +1 to its weak simple strike, but the throw uses the unmodified value.

<a id="r-104-3"></a>**104.3** Symbols show these card properties: **[Gold cost]** and **[Silver cost]** for cost, **[Life]** for life, **[Movement]** for movement allowance, **[Simple strike]** for simple strike, **[Flight]** for flight, and **[Symbiote/Parasite]** for symbiote or parasite. A card need not have every property; they depend on its type (see [208](#r-208)).

<a id="r-104-4"></a>**104.4** **[Close]** in an ability's cost means the card must close to use that ability. Closed cards cannot declare abilities with **[Close]**. Nor can a card that has already declared such an ability declare another while that ability's objects remain on the stack (see [103.6](#r-103-6)).

<a id="r-104-5"></a>**104.5** **[Token]** before a colon means the card must spend a token to pay for the following game action. **X[Token]** means it must spend X tokens, where X is greater than zero.

<a id="r-104-6"></a>**104.6** **[Sudden action]** means the action can be declared whenever the player controlling its card has priority.

<a id="r-104-7"></a>**104.7** Ability symbols abbreviate abilities to save space on cards. They mean, respectively: **[Protection from Spells]**, **[Protection from Sudden Actions]**, **[Protection from Poison]**, **[Protection from Shots]**, **[Protection from Magic]**, **[Uniqueness]**, **[Strike Across a Row]**, **[Directed Strike]**, **[Regeneration]**, and **[Protection from Discharges]**.

<a id="r-104-8"></a>**104.8** A card's element is shown only by its background color, which therefore counts as a symbol.

| Background | Element |
| --- | --- |
| Steppe design | Steppe |
| Forest design | Forest |
| Mountain design | Mountains |
| Swamp design | Swamps |
| Darkness design | Darkness |
| Neutral design | No element; Neutral card |

<a id="part-2"></a>

## 2. Components of play

<a id="r-200"></a>

### 200. General provisions

<a id="r-200-1"></a>**200.1** A **game action** is the smallest unit of game time. Effects consist of game actions.

<a id="r-200-1-a"></a>**200.1.a** Performing a game action is any change in a game zone or on the stack. Passing is also a game action.

<a id="r-200-2"></a>**200.2** When a rule or card text says “card,” it means an original *Berserk* CCG card with its corresponding face and back. Effects represented by cards and the abilities of cells are not cards.

<a id="r-200-2-a"></a>**200.2.a** A card's **owner** is the player who began the game with it in their deck.

<a id="r-200-2-b"></a>**200.2.b** A card's **controller** is the player whose squad currently contains it. This also applies in the recruitment, dealing, graveyard, and deck zones.

<a id="r-200-3"></a>**200.3** Exact card text, including corrections and errata, can be found in the [*Berserk* Card Catalogue](http://www.berserk.ru/catalog.html).

<a id="r-200-4"></a>**200.4** A **player** is one of the two people in the game. The **active player** is the player whose turn is in progress; the opponent is the **inactive player**.

<a id="r-200-5"></a>**200.5** An **ability** is either a triggered or playable ability on the stack, or card text explaining that card's game mechanics.

<a id="r-200-5-a"></a>**200.5.a** The **controller of an ability** is the player who put it on the stack. Changing control of the card that is the ability's source does not change control of the ability already on the stack.

<a id="r-200-6"></a>**200.6** A **marker** is a mark on a card showing its state. Named conditions such as Poisoning, Curse, and Blessing have markers. Wounds also have markers. Tokens are markers.

<a id="r-200-7"></a>**200.7** Information on a card is either game information or non-game information. Non-game information consists of its illustration, flavor text, rarity symbol, printed-set symbol, and the illustrator's name, surname, or nickname. Game information consists of the card's name, element, crystal cost, elite status, movement allowance, flight symbol, symbiote symbol, starting life, simple-strike strength in weak–medium–strong order, the words “equipment,” “terrain,” or “artifact,” and the text of its abilities.

<a id="r-200-7-a"></a>**200.7.a** All game information on a card other than its ability text is a **property** of the card.

<a id="r-201"></a>

### 201. Name

<a id="r-201-1"></a>**201.1** A card's name is printed in the center, immediately below its illustration.

<a id="r-201-2"></a>**201.2** If a card's text includes its own name, that text means this card specifically. Other cards with the same name are unaffected, except when bringing a card into a squad. **Translator's note:** The source says “test” where context indicates “text.”

<a id="r-201-2-a"></a>**201.2.a** If a card's ability gives another card an ability containing the first card's name, that name refers specifically to the first card, not other cards with the same name. *Example:* An Ifrit grants the player's creatures an ability allowing them to give tokens to that Ifrit, but not to the opponent's Ifrit.

<a id="r-201-3"></a>**201.3** Two cards with the same name can differ completely in their other properties. Talgata from *Will of the Temple* and Talgata from *Gates of Worlds* have the same name, but most of their other properties differ.

<a id="r-202"></a>

### 202. Cost, elite status, and element

<a id="r-202-1"></a>**202.1** A card's cost is the number beside the crystal symbol under its name, near the left edge.

<a id="r-202-2"></a>**202.2** The crystal symbol's color shows elite status. A gold crystal marks an **elite** card; a silver crystal marks a **regular** card.

<a id="r-202-3"></a>**202.3** Cost includes elite status. Knowing a card's cost therefore also establishes its elite status.

<a id="r-202-3-a"></a>**202.3.a** Cards with the same numerical cost but different elite status have different costs.

<a id="r-202-3-b"></a>**202.3.b** If ability text specifies only a numerical cost, the ability applies to cards of either elite status.

<a id="r-202-3-c"></a>**202.3.c** Ignore elite status when determining which cards cost more or less.

<a id="r-202-4"></a>**202.4** Some cards show a cost of X or N+X, where N is a known number that varies by card and X is unspecified. The player chooses X and announces it when revealing that card.

<a id="r-202-4-a"></a>**202.4.a** Cards costing X or N+X are revealed before other cards during the preliminary phase.

<a id="r-202-5"></a>**202.5** Some cards show a cost of {X}. Their text states how to pay it. That method of payment is a property of the card.

<a id="r-202-6"></a>**202.6** Some cards have an ability allowing recruitment for an alternative cost. If that ability was used when placing a card in the recruitment pool, reveal it before other cards during the preliminary phase.

<a id="r-202-7"></a>**202.7** A card's element is not separately printed; it appears in the design of the front border. See [104.8](#r-104-8) for the elemental border styles.

<a id="r-202-8"></a>**202.8** There are five elements: Steppe, Forest, Mountains, Swamps, and Darkness.

<a id="r-202-9"></a>**202.9** A card cannot have several elements. It can have no element; such a card is **Neutral**.

<a id="r-203"></a>

### 203. Movement allowance and movement

<a id="r-203-1"></a>**203.1** A card's **movement allowance** is the number after its **[Movement]** symbol.

<a id="r-203-1-a"></a>**203.1.a** Movement allowance is a card property.

<a id="r-203-2"></a>**203.2** **Movement** is the property of moving on the battlefield. A moving card enters an adjacent cell in the same row or column as its current cell.

<a id="r-203-2-a"></a>**203.2.a** The destination cell declared by the card is the target of movement.

<a id="r-203-3"></a>**203.3** A card gains a movement marker as payment for moving, even if the movement is blocked. At the beginning of a player's turn, remove all movement markers from cards they control at the same time those cards open.

<a id="r-203-4"></a>**203.4** **Unused movement** is the card's movement allowance minus its movement markers. It shows how many more times that card can use movement during the turn.

<a id="r-203-4-a"></a>**203.4.a** Recalculate unused movement whenever the card's controller gains priority. Thus changing either the allowance or the number of movement markers changes unused movement. This is a base effect.

<a id="r-203-5"></a>**203.5** Movement cannot be used during an opponent's turn.

<a id="r-203-6"></a>**203.6** Closed cards cannot use movement.

<a id="r-203-7"></a>**203.7** Opening a card removes all its movement markers.

<a id="r-203-8"></a>**203.8** Using movement is not a sudden action. It can be used only when the stack is empty, the card's controller has priority, and the “before–during–after” principle is satisfied. **Translator's note:** The source names this principle but does not define it.

<a id="r-203-9"></a>**203.9** A card with **[Symbiote/Parasite]** in place of a movement allowance is a symbiote or parasite, usually as its text states. If the text does not specify which, it is a symbiote. It cannot use movement.

<a id="r-203-10"></a>**203.10** A card with **[Flight]** in place of a movement allowance is a flying creature and cannot use movement.

<a id="r-203-11"></a>**203.11** A card that has declared movement or any other relocation cannot declare a game action whose cost requires it to close.

<a id="r-203-12"></a>**203.12** Some named abilities are movement: Jump, Teleportation, and Maneuver.

<a id="r-203-13"></a>**203.13** A card may use movement described in [203.12](#r-203-12) even when its unused movement is zero.

<a id="r-204"></a>

### 204. Life allowance

<a id="r-204-1"></a>**204.1** A card's **life allowance** is the number after its **[Life]** symbol. It is the number of life units with which the card begins battle.

<a id="r-204-1-a"></a>**204.1.a** Life allowance is constant and cannot change.

<a id="r-204-2"></a>**204.2** **Additional life** consists of life units gained above the life allowance.

<a id="r-204-3"></a>**204.3** A card cannot gain more additional life than the difference between its **life maximum** and its life allowance.

<a id="r-204-3-a"></a>**204.3.a** Life maximum is a card property. It has no default value. Some abilities set a card's life maximum.

<a id="r-204-4"></a>**204.4** **Wounds** are markers cards receive during play from attacks, certain spells, and certain influences. If a spell or influence inflicts wounds, the source card's text says so explicitly.

<a id="r-204-5"></a>**204.5** **Negative life** is analogous to additional life but works in the opposite direction: life taken from the starting allowance. Negative life is not wounds.

<a id="r-204-6"></a>**204.6** A card's **current life** is its life allowance plus additional life, minus wound markers and negative life.

<a id="r-204-7"></a>**204.7** Abilities that leave a card with X current life do not operate on its negative or additional life. They change only its number of wounds.

<a id="r-204-8"></a>**204.8** Additional life and negative life are markers, just as wounds are.

<a id="r-205"></a>

### 205. Combat, attack strength, and simple strike

<a id="r-205-1"></a>**205.1** An attack's **strength** is its numerical value: how many wounds it can potentially deal.

<a id="r-205-1-a"></a>**205.1.a** For a performed attack, calculate its strength with all applicable modifiers. To determine attack strength as a card's ability or property, use the unmodified value.

<a id="r-205-2"></a>**205.2** Attacking with a **simple strike** is a card property. A simple strike is an attack. Its values are also card properties.

<a id="r-205-2-a"></a>**205.2.a** A card may attack with a simple strike only during its controller's own turn, when the stack is empty and that player has priority and is the active player.

<a id="r-205-3"></a>**205.3** A **defender** may be assigned against a simple-strike attack. Assigning one redirects the attack to the defending creature.

<a id="r-205-3-a"></a>**205.3.a** Any open creature adjacent both to the attack's source and to its target may defend.

<a id="r-205-3-b"></a>**205.3.b** Assigning a defender is a sudden action.

<a id="r-205-3-c"></a>**205.3.c** Only the inactive player may assign a defender.

<a id="r-205-4"></a>**205.4** Roll a die to determine attack strength, including a simple strike against a closed card. With all modifiers, a result of 3 or less gives a **weak** attack; 4 or 5, a **medium** attack; and 6, a **strong** attack.

<a id="r-205-5"></a>**205.5** **Combat** is the interval from a card's die roll to determine attack strength until wounds from attacks are dealt to cards (see [216.5](#r-216-5) and [216.9](#r-216-9)).

<a id="r-205-5-a"></a>**205.5.a** Combat occurs even if only one creature fights, regardless of the current battle phase or turn phase or of the attack's type or kind.

<a id="r-205-5-b"></a>**205.5.b** A card that does not fight cannot roll to determine attack strength. Consequently, every simple strike targeting it treats it as closed.

<a id="r-205-5-c"></a>**205.5.c** Some artifacts, equipment, and terrain can attack. In that case they may roll to determine attack strength even though they do not fight by default.

<a id="r-205-6"></a>**205.6** Use the following strike table to determine simple-strike strength when two open creatures fight. The difference is between their die-roll results.

| Difference favoring initiating creature | Initiating creature deals | Responding creature deals |
| --- | --- | --- |
| 1 | Weak strike | Miss |
| 2 | Medium strike | Weak strike |
| 3 | Medium strike | Miss |
| 4 | Strong strike | Weak strike |
| 5 or more | Strong strike | Miss |

| Difference favoring responding creature | Initiating creature deals | Responding creature deals |
| --- | --- | --- |
| 1 | Weak strike | Miss |
| 2 | Miss | Miss |
| 3 | Miss | Weak strike |
| 4 | Weak strike | Medium strike |
| 5 or more | Miss | Medium strike |

| Difference of 0 | Initiating creature deals | Responding creature deals |
| --- | --- | --- |
| Both rolled 4 or less | Weak strike | Miss |
| Both rolled 5 or more | Miss | Weak strike |

<a id="r-205-7"></a>**205.7** For a value X–Y–Z, X is the strength of a weak attack, Y of a medium attack, and Z of a strong attack.

<a id="r-205-7-a"></a>**205.7.a** “Attack for X” is likewise treated as X–X–X.

<a id="r-205-7-b"></a>**205.7.b** The same X–Y–Z assignment applies to non-attack abilities by the principle described in [205.5](#r-205-5) and [205.7](#r-205-7), except that they have no “strength.”

<a id="r-206"></a>

### 206. Zones

<a id="r-206-1"></a>**206.1** **Game zones** are the places where cards can be during play. All game zones participate in the game.

<a id="r-206-2"></a>**206.2** There are six kinds of game zone: **Deck**, **Deal**, **Recruitment**, **Graveyard**, **Battlefield**, and **Additional Zone**. “In the squad” is a separate term combining the Battlefield and Additional Zone.

<a id="r-206-3"></a>**206.3** Deck, Deal, Recruitment, and Graveyard are **personal zones**: each player has one of each. Thus player A and player B each have a Deck, Recruitment, and Graveyard.

<a id="r-206-3-a"></a>**206.3.a** A personal zone may contain only cards owned by that zone's player. If a rule or ability would put a card in another player's personal zone, put it in the corresponding zone of the card's owner instead.

<a id="r-206-4"></a>**206.4** The Battlefield and Additional Zone are shared zones. They can contain both players' cards and belong to neither player.

<a id="r-206-5"></a>**206.5** The Deck is a **closed zone**. Neither player may inspect its cards except when ability text instructs them to.

<a id="r-206-6"></a>**206.6** Deal and Recruitment are **partly closed zones**. Only the player to whom the Deal or Recruitment zone belongs may inspect its cards.

<a id="r-206-7"></a>**206.7** Graveyard, Battlefield, and Additional Zone are **open zones**. Either player may inspect any card in them at any time.

<a id="r-206-8"></a>**206.8** Whenever a card changes game zones, reveal it to all players so they can read it in full. This does not apply to movement into or out of Recruitment or Deal.

<a id="r-206-9"></a>**206.9** Players may not reorder cards in either player's Graveyard or Deck unless a rule or ability instructs them to.

<a id="r-206-10"></a>**206.10** Shuffle a Deck after each operation on it: putting a card into it from another zone, taking a card out to another zone, inspecting it, or revealing a card from it.

<a id="r-206-11"></a>**206.11** Players' Decks, Graveyards, Deals, and Recruitments, and the Additional Zones are unstructured zones. The players identify them by verbal agreement alone.

<a id="r-207"></a>

### 207. Battlefield

<a id="r-207-1"></a>**207.1** The Battlefield is the game's only structured zone. Its basic unit is a **cell**, a rectangle large enough to hold an open or closed card. All cells have the same size.

<a id="r-207-2"></a>**207.2** The Battlefield is a rectangle of six horizontal rows with five cells each, aligned in columns.

<a id="r-207-3"></a>**207.3** A line between rows three and four divides the Battlefield into two halves. Each half has three rows of five cells.

<a id="r-207-3-a"></a>**207.3.a** Each half determines one player's starting arrangement. Thus the rules refer to the first player's half and the second player's half.

<a id="r-207-3-b"></a>**207.3.b** Rows on a player's half are numbered from the opponent's half: the nearest is the first row, the farthest the third, and the middle the second.

<a id="r-207-4"></a>**207.4** A player's **deployment zone** is the set of Battlefield cells on which that player must place cards first during the deployment step. **Translator's note:** The source drops the beginning of this sentence (“...deployment zone”).

<a id="r-207-4-a"></a>**207.4.a** The first player's deployment zone is every cell on their half except the far-left and far-right cells of each row. The second player's deployment zone is every cell of their first row, plus every cell of their second and third rows except the far-left and far-right cells.

<a id="r-207-5"></a>**207.5** Battlefield cells have coordinates. Viewed with the first player's half nearest the viewer, that half's first, second, and third rows are numbered 1, 2, and 3. The opponent's first, second, and third rows are 1′, 2′, and 3′. Within each row, the columns are A through E from left to right.

<a id="r-207-5-a"></a>**207.5.a** Write a cell's letter before its number, for example A2, B3, or D1′ (“D one prime”).

| Row | A | B | C | D | E |
| --- | --- | --- | --- | --- | --- |
| 3′ | A3′ | B3′ | C3′ | D3′ | E3′ |
| 2′ | A2′ | B2′ | C2′ | D2′ | E2′ |
| 1′ | A1′ | B1′ | C1′ | D1′ | E1′ |
| 1 | A1 | B1 | C1 | D1 | E1 |
| 2 | A2 | B2 | C2 | D2 | E2 |
| 3 | A3 | B3 | C3 | D3 | E3 |

<a id="r-207-6"></a>**207.6** Cells in the same **vertical** share a letter. Cells in the same **horizontal** share a number, including its prime mark: they are in the same row. Cells in a **diagonal** touch only at their corners and differ successively by one letter and one number; for example C3, D2, and E1.

<a id="r-207-6-a"></a>**207.6.a** A **line** includes a vertical, horizontal, or diagonal. A rule or ability referring to a line refers to all three. When one must be chosen, the ability's controller chooses.

<a id="r-207-6-b"></a>**207.6.b** “On the same vertical/horizontal/diagonal as [card]” means on the corresponding line through that card's cell. Most cells belong to two diagonals. For example, B2 lies on A1–B2–C3 and A3–B2–C1–D1′–E2′.

<a id="r-207-7"></a>**207.7** A **neighboring cell** differs from the original cell by one letter or number, including the prime mark, and shares a line with it. For D2′ these are D1′, E1′, E2′, E3′, D3′, C3′, C2′, and C1′. For A1 they are A1′, B1′, B1, B2, and A2.

<a id="r-207-7-a"></a>**207.7.a** A card in a neighboring cell is an **adjacent card**.

<a id="r-207-8"></a>**207.8** The cell **in front of** a card is a neighboring cell on the same vertical. Which one depends only on the card's controller: for the first player, A1′ is in front of A1; for the second player, A2 is in front of A1.

<a id="r-207-9"></a>**207.9** The **direction** of a melee attack or movement is the line through two neighboring cells, with the source in the first and the target in the second. Direction cannot be determined unless source and target are neighbors.

<a id="r-207-9-a"></a>**207.9.a** “In the direction of ...” a melee attack or movement means the cell on the same line as its source and target, neighboring the target but different from the source's cell. Thus, with source at B1′ and target at C1, that cell is D2.

<a id="r-208"></a>

### 208. Card types and classes

<a id="r-208-1"></a>**208.1** There are four card types: creature, terrain, artifact, and equipment.

<a id="r-208-2"></a>**208.2** Creature has three subtypes: flying creature, parasite, and symbiote.

<a id="r-208-2-a"></a>**208.2.a** A creature can have no subtype.

<a id="r-208-3"></a>**208.3** Card types and subtypes differ in their properties and their rules of play.

<a id="r-208-4"></a>**208.4** A card may change type during play. It then gains or loses all required properties, and the rules for its new type apply.

<a id="r-208-5"></a>**208.5** A card cannot have more than one type or subtype.

<a id="r-208-6"></a>**208.6** A card's **class** is an ability. A class does nothing by itself but matters to many other abilities.

<a id="r-208-6-a"></a>**208.6.a** A card of any type or subtype may have one or several classes.

<a id="r-208-6-b"></a>**208.6.b** The classes present when these rules were published are: Angel, Archaalite, Orc, Linung, Koyar, Elf, Forest Guardian, Akkenian, Coven, Dwarf, River Maiden, Inquisitor, Harpy, Spawn, Dragon, Overlord, Toa-Dan, Child of Krong, Yordling, Slua, Demon, Troll, Warrior Hero, and Mage Hero.

<a id="r-209"></a>

### 209. Creature

<a id="r-209-1"></a>**209.1** Creature is the main card type. This section covers creatures without a subtype.

<a id="r-209-2"></a>**209.2** A creature has these properties: name, cost, elite status, movement allowance, life allowance, simple-strike strength as X–Y–Z, movement, attacking with a simple strike, acting as a defender, closing to attack flying creatures, and fighting an open opposing creature.

<a id="r-209-3"></a>**209.3** Only an open creature may move, attack with a simple strike, defend, close to attack a flying creature, or fight an open opposing creature.

<a id="r-209-4"></a>**209.4** Place a creature on a Battlefield cell during deployment.

<a id="r-210"></a>

### 210. Symbiotes and parasites

<a id="r-210-1"></a>**210.1** Symbiotes have every property of ordinary creatures except movement.

<a id="r-210-2"></a>**210.2** Place a symbiote on a Battlefield cell during deployment. During the reveal step, its owner designates a creature in their squad as its **host**. Then put the symbiote in the same cell as its host.

<a id="r-210-3"></a>**210.3** Only a creature on the Battlefield without a subtype may be chosen as a symbiote's host. If its host gains a subtype or stops being a creature during play, the symbiote dies.

<a id="r-210-4"></a>**210.4** A creature may host only one symbiote.

<a id="r-210-5"></a>**210.5** Only an incorporeal symbiote may be assigned to an incorporeal creature. If a symbiote's host becomes incorporeal during play, its corporeal symbiote dies.

<a id="r-210-6"></a>**210.6** If the host receives a destruction effect, its symbiote receives the same effect. After it resolves, both enter the graveyard in this order: host, then symbiote. If the destruction effect is canceled, both remain in the squad.

<a id="r-210-7"></a>**210.7** If the host changes game zones, its symbiote receives a destruction effect that cannot be canceled or blocked. This is a base effect.

<a id="r-210-8"></a>**210.8** A symbiote moves with its host on the Battlefield. The symbiote does not count as using movement, even when its host does.

<a id="r-210-9"></a>**210.9** A symbiote is considered adjacent to every card adjacent to its host, and vice versa.

<a id="r-210-9-a"></a>**210.9.a** A symbiote and its host are considered adjacent to each other.

<a id="r-210-10"></a>**210.10** A symbiote cannot be finished off.

<a id="r-210-11"></a>**210.11** A symbiote cannot be moved separately from its host except under [210.11.a](#r-210-11-a). Abilities that move it without moving its host are blocked. It enters a cell simultaneously with its host.

<a id="r-210-11-a"></a>**210.11.a** Some abilities change a symbiote's host. They move the symbiote without its former host and do not cause a destruction effect.

<a id="r-210-12"></a>**210.12** If the opponent gains control of a symbiote's host, the symbiote remains under its former controller.

<a id="r-210-13"></a>**210.13** Parasites follow all symbiote rules except the differences in [210.14](#r-210-14)–[210.15](#r-210-15).

<a id="r-210-14"></a>**210.14** Choose a parasite's host from opposing cards in their first row only.

<a id="r-210-15"></a>**210.15** During deployment, a parasite does not pass under the control of the player controlling its host.

<a id="r-211"></a>

### 211. Flying creatures

<a id="r-211-1"></a>**211.1** Flying creatures have every property of ordinary creatures except movement and closing to attack flying creatures.

<a id="r-211-2"></a>**211.2** Deploy flying creatures on the Battlefield normally, then transfer them to the Additional Zone during reveal. This is a base effect, but is not relocation.

<a id="r-211-2-a"></a>**211.2.a** A flying creature also enters the Additional Zone if it was hidden and is revealed, summoned to a cell, resurrected to a cell, incarnated, or brought into a squad by any other means. This is a base effect. The abilities and effects of that cell do not trigger for it.

<a id="r-211-3"></a>**211.3** Abilities that relocate cards cannot be declared targeting flying creatures.

<a id="r-211-4"></a>**211.4** Flying creatures are not adjacent to any card in either squad.

<a id="r-211-5"></a>**211.5** A flying creature may make a simple-strike attack against any card on the Battlefield or in the Additional Zone.

<a id="r-211-6"></a>**211.6** A flying creature may defend another flying creature. It may defend a Battlefield card against another flying creature's attack, but not against a non-flying creature's attack. A non-flying creature adjacent to an attack's target may defend against a flying creature's attack.

<a id="r-211-7"></a>**211.7** No more than 15 crystals may be spent recruiting flying creatures, regardless of elite status.

<a id="r-211-8"></a>**211.8** Non-flying creatures cannot attack flying creatures with a simple strike except as described in [211.9](#r-211-9).

<a id="r-211-9"></a>**211.9** If the opponent's squad has no non-flying creatures, your non-flying creatures gain the property of closing on your turn so that, once on your next turn, they may attack a flying creature with a simple strike. This is called **closing to strike a flying creature** and is a slow action.

<a id="r-212"></a>

### 212. Terrain

<a id="r-212-1"></a>**212.1** Terrain has two properties: cost and elite status.

<a id="r-212-2"></a>**212.2** Terrain cannot be attacked; all attacks against it become illegal.

<a id="r-212-3"></a>**212.3** A player may bring no more than one terrain card into their squad.

<a id="r-212-4"></a>**212.4** Place terrain on a Battlefield cell during deployment, then move it to the Additional Zone during reveal.

<a id="r-213"></a>

### 213. Artifact

<a id="r-213-1"></a>**213.1** An artifact has three properties: cost, elite status, and life allowance.

<a id="r-213-2"></a>**213.2** Place an artifact on a Battlefield cell during deployment.

<a id="r-213-3"></a>**213.3** An artifact does not fight.

<a id="r-213-4"></a>**213.4** Calculate every attack against an artifact as an attack against a closed card.

<a id="r-214"></a>

### 214. Equipment

<a id="r-214-1"></a>**214.1** Equipment has three properties: class, cost, and elite status.

<a id="r-214-2"></a>**214.2** Equipment always has at least one of four classes: Weapon, Armor, Shield, or Potion. It may have several of these classes.

<a id="r-214-2-a"></a>**214.2.a** Equipment classes other than Weapon, Shield, Armor, or Potion are abilities of the equipment.

<a id="r-214-3"></a>**214.3** Equipment cannot be attacked; all attacks against it become illegal.

<a id="r-214-4"></a>**214.4** Place equipment on a Battlefield cell during deployment. During reveal, its owner designates a creature in their squad as its **host**, which wears it. Put the equipment in the host's cell.

<a id="r-214-4-a"></a>**214.4.a** Only a creature with at least one class may be designated as an equipment host.

<a id="r-214-4-b"></a>**214.4.b** A creature that loses its class remains the host of equipment it is wearing.

<a id="r-214-5"></a>**214.5** A creature may wear only one piece of equipment of a given class. A creature already wearing equipment of a class cannot be chosen as host for another piece of that class.

<a id="r-214-6"></a>**214.6** Symbiotes, parasites, flying creatures, and incorporeal creatures cannot wear or host equipment.

<a id="r-214-7"></a>**214.7** If an equipped creature becomes a symbiote, parasite, or flying creature, or becomes incorporeal, its equipment dies. This is a base effect.

<a id="r-214-8"></a>**214.8** If a host receives a destruction effect, its equipment receives the same effect. After it resolves, both enter the graveyard in this order: host, then equipment. If the effect is canceled, both remain in the squad.

<a id="r-214-9"></a>**214.9** Equipment moves with its host and cannot move separately. Abilities that move it without moving its host are blocked. Both enter a cell simultaneously.

<a id="r-214-9-a"></a>**214.9.a** Equipment does not count as having used movement when its host uses movement.

<a id="r-214-10"></a>**214.10** Equipment is adjacent to every card adjacent to its host, and vice versa.

<a id="r-214-10-a"></a>**214.10.a** Equipment and its host are considered adjacent to each other.

<a id="r-214-11"></a>**214.11** Equipment cannot be placed on an opposing creature unless the equipment's text permits it.

<a id="r-215"></a>

### 215. Stack, priority, and passing

<a id="r-215-1"></a>**215.1** The **stack** resembles a game zone but is not one, because no card can be put on it.

<a id="r-215-2"></a>**215.2** Playable and triggered abilities enter the stack when declared. Card properties that can be declared also enter it when declared.

<a id="r-215-3"></a>**215.3** A **stack object** is an abstract part of a property or ability whose resolution produces effects.

<a id="r-215-3-a"></a>**215.3.a** A stack containing no objects is **empty**.

<a id="r-215-3-b"></a>**215.3.b** Each stack object has a **height** equal to the number of objects placed on the stack before it. Two objects cannot have the same height.

<a id="r-215-3-c"></a>**215.3.c** The object with greatest height is **on top** of the stack.

<a id="r-215-3-d"></a>**215.3.d** An object is on top immediately after it enters the stack.

<a id="r-215-3-e"></a>**215.3.e** Abilities and properties enter the stack as **chains of objects** placed in a strictly defined order.

<a id="r-215-3-f"></a>**215.3.f** Every stack object belongs to exactly one chain corresponding to a particular ability or property.

<a id="r-215-4"></a>**215.4** If several chains must enter the stack simultaneously, place all the active player's chains first, then all the inactive player's chains. Each player chooses the order of their own chains.

<a id="r-215-5"></a>**215.5** Players may declare abilities and properties only when the rules permit.

<a id="r-215-6"></a>**215.6** The rules use **priority**, the special right to declare abilities and properties or to **pass**, giving priority to the opponent.

<a id="r-215-6-a"></a>**215.6.a** Passing is a game action that does not use the stack; it happens immediately.

<a id="r-215-7"></a>**215.7** Only one player has priority at a time.

<a id="r-215-8"></a>**215.8** When both players pass, the top stack object resolves and leaves the stack. If the stack is then empty and both players pass again, the current step or phase ends and the next begins.

<a id="r-215-9"></a>**215.9** The active player gains priority after any stack object is declared or resolved, and at the beginning and end of each phase or step.

<a id="r-216"></a>

### 216. Stack objects and their chains

<a id="r-216-1"></a>**216.1** A chain consists of these stack objects, listed in their order of resolution:

1. Declaration object
2. Target object
3. Roll object
4. Result object
5. Calculation object
6. Protection object
7. Wound object
8. Payment object
9. Ending object

<a id="r-216-1-a"></a>**216.1.a** Put the objects of a chain on the stack in exactly the reverse of the order listed in [216.1](#r-216-1).

<a id="r-216-1-b"></a>**216.1.b** If an ability or property does not involve die rolls, use a simplified chain without the Roll, Result, and Calculation objects.

<a id="r-216-2"></a>**216.2** A Declaration object produces no effect by itself. Its first appearance on top of the stack for a given chain is the trigger point for abilities with “before [attack initiation/action].”

<a id="r-216-3"></a>**216.3** While a Target object is on top, players may declare playable abilities that block or redirect its chain's ability or property. This includes assigning a defender to a card attacked by a simple strike. Redirection may be declared only if that ability or property has not already been redirected.

<a id="r-216-4"></a>**216.4** Resolving the Target object produces the following effects in order:

1. Determine the final target of the ability or property.
2. Reveal the final target if it was hidden.
3. For an attack on a card, the source becomes the **initiating card** and the final target becomes the **responding card**.
4. Apply abilities whose text blocks the chain before die rolls.
5. Put abilities triggered “on attack initiation” on the stack.

<a id="r-216-5"></a>**216.5** Resolving the Roll object makes the source card enter combat and roll a die. If two open creatures fight, both enter combat and roll, with the attacking creature rolling first. Then put on the stack all abilities triggered by the unmodified die roll, followed by all abilities containing “while fighting.”

<a id="r-216-6"></a>**216.6** Resolving the Result object applies all die-roll modifiers to obtain each final die-roll result. Then put on the stack all abilities triggered by modified die-roll results.

<a id="r-216-7"></a>**216.7** When a Calculation object first reaches the top of the stack during combat between two open creatures, the player with the higher die result may, if an exchange is possible, play **Weakening** one row upward on the Strike Table. This reduces the result by one row. **Translator's note:** The source does not define “exchange” in this context.

<a id="r-216-8"></a>**216.8** Resolving the Calculation object produces these effects in order:

1. If needed, determine whether the ability or property is weak, medium, or strong.
2. If it is an attack, the card dealing it becomes the **attacking card** and its target becomes the **attacked card**.
3. Apply modifiers to the ability's or property's numerical value.

<a id="r-216-9"></a>**216.9** While a Protection object is on top, players may use playable abilities that block the chain's ability or property or reduce an attack to a specified kind (weak, medium, or strong).

<a id="r-216-10"></a>**216.10** Resolving the Protection object checks whether the target card has protection against the applied ability or property, or whether a permanent ability can block it.

<a id="r-216-11"></a>**216.11** Resolving the Wound object produces these effects in order:

1. If the chain is not an attack, resolve its text. If the text calls for several effects, resolve them in the listed order.
2. If the chain is an attack, deal its wounds to the target card.
3. Put on the stack abilities triggered “when a spell/influence/attack (strike, shot, etc.) is applied.”
4. The source card and, if possible, the target card leave combat.

<a id="r-216-12"></a>**216.12** Resolving the Payment object makes the card pay for the ability or property it declared. If required, the card closes, loses tokens or movement units, or loses abilities marked “once per turn/battle.” Then put abilities with “after” on the stack.

<a id="r-216-12-a"></a>**216.12.a** Resolving the Payment object for assigning a defender does not close the source card. Instead, it adds closing that card to the attacking card's Payment object.

<a id="r-216-13"></a>**216.13** Resolving the Ending object removes cards' status as attacking, attacked, initiating, responding, sources, and targets.

<a id="r-217"></a>

### 217. Taking control

<a id="r-217-1"></a>**217.1** Some card abilities let you take control of an opposing card, moving it from the opponent's squad into yours.

<a id="r-217-1-a"></a>**217.1.a** Taking control does not relocate the card unless stated otherwise.

<a id="r-217-1-b"></a>**217.1.b** Taking control does not assign new hosts to equipment, symbiotes, or parasites unless stated otherwise.

<a id="r-217-2"></a>**217.2** A card taken under control gains a **control marker** and remains in the squad of its owner's opponent until it loses that marker.

<a id="r-217-3"></a>**217.3** The ability that takes control states when the control marker is lost.

<a id="r-217-4"></a>**217.4** A card returning to its owner's squad after losing the marker is not considered to be taken under control.

<a id="r-218"></a>

### 218. Tokens

<a id="r-218-1"></a>**218.1** Some cards can gain **tokens**, special markers later usable to pay for abilities.

<a id="r-218-2"></a>**218.2** A card can gain tokens through abilities or by **accumulating** a token.

<a id="r-218-3"></a>**218.3** Accumulating a token is a playable ability paid for by closing the card. It gives that card one token.

<a id="r-218-4"></a>**218.4** Any card may gain tokens, but only cards with abilities of the form **[Token]:**, **[Token][Close]:**, or **[Close]: Accumulate a Token** may accumulate them.

<a id="r-218-5"></a>**218.5** Accumulating a token is gaining a token; gaining a token is not necessarily accumulating one.

<a id="r-218-6"></a>**218.6** A **token maximum** is the limit above which a card cannot gain tokens.

<a id="r-218-7"></a>**218.7** A card has no default token maximum, but some abilities, including named abilities, set one.

<a id="r-218-8"></a>**218.8** The token maximum applies to all tokens a card gains except incarnation tokens.

<a id="r-219"></a>

### 219. Opening and closing cards

<a id="r-219-1"></a>**219.1** Some abilities close cards without doing so as payment for an action.

<a id="r-219-2"></a>**219.2** An ability requiring an open card to open, or a closed card to close, cannot legally be declared, except as in [219.3](#r-219-3).

<a id="r-219-3"></a>**219.3** Some abilities produce two or more effects, one requiring a card to open or close. Such an ability may be declared on a card already in the corresponding state; the effect requiring that card to open or close then does not happen.

<a id="r-219-4"></a>**219.4** A card opened during a player's turn fully restores its movement allowance and may act that turn if otherwise able.

<a id="r-219-4-a"></a>**219.4.a** If the card may act X times per turn, opening it during a turn lets it act X times again that turn.

<a id="part-3"></a>

## 3. Battle and turn structure

<a id="r-300"></a>

### 300. General provisions

<a id="r-300-1"></a>**300.1** A battle consists of a **Preliminary Phase** and any number of player **Turns**. Battle begins with the Preliminary Phase. When it ends, the first player's turn begins. Players alternate turns thereafter.

<a id="r-300-2"></a>**300.2** A turn has three phases, always in this order: **Initial Phase**, **Main Phase**, and **Final Phase**. Each happens every turn even if nothing occurs during it. Some phases contain steps, which likewise happen in their stated order every turn.

<a id="r-300-3"></a>**300.3** A turn, phase, or step ends when the stack is empty and both players pass. Nothing can occur between turns, phases, or steps. Ending one automatically begins the next.

<a id="r-300-4"></a>**300.4** Abilities triggered by the start of a turn, phase, or step automatically enter the stack as it begins.

<a id="r-300-5"></a>**300.5** Abilities triggered at the start of battle resolve under special rules during the Battle Start Step.

<a id="r-300-6"></a>**300.6** When a player's turn, phase, or step begins, that player gains priority, except during the Preliminary Phase and its steps.

<a id="r-301"></a>

### 301. Preliminary Phase

<a id="r-301-1"></a>**301.1** The Preliminary Phase has seven steps, in order: Deal, Recruitment Preparation, Squad Recruitment, Deployment, Reveal, Battle Start, and Vanguard.

<a id="r-301-1-a"></a>**301.1.a** Perform the steps in the order listed in [301.1](#r-301-1).

<a id="r-301-2"></a>**301.2** The Preliminary Phase has no stack. Triggered abilities resolve immediately after declaration and cannot be declared simultaneously. A triggered ability's resolution or a player's pass gives priority to the opponent.

<a id="r-301-3"></a>**301.3** Players cannot declare actions or playable abilities during the Preliminary Phase except in the Recruitment Preparation Step.

<a id="r-302"></a>

### 302. Deal Step

<a id="r-302-1"></a>**302.1** At the start of Deal, each player automatically moves the number of cards specified by the game format and Tournament Rules from the top of their Deck to their Deal zone. Each also receives 23 gold and 22 silver crystals. **Translator's note:** The source does not give the format-specific number of cards or reproduce the Tournament Rules.

<a id="r-302-2"></a>**302.2** Players then determine turn order by rolling a die; the higher roller chooses who goes first. In a match of several games, the previous game's winner chooses. If that game was a draw, roll again. The player going first is the **first player**; the opponent is the **second player**.

<a id="r-302-3"></a>**302.3** A player unhappy with the cards dealt may take a **redeal** by losing one gold crystal, shuffling those cards back into the Deck, and drawing the same number again. Players may redeal any number of times, losing one gold crystal each time until none remain. A player satisfied with the cards keeps them in Deal and announces that decision to the opponent.

<a id="r-302-3-a"></a>**302.3.a** The first player takes all desired redeals first. After announcing that they will keep their Deal, the second player may take redeals.

<a id="r-302-3-b"></a>**302.3.b** A player who announces they will keep their Deal gives up the right to redeal again in this game.

<a id="r-302-4"></a>**302.4** No ability or property may be played during Deal.

<a id="r-303"></a>

### 303. Recruitment Preparation Step

<a id="r-303-1"></a>**303.1** The first player gains priority to declare playable “before recruiting the squad” abilities of cards in Deal.

<a id="r-303-2"></a>**303.2** A player who passes during this step can no longer declare “before recruiting the squad” abilities.

<a id="r-304"></a>

### 304. Squad Recruitment Step

<a id="r-304-1"></a>**304.1** Players begin moving cards from Deal to Recruitment, spending the corresponding crystals.

<a id="r-304-2"></a>**304.2** Neither player gains priority during this step.

<a id="r-304-3"></a>**304.3** Cards enter Recruitment one at a time and affect other cards subsequently placed there.

<a id="r-304-4"></a>**304.4** Cards entering Recruitment gain abilities containing “begins battle with...” as they enter. Thus a card lacks that ability in Deal and has it in Recruitment.

<a id="r-304-5"></a>**304.5** A player may put no more than 15 cards in Recruitment.

<a id="r-304-6"></a>**304.6** A player loses one gold crystal for every element in Recruitment beyond two. If Recruitment contains cards of only one element, the player gains one extra gold crystal. Neutral cards do not count as an element.

<a id="r-304-6-a"></a>**304.6.a** The crystal is lost before the card enters Recruitment. Thus a player with two elements in Recruitment and six gold crystals cannot recruit a third-element card costing six gold crystals.

<a id="r-304-7"></a>**304.7** A player announces when they are finished recruiting. When both have done so, shuffle all cards remaining in Deal back into their Decks, then proceed to the next step.

<a id="r-305"></a>

### 305. Deployment Step

<a id="r-305-1"></a>**305.1** The first player gains priority to place all cards from Recruitment in their deployment zone. After they pass, the second player gains priority to place all of theirs in their deployment zone.

<a id="r-305-2"></a>**305.2** Place cards face down in the deployment zone. No more than one card may be placed in a Battlefield cell.

<a id="r-305-3"></a>**305.3** Once a player fills every cell in their deployment zone, add the edge cells of their second and third rows to that zone.

<a id="r-305-4"></a>**305.4** Once the first player fills every cell in their expanded deployment zone, add the edge cells of their first row.

<a id="r-306"></a>

### 306. Reveal Step

<a id="r-306-1"></a>**306.1** At the start of Reveal, the first player may declare abilities containing “before reveal.” After they pass, the second player may declare such abilities.

<a id="r-306-2"></a>**306.2** After the second player passes, reveal every card costing X or N+X or using an alternative cost. State the value of X and whether the alternative cost was used.

<a id="r-306-2-a"></a>**306.2.a** Reveal all other Battlefield cards. The first player reveals theirs first. The second player may keep any of their third-row cards other than symbiotes and equipment hidden, face down, until the end of the first player's first turn.

<a id="r-306-3"></a>**306.3** The first player puts all their terrain, flying creatures, and cards with “placed in the Additional Zone” into that zone. Then the second player does the same.

<a id="r-306-4"></a>**306.4** The first player assigns hosts to all their equipment, then the second player assigns theirs.

<a id="r-306-5"></a>**306.5** The first player assigns hosts to all their symbiotes, then the second player assigns theirs.

<a id="r-306-6"></a>**306.6** The first player assigns hosts to all their parasites, then the second player assigns theirs.

<a id="r-306-7"></a>**306.7** A player may not decline to assign a host to equipment, a symbiote, or a parasite if an assignment is possible.

<a id="r-306-8"></a>**306.8** Reveal ends once hosts have been assigned to every card for which that is possible.

<a id="r-307"></a>

### 307. Battle Start Step

<a id="r-307-1"></a>**307.1** At the start of this step, all equipment, symbiotes, and parasites without assigned hosts die.

<a id="r-307-2"></a>**307.2** Starting with the first player, players declare triggered “at the start of battle” abilities under the Preliminary Phase's general rules.

<a id="r-307-3"></a>**307.3** Abilities triggered by equipment, symbiotes, or parasites dying at the start of this step count as “at the start of battle” triggered abilities and resolve alongside them under the Preliminary Phase's general rules.

<a id="r-307-4"></a>**307.4** A player who passes during Battle Start may declare no more abilities during this step.

<a id="r-307-5"></a>**307.5** Battle Start ends after both players pass.

<a id="r-308"></a>

### 308. Vanguard Step

<a id="r-308-1"></a>**308.1** Starting with the first player, players declare their cards' **Vanguard** abilities under the Preliminary Phase's general rules.

<a id="r-308-2"></a>**308.2** A player who passes during Vanguard may declare no more abilities during this step.

<a id="r-308-3"></a>**308.3** Once both players pass, Vanguard and then the Preliminary Phase end.

<a id="r-309"></a>

### 309. Initial Phase

<a id="r-309-1"></a>**309.1** The Initial Phase has two steps: Turn Preparation and Turn Start.

<a id="r-310"></a>

### 310. Turn Preparation Step

<a id="r-310-1"></a>**310.1** Neither player gains priority during this step.

<a id="r-310-2"></a>**310.2** At its start, make all decisions available “before the start of the player's turn,” including whether cards allowed to remain closed will open. The active player decides first, then the inactive player.

<a id="r-310-3"></a>**310.3** Trigger and resolve all “at the start of the turn” abilities related to opening cards except Poisoning, Regeneration, and Fading.

<a id="r-311"></a>

### 311. Turn Start Step

<a id="r-311-1"></a>**311.1** Open all closed cards of the active player except those unable or chosen not to open.

<a id="r-311-2"></a>**311.2** Remove all movement markers from all the active player's cards.

<a id="r-311-3"></a>**311.3** Effects lasting “until the start of the turn” end.

<a id="r-311-4"></a>**311.4** Trigger all “at the start of the turn” abilities unrelated to opening cards, as well as Regeneration, Poisoning, and Fading. The active player gains priority.

<a id="r-311-5"></a>**311.5** If an ability declared during this phase grants a triggered “at the start of the turn” ability, including a delayed one, it triggers at the next Turn Start Step.

<a id="r-312"></a>

### 312. Main Phase

<a id="r-312-1"></a>**312.1** The Main Phase has no steps and is the main phase of play.

<a id="r-312-2"></a>**312.2** During the Main Phase, with an empty stack, the active player may declare any of their actions, playable abilities, or properties, except those restricted by rules or card abilities to a particular time in the turn. Such game actions must be declared at that time.

<a id="r-313"></a>

### 313. Final Phase

<a id="r-313-1"></a>**313.1** Trigger all “at the end of the turn” abilities.

<a id="r-313-1-a"></a>**313.1.a** If an ability declared during this phase grants an “at the end of the turn” triggered ability, including a delayed one, it triggers in the next Final Phase.

<a id="r-313-2"></a>**313.2** Once both players pass with an empty stack in this phase, “until the end of the turn” effects expire. The active player then becomes inactive, and the inactive player becomes active, simultaneously.

<a id="part-4"></a>

## 4. Abilities, properties, effects, and modifiers

<a id="r-400"></a>

### 400. General provisions

<a id="r-400-1"></a>**400.1** The **source** of a game action is the card that granted, performed, or declared it.

<a id="r-400-1-a"></a>**400.1.a** Once established, a game action's source never changes, regardless of later game actions.

<a id="r-400-2"></a>**400.2** A game action's **target** is the card at which it is directed. It may have several targets.

<a id="r-400-2-a"></a>**400.2.a** An ability's or property's **initial target** is its target before that chain's Target object resolves.

<a id="r-400-3"></a>**400.3** To **declare** an ability or property is to put its chain of stack objects onto the stack.

<a id="r-400-4"></a>**400.4** Declaring an ability or property requires specifying the ability or property, its target, and its source.

<a id="r-401"></a>

### 401. Types and kinds of abilities

<a id="r-401-1"></a>**401.1** An ability is either an attack or a non-attack.

<a id="r-401-2"></a>**401.2** An ability is either magical or nonmagical.

<a id="r-401-3"></a>**401.3** Attacks are melee or ranged.

<a id="r-401-4"></a>**401.4** A magical strike is a magical melee attack; a discharge is a magical ranged attack; a spell is a magical non-attack.

<a id="r-401-5"></a>**401.5** Simple and special strikes are nonmagical melee attacks; shots and throws are nonmagical ranged attacks; an influence is a nonmagical non-attack.

<a id="r-401-6"></a>**401.6** If an ability's text specifies neither its type nor its kind, it is an influence by default: a nonmagical non-attack.

<a id="r-402"></a>

### 402. Properties and the destruction effect

<a id="r-402-1"></a>**402.1** A card **property** is an inherent game parameter shared by every card of its type. A special method for describing or calculating another property is also a property.

<a id="r-402-2"></a>**402.2** Some properties, such as movement and attacking with a simple strike, can be declared.

<a id="r-402-3"></a>**402.3** The **destruction effect** is the only triggered card property. If performing a game action reduces a card's current life to zero or below, it receives a destruction effect. Some abilities can also give it one.

<a id="r-402-3-a"></a>**402.3.a** A destruction effect enters the stack like a triggered ability. Resolving it puts the card in the Graveyard.

<a id="r-402-3-b"></a>**402.3.b** A card receives a second destruction effect if its current life is below zero and an attack does not deal it wounds.

<a id="r-402-3-c"></a>**402.3.c** If a destruction effect caused by wounds resolves when the card's current life is above zero, the effect becomes illegal and is canceled.

<a id="r-403"></a>

### 403. Abilities

<a id="r-403-1"></a>**403.1** An **ability** describes something a card can do in the game. Unlike properties, abilities are individual to a card, are not shared by every card of its type, and do not describe its parameters.

<a id="r-403-2"></a>**403.2** A card's text is its ability.

<a id="r-403-3"></a>**403.3** A card may have several abilities. Usually one sentence describes one ability, with a full stop separating two abilities.

<a id="r-403-4"></a>**403.4** Abilities have three classes: **playable**, **triggered**, and **permanent**.

<a id="r-404"></a>

### 404. Playable abilities

<a id="r-404-1"></a>**404.1** A **playable ability** is declared by a player's own choice. Only that player's decision can initiate its declaration.

<a id="r-404-2"></a>**404.2** Some playable abilities have the form “[cost]: [text],” but this form is not required. In that form, everything before the colon is the cost.

<a id="r-404-3"></a>**404.3** To declare a playable ability, its source card must be able to pay for it.

<a id="r-404-4"></a>**404.4** If the source proves unable to pay while the playable ability resolves, the ability becomes illegal and is canceled.

<a id="r-404-5"></a>**404.5** Playable abilities may be sudden or non-sudden.

<a id="r-404-6"></a>**404.6** A sudden playable ability has the form “**[Sudden action]** [cost]: [text]” and may be declared during any phase of either player's turn whenever its player has priority.

<a id="r-404-7"></a>**404.7** A non-sudden playable ability may be declared only by the active player during their Main Phase, with an empty stack and priority.

<a id="r-404-8"></a>**404.8** Some playable abilities, such as blocking and redirection abilities, have timing restrictions. They may be declared only at the time stated by the rules or their text.

<a id="r-405"></a>

### 405. Triggered abilities

<a id="r-405-1"></a>**405.1** A **triggered ability** usually begins with “on,” “before,” “after,” “if,” or “when.” Its text states a condition describing its trigger point.

<a id="r-405-2"></a>**405.2** Once triggered, the ability must be declared by its player as soon as they gain priority.

<a id="r-405-3"></a>**405.3** “May” in a triggered ability permits its player to decline to declare it even when its triggering condition is met.

<a id="r-405-4"></a>**405.4** Once declared, a triggered ability resolves regardless of the game zone its source occupies at resolution.

<a id="r-405-5"></a>**405.5** Some effects create **delayed triggered abilities**. Their target gains an acquired triggered ability that disappears after declaration, or if declaration is impossible when it triggers.

<a id="r-406"></a>

### 406. Permanent abilities

<a id="r-406-1"></a>**406.1** A **permanent ability** always affects the game. Check whether a card has one whenever a player gains priority.

<a id="r-406-2"></a>**406.2** Permanent abilities do not choose card targets because they are not declared. Thus abilities granted by permanent abilities do not reveal hidden cards (see [415.6](#r-415-6)).

<a id="r-407"></a>

### 407. Gaining and losing abilities

<a id="r-407-1"></a>**407.1** Cards may grant abilities to, or take them from, one another. Abilities granted by other cards are **acquired abilities**.

<a id="r-407-2"></a>**407.2** Unless the granting card's text specifies a duration, the ability lasts until the end of battle.

<a id="r-407-3"></a>**407.3** Unless the removing card's text specifies a duration, the card loses the ability until the end of battle.

<a id="r-407-4"></a>**407.4** An instruction to remove all abilities removes all except acquired abilities.

<a id="r-407-5"></a>**407.5** An instruction to remove a specific, usually named, ability removes both innate and acquired instances. *Example:* Gurr-Shaman uses “Gaze of the Abyss” on a Hirdman in formation. The Hirdman has no innate protections but gains Protection from Magic in formation. Gurr-Shaman removes that protection and prevents the Hirdman from gaining it later, whether from its own formation or another card.

<a id="r-408"></a>

### 408. Ignoring abilities

<a id="r-408-1"></a>**408.1** A card's abilities can be ignored. The card doing the ignoring always states the conditions under which it ignores another card's abilities. These are its **ignoring conditions**.

<a id="r-408-2"></a>**408.2** A card may ignore all of another card's non-acquired abilities or a particular ability, including an acquired one, usually a named ability.

<a id="r-408-3"></a>**408.3** When the ignoring conditions are met, every stack object sourced by the ignoring card gains the text “Ignore [abilities/specific ability] of this object's target.” Effects produced by that object treat the target as lacking those abilities or that ability.

<a id="r-408-3-a"></a>**408.3.a** If the ignoring card states no ignoring conditions, every stack object it sources gains the text “Ignore [abilities/specific ability] of this object's target.” Effects produced by that object treat the target as lacking those abilities or that ability.

<a id="r-408-4"></a>**408.4** The target card's triggered abilities do not treat effects produced by an ignoring object as trigger points.

<a id="r-408-5"></a>**408.5** The target card's playable abilities may be played normally.

<a id="r-408-6"></a>**408.6** A card ignoring **Cache** may declare an attack against a card with Cache even though Cache's text forbids it.

<a id="r-409"></a>

### 409. Canceling abilities and properties

<a id="r-409-1"></a>**409.1** To **cancel** an ability or property, remove from the stack every object belonging to it or to abilities it produced, including its Payment object.

<a id="r-409-2"></a>**409.2** An ability or property is canceled if it becomes illegal during resolution.

<a id="r-409-3"></a>**409.3** A canceled ability or property counts as never declared. Its card does not close and does not count as having used it.

<a id="r-410"></a>

### 410. Blocking

<a id="r-410-1"></a>**410.1** **Blocking** removes an ability or property completely from the stack, except its Payment object.

<a id="r-410-2"></a>**410.2** Only another ability, a **blocking ability**, can block an ability or property. The latter is the **blocked ability or property**.

<a id="r-410-2-a"></a>**410.2.a** A blocking ability may be playable, triggered, or permanent.

<a id="r-410-3"></a>**410.3** A playable blocking ability may be declared only while the blocked ability's Target object is on top of the stack.

<a id="r-410-4"></a>**410.4** Source-card text states the trigger points for triggered blocking abilities.

<a id="r-410-5"></a>**410.5** Instead of receiving an effect from a blocked ability, a permanent blocking ability removes it from the stack. This is a replacement effect.

<a id="r-411"></a>

### 411. Protections

<a id="r-411-1"></a>**411.1** **Protection** is a special kind of blocking. A card protected against an ability or property receives none of its effects. Abilities triggered when an ability meets that protection still enter the stack and may affect other cards, but cannot affect the protected card.

<a id="r-411-2"></a>**411.2** Protection is a permanent ability written “Protection from [text],” where the text specifies what is blocked. Common examples protect against attack types, certain named abilities, and properties.

<a id="r-411-3"></a>**411.3** Protection is a named ability.

<a id="r-411-4"></a>**411.4** Protection from a broad ability type includes protection from each of its narrower kinds. *Example:* Protection from Magical Abilities, better known as Protection from Magic, has the following incomplete but sufficient text: “Protection from Discharges. Protection from Magical Strikes. Protection from Spells.”

<a id="r-411-4-a"></a>**411.4.a** Ignoring or removing protection against a narrower kind also affects a card with the broader protection. *Example:* A card that ignores Protection from Discharges ignores that component of its target's Protection from Magic when attacking with a discharge.

<a id="r-412"></a>

### 412. Targets and redirection

<a id="r-412-1"></a>**412.1** Specify an ability's initial target or targets when declaring it. It cannot be declared without them.

<a id="r-412-2"></a>**412.2** After its Target object resolves, an ability's initial target becomes its target unless it has been redirected.

<a id="r-412-3"></a>**412.3** An ability can be redirected only while its Target object is on top of the stack, except under [412.7](#r-412-7).

<a id="r-412-4"></a>**412.4** **Redirection** is a separate kind of ability with only a Wound object and a Payment object. It therefore cannot itself be redirected or blocked. It may, however, be made illegal by forcing its source card to spend the resources needed to pay for it.

<a id="r-412-5"></a>**412.5** Resolving redirection's Wound object replaces an ability's or property's initial target with another card, which becomes its target. If the ability or property already has a target other than its initial target, redirection becomes illegal. Thus an already redirected ability or property cannot be redirected again.

<a id="r-412-6"></a>**412.6** A card that has declared redirection cannot declare it again while objects from its first redirection remain on the stack.

<a id="r-412-7"></a>**412.7** Some redirection abilities are permanent. They do not enter the stack and always resolve as part of the redirected ability.

<a id="r-413"></a>

### 413. Combined abilities

<a id="r-413-1"></a>**413.1** A **combined ability** has traits of two classes at once: playable and triggered.

<a id="r-413-2"></a>**413.2** Combined abilities usually have a condition and trigger point, as well as the form “[cost]: [text].”

<a id="r-413-3"></a>**413.3** All rules for triggered and playable abilities apply to combined abilities except for declaration; declare them under the rules for triggered abilities.

<a id="r-414"></a>

### 414. Named abilities

<a id="r-414-1"></a>**414.1** A **named ability** has a name that abbreviates its full text. The source says the complete list and full text appear in the “Dictionary” section. **Translator's note:** The Dictionary contains only an introduction; the source's substantive named-ability entries appear in the [Glossary](#part-6).

<a id="r-414-2"></a>**414.2** Named abilities may be permanent, playable, or triggered.

<a id="r-414-3"></a>**414.3** A named ability may have X after its name. Either X is given or its determination is specified in card text. Its text explains which quantity X represents.

<a id="r-414-4"></a>**414.4** If a card has several triggered or permanent named abilities with the same name, only the one with the greatest X triggers or affects play each time.

<a id="r-414-5"></a>**414.5** If several such abilities share a name and X value, or have no X, only the one the card gained earliest in the game triggers or affects play.

<a id="r-414-6"></a>**414.6** A card with several playable named abilities may use any of them.

<a id="r-415"></a>

### 415. Hidden cards

<a id="r-415-1"></a>**415.1** A **hidden card** is face down. Before Reveal, all cards are hidden.

<a id="r-415-2"></a>**415.2** Reveal a hidden card as soon as it becomes a property's or ability's target; declares a sudden ability, including a sudden action; has a triggered ability trigger; or has a permanent ability begin affecting play. This reveal is a base effect and does not use the stack. *Example:* A hidden Elenyamen in the second player's third row reveals immediately if that player's squad contains Forest Guardians.

<a id="r-415-2-a"></a>**415.2.a** A hidden card whose text allows particular abilities or properties to be used only on it counts as having a permanent ability affecting play, and reveals immediately. *Example:* A hidden Reed Idol in the second player's third row reveals immediately.

<a id="r-415-2-b"></a>**415.2.b** All cards reveal during the Reveal Step except cards in the second player's third row and cards with Stealth.

<a id="r-415-3"></a>**415.3** A hidden card is a legal target for any otherwise possible playable or triggered ability. Treat all conditions in that ability's text as met if its target is hidden. *Example:* An Acolyte of Dzar that may declare a discharge only against creatures may target any hidden card, even a non-creature. *Example:* A Jester may declare its feint by choosing any creature for X crystals and a hidden card, because the hidden card is treated as meeting the “costs X crystals” condition.

<a id="r-415-3-a"></a>**415.3.a** If a card must choose every card meeting a condition, it automatically chooses every possible hidden card. *Example:* Tarna's spell wounds all opposing creatures of a chosen cost, so it must target all hidden opposing cards regardless of that cost.

<a id="r-415-4"></a>**415.4** Abilities and properties that become illegal after their target is revealed are blocked. This blocking is a base effect and does not use the stack.

<a id="r-415-5"></a>**415.5** A player may not reveal their own card at will except where specifically permitted, such as by Stealth.

<a id="r-415-6"></a>**415.6** Granting an ability to a hidden card through a permanent ability does not reveal it.

<a id="r-416"></a>

### 416. Effects

<a id="r-416-1"></a>**416.1** An **effect** is the result of resolving an ability. Permanent abilities produce continuous effects; other abilities produce one-time or continuous effects. Base effects come from the game rules, not from abilities.

<a id="r-416-2"></a>**416.2** If an effect must do something impossible, do as much as possible. *Example:* Healing 2 heals one wound if the creature has only one.

<a id="r-416-3"></a>**416.3** Markers are effects.

<a id="r-416-4"></a>**416.4** An effect belongs to the player who controlled its source card when it was created.

<a id="r-416-5"></a>**416.5** Effects do not use the stack.

<a id="r-416-6"></a>**416.6** Effects are game actions.

<a id="r-417"></a>

### 417. One-time effects

<a id="r-417-1"></a>**417.1** **One-time effects** apply once, then cease affecting play and have no duration. Examples include dealing wounds, relocating cards, and destroying creatures.

<a id="r-417-2"></a>**417.2** Some one-time effects let a player perform game actions later, usually at a specified time. Such an effect temporarily grants its source card a new triggered ability waiting for that time. The card loses it after it is declared.

<a id="r-418"></a>

### 418. Continuous effects

<a id="r-418-1"></a>**418.1** **Continuous effects** affect play for a period, usually stated in their source ability.

<a id="r-418-2"></a>**418.2** An effect with no stated duration lasts until the end of battle.

<a id="r-419"></a>

### 419. Replacement effects

<a id="r-419-1"></a>**419.1** A **replacement effect** is a continuous effect that waits for a game action and replaces it wholly or partly before it happens.

<a id="r-419-1-a"></a>**419.1.a** Effects using “instead” are replacement effects.

<a id="r-419-1-b"></a>**419.1.b** Effects using “Do not [text]” are replacement effects. “Cannot [text]” instead makes [text] illegal.

<a id="r-419-1-c"></a>**419.1.c** Effects using “Begins battle” are replacement effects.

<a id="r-419-2"></a>**419.2** Replacement effects have no timing restriction and may apply at any time in the game.

<a id="r-419-3"></a>**419.3** A replacement effect applies only if it arose before the game action it replaces. It cannot change a completed game action.

<a id="r-419-4"></a>**419.4** A replaced game action never happened. The modified game action happens instead and may trigger entirely different abilities and effects, including illegal ones.

<a id="r-419-5"></a>**419.5** The same replacement effect cannot apply repeatedly to one game action or replace itself.

<a id="r-419-6"></a>**419.6** Once one effect replaces a game action, no other effect may replace that same action.

<a id="r-419-6-a"></a>**419.6.a** If one player controls every replacement effect applicable to a game action, that player chooses which one applies.

<a id="r-419-6-b"></a>**419.6.b** If different players control applicable replacement effects, the owner of the game action chooses which applies.

<a id="r-419-7"></a>**419.7** A replacement effect may apply to a game action produced by another replacement effect.

<a id="r-420"></a>

### 420. Prevention effects

<a id="r-420-1"></a>**420.1** A **prevention effect** is a kind of replacement effect applying only to inflicted wounds by replacing their numerical amount.

<a id="r-420-2"></a>**420.2** A prevention effect without a numerical value automatically replaces the wound count with zero.

<a id="r-420-3"></a>**420.3** Numerical prevention effects apply in sequence; all may apply if enough wounds are being dealt.

<a id="r-420-3-a"></a>**420.3.a** When one player controls several prevention effects, apply them to a target in the order chosen by that target card's controller.

<a id="r-420-3-b"></a>**420.3.b** When different players' prevention effects apply to one card, apply those controlled by that card's controller first.

<a id="r-420-4"></a>**420.4** A prevention effect unable to prevent wounds to a card remains unused and may apply later if possible.

<a id="r-420-5"></a>**420.5** Apply prevention effects after all modifiers to the number of wounds dealt.

<a id="r-420-6"></a>**420.6** The ability granting a prevention effect usually states when it applies. If not stated, the effect remains until used or until the end of the game.

<a id="r-420-7"></a>**420.7** A prevention effect does not apply if its source card leaves the game zone.

<a id="r-421"></a>

### 421. Base effects

<a id="r-421-1"></a>**421.1** **Base effects** arise from the game rules. They have a target but no source and do not use the stack. Check them whenever a player gains priority.

<a id="r-421-2"></a>**421.2** Losing because a player controls no creatures while the stack is empty is a base effect.

<a id="r-421-3"></a>**421.3** Checking a creature's unused movement is a base effect.

<a id="r-421-4"></a>**421.4** Equipment, a symbiote, or a parasite dying when its host changes game zones is a base effect.

<a id="r-421-5"></a>**421.5** Equipment, a symbiote, or a parasite dying because no host can be assigned is a base effect.

<a id="r-422"></a>

### 422. Modifiers

<a id="r-422-1"></a>**422.1** **Modifiers** are effects or abilities that change the numerical values of other abilities, properties, or effects.

<a id="r-422-2"></a>**422.2** Modifiers are continuous effects or permanent abilities.

<a id="r-422-3"></a>**422.3** Playable abilities granting die-roll-result modifiers may be played only while a Result object is on top of the stack.

<a id="r-422-4"></a>**422.4** If several modifiers apply to one ability, apply them in this order:

1. From cards in the ability source's squad, other than the source itself.
2. From the ability source.
3. From cards in the ability target's squad.
4. From the ability target.
5. From a game rule.
6. Modifiers reducing the ability's numerical value to a specified number.

<a id="r-422-4-a"></a>**422.4.a** Within one group in [422.4](#r-422-4), the player controlling the modifier sources chooses their order.

<a id="r-422-4-b"></a>**422.4.b** The game-rule modifier reduces a die-roll result above 6 to 6 or raises one below 1 to 1. It always applies except to rolls in combat between two open creatures.

<a id="r-422-4-c"></a>**422.4.c** Apply modifiers setting an ability's or property's numerical value to a specified number last, regardless of the granting card's squad. If several exist, the controller of the ability's target card chooses one; the others do not apply.

<a id="r-422-5"></a>**422.5** Modifier abilities that are permanent apply only when relevant, as the corresponding stack object resolves.

<a id="r-423"></a>

### 423. Illegal game actions

<a id="r-423-1"></a>**423.1** If a game action proves illegal during resolution, cancel it. Do not pay for it or count it as declared. It triggers no ability and produces no effect.

<a id="r-423-1-a"></a>**423.1.a** If its resolution has already produced effects or triggered abilities, pay for that game action even if it is illegal.

<a id="r-423-2"></a>**423.2** After canceling an illegal game action, its owner gains priority. They may take any game action the rules permit, including redeclaring the same action if doing so is legal and possible.

<a id="r-423-3"></a>**423.3** If only part of a game action is illegal, disregard that part as if it were absent. Resolve the remainder normally and pay its full cost.

<a id="part-5"></a>

## 5. Dictionary

This section lists the *Berserk* CCG's named abilities and their rules in alphabetical order. **Translator's note:** This is the entire Dictionary section in the source; its actual entries are in the following Glossary.

<a id="part-6"></a>

## 6. Glossary

This section defines key words and phrases and describes some moments of play. **Translator's note:** The source's contents also lists “Contacts,” but no Contacts section follows the Glossary.

<a id="g-01"></a>

### Vanguard

Full text: “At the start of the Vanguard Step, this creature may declare a simple-strike attack against an adjacent opposing card. Deal this strike as though the creature had Unanswered Strike.” Vanguard is a triggered ability whose trigger point is the start of the Vanguard Step. Like every ability triggered during the Preliminary Phase, it resolves immediately after triggering. It is optional; its player may decline to resolve it.

<a id="g-02"></a>

### Unanswered Strike

Unanswered Strike includes Directed Strike; a card with Unanswered Strike also has Directed Strike. Full text: “Directed Strike. A card attacked by this card's simple or special strike does not fight it.” It is a permanent ability.

<a id="g-03"></a>

### Incorporeality

Incorporeality is a permanent creature ability; no other card type can gain it. Creatures with it are **incorporeal creatures**. They may declare movement into an occupied cell. An incorporeal creature sharing a cell with another card, other than its own symbiote or parasite, dies if its controller performs any game action except passing, declaring that creature's movement, or declaring triggered abilities. It also dies when the turn passes to the other player. It may host only an incorporeal symbiote. Such a creature often has a related ability written “Incorporeal: [text]”; several are written “Incorporeal: [text 1, text 2].” A related ability may be playable, triggered, or permanent. Losing Incorporeality also removes all abilities related to it. A stack object that ignores Incorporeality ignores all those related abilities as well. Incorporeal creatures cannot be healed.

<a id="g-04"></a>

### Blessing

Full text: “+1 to all die rolls.” Blessing is a permanent ability and a modifier. An ability granting Blessing uses the short verb “bless.” Thus “bless target card” means “target card gains Blessing.” A card with it is **blessed**.

<a id="g-05"></a>

### Armor X

Full text: “During each player's turn, prevent the first X wounds from nonmagical attacks against this card.” Armor X is permanent. Each Armor X ability has its own X. If a card loses Armor X and later regains it, the gained ability is new and may again prevent its X wounds.

<a id="g-06"></a>

### Vampirism

Text: “When this card deals X wounds with a simple strike to a corporeal creature, it heals X. If it has fewer than X wounds, it gains additional life equal to X minus its wound count, but no more than its life maximum.” Vampirism is triggered.

<a id="g-07"></a>

### Resurrection

Resurrection may be playable or triggered. Card text uses “resurrect” to authorize using it on another card and lists legal targets after that word. A legal target is a card in the resurrecting player's Graveyard, or in the opponent's Graveyard if expressly stated. Resurrection brings that card into the resurrecting player's squad, adjacent to its source and open, unless stated otherwise. The destination cell is also a target and must be chosen when Resurrection is declared. If it becomes occupied before the Wound object resolves, cancel Resurrection without payment. A triggered Resurrection whose trigger is its source card returning to the Deck is legal and may be declared.

<a id="g-08"></a>

### Summoning

Summoning may be playable or triggered. Card text uses “summon” for it. It brings a card from the summoning player's Deck, or the opponent's Deck if expressly stated, into the summoning player's squad adjacent to the source and open, unless stated otherwise. The destination cell is a target. Conditions for cards that may be brought into the squad follow “summon” in the ability text. Summoning does **not** designate the brought card as a target. When the Wound object resolves, the summoning ability's controller first chooses one eligible card from their Deck, then summons it. If the destination cell becomes occupied before that object resolves, cancel Summoning without payment. If the Deck contains no eligible cards, cancel Summoning but pay for it. The player may choose to summon no card; Summoning is still paid for. A triggered Summoning whose trigger is its source card returning to the Deck is legal and may be declared.

<a id="g-09"></a>

### Shot

A Shot is a nonmagical ranged attack and may be a playable or triggered ability.

<a id="g-10"></a>

### Wrath

Wrath is permanent. Full text: “This card has a +1 modifier to its simple strike against cards that received wounds from attacks this turn.”

<a id="g-11"></a>

### Range X

Range X modifies target selection for a card's ability or property. Only a card or cell no more than X cells from the source, counted along verticals, horizontals, or diagonals in any combination, is a legal target. Cards in the Additional Zone cannot be targeted by Range X abilities except ranged attacks, unless expressly stated. Cards in that zone cannot have Range X; a card entering it loses this modifier.

<a id="g-12"></a>

### Gift of Life X

A triggered ability. Full text: “When this card dies, a chosen creature in your squad with the same element as this card gains X additional life, without exceeding its life maximum.”

<a id="g-13"></a>

### Finishing Blow at X

May be playable or triggered. Full text: “Destroy an adjacent corporeal creature with X or fewer current life.”

<a id="g-14"></a>

### Soulcatcher X

A triggered ability. Full text: “When a creature dies, this card gains a token, to a maximum of X.” Soulcatcher X enters the stack, so if creatures die simultaneously, such as a symbiote and its host, its card can play a sudden action between receiving the first and second tokens.

<a id="g-15"></a>

### Unity X

A triggered creature ability that no other card type can gain. Full text: “When this creature initiates an attack, you may find exactly X different creatures with Unity X in your Deck, each costing less than this creature, and reveal them to the opponent. Until this attack's Wound object resolves, this creature gains all the revealed creatures' abilities of the form ‘On [attack type]...’ where [attack type] matches the type of attack it initiated.”

<a id="g-16"></a>

### Thirst X

A triggered ability that flying creatures cannot gain. A creature that gains Flight loses Thirst X. Full text: “If this creature is closed, before your turn begins it may deal X wounds to an adjacent corporeal creature. It does not open at the start of your turn unless it dealt X wounds to an adjacent creature before the turn.”

<a id="g-17"></a>

### Protection from [text]

A permanent ability. Full text: “Abilities and properties of kind [text] produce no effects on this card.” If such an ability is applied to a protected card, abilities triggered by it likewise produce no effects on that card.

<a id="g-18"></a>

### Healing (for X)

May be playable or triggered. The containing ability's text specifies its target. If it targets its own source, it says “heal self (for X)”; if it can target another card, it says “heal (for X).” Without a number it says “heal completely” or “heal self completely.” Full text for Healing for X: “If the corporeal target has X or fewer wounds, remove all its wounds. If it has more than X, remove X wounds.” Full text without a number: “Remove all wounds from a corporeal target.”

<a id="g-19"></a>

### Incarnation X

A mixed ability triggering only while its card is in a Graveyard. Its first part is triggered; the second is permanent. Full text: “At the start of your turn, put a token on this card. If it has at least X tokens, remove all its tokens, give it an incarnation marker, and bring it into your squad closed in any unoccupied cell of your third row. If this card with an incarnation marker enters a Graveyard, remove its Incarnation X.” If your third row has no empty cell, Incarnation X triggers as soon as one appears. Flying creatures enter the Additional Zone immediately after incarnation. Symbiotes, parasites, and equipment die immediately after it. Incarnation X is not Resurrection. A card saying “May use Incarnation any number of times per battle” does not lose Incarnation X when it enters the Graveyard with an incarnation marker. A card saying “May use Incarnation Y times per battle” loses neither Incarnation X nor its incarnation markers when it enters the Graveyard with fewer than Y such markers.

<a id="g-20"></a>

### Concentration

A triggered ability. Full text: “At the end of the opponent's turn, if this card received no wounds during that turn, it gains a token.” If the card receives wounds after Concentration triggers but before it resolves, it gains no token.

<a id="g-21"></a>

### Agility

A triggered ability. Full text: “When this card receives wounds, it may relocate to a neighboring cell, once per turn.” Agility may be used during either player's turn and triggers on wounds dealt by friendly cards.

<a id="g-22"></a>

### Magical Strike

A magical melee attack that is **Unanswered**. It may be playable or triggered.

<a id="g-23"></a>

### Maneuver

A non-sudden playable ability of a creature without a subtype. Other card types and creatures with a subtype cannot gain it. A card that changes type or gains a subtype cannot use Maneuver until it is again a creature without a subtype. Full text: “If this creature is open, has spent no movement units during its turn, and has not acted, it may swap cells with an adjacent friendly creature without a subtype that is not diagonally adjacent, spending all its movement units.” Maneuver counts as movement.

<a id="g-24"></a>

### Camouflage

A permanent ability. Full text: “If this card is closed, it receives no wounds from the first attack against it each turn.” Mark that attack on the card if needed. The attack still occurs and can trigger abilities, but Camouflage prevents its wounds, including wounds from a friendly card's attack. It applies even if the first attack could not deal wounds for another reason.

<a id="g-25"></a>

### Meditation

A permanent ability. Full text: “This card may pay for its playable abilities with tokens on other cards of the same element in your squad.” Neutral cards have no element and cannot use Meditation.

<a id="g-26"></a>

### Throw

A nonmagical ranged attack that may be triggered or playable.

<a id="g-27"></a>

### Directed Strike

A permanent ability. Full text: “A defender cannot be assigned against this card's simple or special strike.”

<a id="g-28"></a>

### Clumsiness (X)

A permanent creature ability and modifier that other card types cannot gain. If X is omitted, it equals one. Full text: “−X to this card's die roll when it initiates a simple-strike attack or responds to a melee strike.”

<a id="g-29"></a>

### Attack Experience (X)

A permanent modifier, with X equal to one if omitted. Full text: “+X to this card's die roll when it initiates a simple-strike attack.”

<a id="g-30"></a>

### Defense Experience (X)

A permanent modifier, with X equal to one if omitted. Full text: “+X to this card's die roll when it responds to a melee strike.”

<a id="g-31"></a>

### Shooting Experience (X)

A permanent modifier, with X equal to one if omitted. Full text: “+X to this card's die roll when it initiates an attack with a Shot.”

<a id="g-32"></a>

### Throwing Experience (X)

A permanent modifier, with X equal to one if omitted. Full text: “+X to this card's die roll when it initiates an attack with a Throw.”

<a id="g-33"></a>

### Discharge Experience (X)

A permanent modifier, with X equal to one if omitted. Full text: “+X to this card's die roll when it initiates an attack with a Discharge.”

<a id="g-34"></a>

### Horde

A permanent ability. Full text: “Before the game begins, your Deck may contain up to five copies of this card.”

<a id="g-35"></a>

### Special Strike

A nonmagical melee attack. It is Unanswered unless its card's text says otherwise. It may be playable or triggered.

<a id="g-36"></a>

### Poisoning for X

A triggered creature ability that no other card type can gain. A creature changing type loses it. An ability granting it says “poison for X”; a creature with it is **poisoned**. An incorporeal creature cannot legally be targeted by it. A poisoned creature that gains Incorporeality or Protection from Poison immediately loses Poisoning for X; each loss is a base effect. Full text: “At the start of your turn, if this creature opened this turn or was open before this turn began, it wounds itself for X.” X equals one if omitted.

<a id="g-37"></a>

### Redistribution (for X)

May be triggered or playable. Cards write it “Redistribute (X wounds).” If X is omitted, the ability's text describes its numerical value. Redistribution heals one creature of X wounds and deals a total of X wounds to creatures. Its source card's controller decides which creatures receive wounds and how many each receives. Legal wound targets are always listed on the card. It is legal to deal a creature more wounds than it has current life.

<a id="g-38"></a>

### Flight

A creature property that no other card type can gain. Flight and the flying-creature subtype are inseparable: all flying creatures have Flight, and all creatures with Flight are flying creatures. A flying creature changing type or subtype loses Flight; a creature losing Flight changes its type or subtype. Unless stated otherwise, a flying creature that loses Flight or its flying subtype becomes an ordinary creature, gains Movement Allowance 1, and enters a free Battlefield cell chosen by its controller. It dies if none is free. Unless stated otherwise, one that changes type to Artifact enters a free Battlefield cell chosen by its controller and dies if none is free. One that changes type to Terrain remains in the Additional Zone. One that changes type to Equipment or subtype to Symbiote or Parasite dies.

<a id="g-39"></a>

### Curse

A permanent modifier. An ability granting it uses “curse”; a card with it is **cursed**. Full text: “−1 to all die rolls.”

<a id="g-40"></a>

### Jump

Playable by default but possibly triggered. A triggered Jump simply relocates to any unoccupied cell; the following rules govern playable Jump. It is non-sudden and belongs only to a creature without a subtype. Other card types and creatures with a subtype cannot gain it. A card that changes type or gains a subtype cannot use Jump until it again becomes a creature without a subtype. Full text: “If this creature is open, has spent no movement units and has not acted during its turn, it relocates to any unoccupied cell, spending all its movement units.” Jump and Teleportation are distinct abilities despite having identical text. Using Jump is movement.

<a id="g-41"></a>

### Discharge

A magical ranged attack that may be triggered or playable.

<a id="g-42"></a>

### Regeneration X

A triggered creature ability that no other card type can gain. Full text: “At the start of your turn, if this creature opened this turn or was open when the turn began, heal it for X.”

<a id="g-43"></a>

### Stealth

A permanent ability. Full text: “This card may remain hidden during Reveal. Its controller may reveal it whenever they have priority.” Revealing a card with Stealth is a playable ability and does not use the stack.

<a id="g-44"></a>

### Resilience

A permanent ability. Full text: “This card receives no wounds from influences if an opposing card deals those wounds.”

<a id="g-45"></a>

### Fear X

A triggered ability. Full text: “When this card is attacked, the attacking card wounds itself for X unless it has Fear X.”

<a id="g-46"></a>

### Formation

A permanent ability of a creature without a subtype; no other card type can gain it. It often appears as “Formation: [text],” where [text] is a Formation-related ability. A creature with Formation lacks its related abilities except where stated otherwise. Full text: “This creature gains all Formation-related abilities while another friendly creature with Formation occupies an adjacent cell that is not diagonally adjacent.” A creature gaining those abilities is **in formation**; they are acquired abilities. A creature **breaks formation** if it was in formation, declares relocation, and is no longer in formation afterward. It **forms formation** if it was not in formation, declares relocation, and is in formation afterward.

<a id="g-47"></a>

### Cache

A permanent ability. Full text: “This card cannot become the initial target of any attack by a flying creature.”

<a id="g-48"></a>

### Teleportation

A non-sudden playable ability of a creature without a subtype. Other card types and creatures with a subtype cannot gain it. A card that changes type or gains a subtype cannot use Teleportation until it again becomes a creature without a subtype. Full text: “If this creature is open, has spent no movement units and has not acted during its turn, it relocates to any unoccupied cell, spending all its movement units.” Teleportation and Jump are distinct abilities despite having identical text. Using Teleportation is movement.

<a id="g-49"></a>

### Thick Skin

A permanent ability. Full text: “Protection from ‘on attack,’ ‘on attack initiation,’ and ‘after attack’ abilities of cards initiating an attack against this card.”

<a id="g-50"></a>

### Accuracy

A permanent ability adding this text to every property and ability produced by the card: “This property/ability cannot be redirected.” Such cards ignore abilities requiring them to initiate an attack. They may decline to target cards that would otherwise require them to do so.

<a id="g-51"></a>

### Corpse-Eating

A triggered creature ability that no other card type can gain. Full text: “If this creature destroys an adjacent corporeal opposing creature with any of its properties or abilities other than a ranged attack, heal it completely and remove its Poisoning.” A flying creature may use Corpse-Eating on any opposing creature; any creature may use it on an opposing flying creature.

<a id="g-52"></a>

### Fading X

A triggered ability. Full text: “At the start of your turn, if this card opened this turn or was open before this turn began, it wounds itself for X.”

<a id="g-53"></a>

### Strike Across a Row

A nonmagical ranged attack that may be triggered or playable. Its legal target must be on the same horizontal or vertical as its source, with exactly one intervening cell that is either empty or occupied by your card. Though ranged, it is still a strike, but not a melee strike.

<a id="g-54"></a>

### Uniqueness

A permanent ability. A card with Uniqueness cannot be brought into a squad already containing a card with the same name.

<a id="g-55"></a>

### Vulnerability

A permanent ability. Full text: “All attacks against this card have a +1 modifier to their numerical value.”

<a id="g-56"></a>

### Vulnerability to [text]

A permanent ability. Full text: “Any ability or property of kind [text] that wounds this card has a +1 modifier to its numerical value.”

<a id="g-57"></a>

### Plague

A triggered creature ability that no other card type can gain. Full text: “When this creature makes a melee strike, the attacked creature gains Plague. If this creature rolls an odd number before modifiers, it wounds itself for X, where X is that unmodified result.”

<a id="g-58"></a>

### Shield of Arhaal X

A permanent ability. Full text: “This card has −1 from nonmagical attacks for each poisoned creature adjacent to it (maximum −X).” Count poisoned creatures in both squads. Check X whenever the modifier must be granted.

<a id="g-59"></a>

### Rage X

A mixed ability. Full text: “At the end of your turn, if this card did not initiate an attack this turn, it gains a token (maximum X); during your turn, if this card is closed, it may lose a token and open.” The first part is triggered; the second is playable. A nonexistent token cannot be lost. A token gained at the end of your turn can immediately be spent to open this card, but the Final Phase has begun, so it cannot declare movement or non-sudden actions. An already open card cannot open again.

<a id="g-60"></a>

### Die roll

The unmodified number from 1 to 6 rolled by a player. After all modifiers, it is the **die-roll result**.

<a id="g-61"></a>

### In a game zone

A key phrase meaning “on the Battlefield or in the Additional Zone.”

<a id="g-62"></a>

### At the start of battle

A key phrase and trigger point.

<a id="g-63"></a>

### Bring into a squad

To summon, resurrect, incarnate, take control of, or recruit a card into a squad.

<a id="g-64"></a>

### Returns to the Deck

Is placed into or put back into the Deck.

<a id="g-65"></a>

### Chosen card

A card targeted by the game action.

<a id="g-66"></a>

### Chosen attack

An attack, represented by a chain of stack objects, targeted by the game action.

<a id="g-67"></a>

### Perform [game action]

Produce all effects arising from that game action.

<a id="g-68"></a>

### Death

Putting a card into a Graveyard by resolving a destruction effect. A card may enter a Graveyard without a destruction effect.

<a id="g-69"></a>

### Card action

A card ability or property requiring that card to close as payment. After acting during a turn, a card cannot move or use another action that turn.

<a id="g-70"></a>

### Act X times per turn

The ability to declare actions X times in a turn.

<a id="g-71"></a>

### Until the end of battle

Until this game ends.

<a id="g-72"></a>

### Before squad recruitment

During the Recruitment Preparation Step.

<a id="g-73"></a>

### Occupied cell

A cell in which a corporeal creature cannot stand.

<a id="g-74"></a>

### Use a game action

Declare and subsequently perform it.

<a id="g-75"></a>

### Card cannot be brought into a squad with [text]

The card cannot be recruited, resurrected, summoned, taken under control, or incarnated if [text] is already in that squad. [Text] cannot be recruited into a squad already containing such a card.

<a id="g-76"></a>

### Copy

Cards with the same name are copies.

<a id="g-77"></a>

### Begins battle with [text]

The card gains [text] during Deployment. This ability does not reveal it.

<a id="g-78"></a>

### Without closing

Means the card may declare actions and move after resolving the ability.

<a id="g-79"></a>

### Receives no wounds from [text]

Abilities or properties of kind [text] do not wound this card, but may legally target it.

<a id="g-80"></a>

### Does not fight

The card neither initiates attacks nor responds to strikes. Resolve every strike against it as though it were closed.

<a id="g-81"></a>

### Announce

The same as declare: put the corresponding chain of objects on the stack.

<a id="g-82"></a>

### Force an attack

Require an opposing card to declare an attack initiation.

<a id="g-83"></a>

### Squad

The cards a player controls on the Battlefield and in the Additional Zone.

<a id="g-84"></a>

### Turned-over card

Obsolete term for a hidden card.

<a id="g-85"></a>

### Swap places

Move two cards simultaneously so that each enters the other's cell.

<a id="g-86"></a>

### Put a card in a cell

Relocate a card or bring it into a squad in the chosen cell.

<a id="g-87"></a>

### On death

A key phrase and trigger point: the ability triggers when the card with it enters a Graveyard. The dead card loses its markers only after all “on death” abilities triggered by its death resolve.

<a id="g-88"></a>

### On death of [text]

A key phrase and trigger point: the ability triggers when [text] or a card with [text] enters a Graveyard. If this ability's own card fits [text], its entry also triggers the ability.

<a id="g-89"></a>

### Wound self

A keyword meaning that a card deals wounds to itself. Resilience does not protect against wounds from abilities using this keyword.

<a id="g-90"></a>

### Reduce attack to X

Set an attack's numerical value to X if it was greater than X. This is a replacement effect.

<a id="g-91"></a>

### Reduce attack to [kind]

Treat attack strength as [kind]. Unless expressly stated, abilities triggered by attack strength being [kind] do not trigger from this reduction. To make them trigger, the ability must say “reduce attack to [kind] with all abilities.”

<a id="g-92"></a>

### Your card

A card under your control.

<a id="g-93"></a>

### Trigger point

A moment or change in the game situation caused by an effect.

<a id="g-94"></a>

### Destroy

Grant a destruction effect.

<a id="g-95"></a>

### Legality condition

A check whether an ability or property may be used. Check it for every stack object before that object resolves and for each ability or property before it is declared.

<a id="g-96"></a>

### Trigger condition

A check for conditions needed for an ability to trigger, such as markers, wounds, or cells.
