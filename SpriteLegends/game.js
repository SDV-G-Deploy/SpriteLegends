const DIFFICULTIES = {
  story: {
    key: "story",
    title: "История",
    heroHpMult: 1.16,
    enemyHpMult: 0.88,
    enemyDmgMult: 0.9,
    potions: 3,
    scoreMult: 0.92,
    affixChance: 0.35,
    rareRelicChance: 0.14,
    eventChance: 0.65,
    effectText: "Герой: +16% HP, враги: -12% HP и -10% урон, 3 зелья."
  },
  normal: {
    key: "normal",
    title: "Норма",
    heroHpMult: 1,
    enemyHpMult: 1,
    enemyDmgMult: 1,
    potions: 2,
    scoreMult: 1,
    affixChance: 0.52,
    rareRelicChance: 0.2,
    eventChance: 0.72,
    effectText: "Базовый баланс: 2 зелья, стандартные HP/урон врагов."
  },
  heroic: {
    key: "heroic",
    title: "Героик",
    heroHpMult: 0.94,
    enemyHpMult: 1.15,
    enemyDmgMult: 1.14,
    potions: 2,
    scoreMult: 1.28,
    affixChance: 0.74,
    rareRelicChance: 0.3,
    eventChance: 0.82,
    effectText: "Герой: -6% HP, враги: +15% HP и +14% урон, аффиксов больше."
  }
};

const HEROES = [
  {
    id: "gnome",
    name: "Гном-факельщик",
    sprite: "../SPRITES/Sprite_006_gnome_full.png",
    maxHp: 124,
    attackMin: 12,
    attackMax: 18,
    specialName: "Пламя посоха",
    specialCost: 2,
    specialDescription: "16-24 урона и Ожог 2.",
    passiveDescription: "Защита дает +4 дополнительного блока."
  },
  {
    id: "mage",
    name: "Тайный маг",
    sprite: "../SPRITES/Sprite_011_mage_full.png",
    maxHp: 106,
    attackMin: 11,
    attackMax: 17,
    specialName: "Арканный призматик",
    specialCost: 2,
    specialDescription: "14-20 урона, +10 блока, Exposed 1 на врага.",
    passiveDescription: "Первая способность в бою возвращает 1 AP."
  },
  {
    id: "gipsy",
    name: "Гадалка сфер",
    sprite: "../SPRITES/Sprite_012_gipsy_full.png",
    maxHp: 114,
    attackMin: 11,
    attackMax: 16,
    specialName: "Сфера рока",
    specialCost: 2,
    specialDescription: "12-18 урона, лечение 10 HP, снимает 1 дебафф.",
    passiveDescription: "Каждая 3-я способность дает +1 AP."
  },
  {
    id: "bard",
    name: "Бард-дуэлянт",
    sprite: "../SPRITES/Sprite_014_bard_full.png",
    maxHp: 112,
    attackMin: 10,
    attackMax: 15,
    specialName: "Боевой рефрен",
    specialCost: 2,
    specialDescription: "10-14 урона, Weaken 2 на врага, Inspire 2.",
    passiveDescription: "Каждый 3-й обычный удар накладывает Exposed 1."
  }
];

const ENEMY_ARCHETYPES = {
  goblin: {
    id: "goblin",
    name: "Гоблин-мародер",
    sprite: "../SPRITES/Sprite_009_goblin_full.png",
    baseHp: 88,
    movePattern: ["goblin_slash", "goblin_dirt", "goblin_flurry"]
  },
  werewolf: {
    id: "werewolf",
    name: "Оборотень",
    sprite: "../SPRITES/Sprite_010_werewolf_full.png",
    baseHp: 118,
    movePattern: ["wolf_claw", "wolf_rend", "wolf_howl", "wolf_claw"]
  },
  golem: {
    id: "golem",
    name: "Кристальный голем",
    sprite: "../SPRITES/Sprite_007_golem_full.png",
    baseHp: 146,
    movePattern: ["golem_slam", "golem_guard", "golem_quake"]
  },
  dragon: {
    id: "dragon",
    name: "Древний дракон",
    sprite: "../SPRITES/Sprite_005_dragon_full.png",
    baseHp: 208,
    movePattern: ["dragon_flame", "dragon_tail", "dragon_charge", "dragon_flame"]
  }
};

const AFFIXES = [
  {
    id: "enraged",
    name: "Яростный",
    description: "+18% к урону врага.",
    apply(enemy) {
      enemy.damageScale *= 1.18;
    }
  },
  {
    id: "armored",
    name: "Бронированный",
    description: "Начинает бой с 18 блока.",
    apply(enemy) {
      enemy.block += 18;
    }
  },
  {
    id: "regenerating",
    name: "Регенератор",
    description: "В начале своего хода лечится на 6 HP.",
    apply(enemy) {
      enemy.flags.regen = 6;
    }
  },
  {
    id: "venomous",
    name: "Ядовитый",
    description: "Его атаки чаще накладывают кровотечение.",
    apply(enemy) {
      enemy.flags.venomous = true;
    }
  },
  {
    id: "swift",
    name: "Стремительный",
    description: "Первый атакующий ход наносит +25% урона.",
    apply(enemy) {
      enemy.flags.firstStrikeBoost = 1.25;
    }
  }
];

const RELICS = [
  {
    id: "steel_edge",
    name: "Стальной край",
    description: "+3 к базовой атаке.",
    apply(stateRef) {
      stateRef.mods.attackFlat += 3;
    }
  },
  {
    id: "crystal_heart",
    name: "Кристальное сердце",
    description: "+18 к макс. HP и лечение на 18.",
    apply(stateRef) {
      stateRef.hero.maxHp += 18;
      stateRef.hero.hp = Math.min(stateRef.hero.maxHp, stateRef.hero.hp + 18);
    }
  },
  {
    id: "war_drums",
    name: "Боевые барабаны",
    description: "В первый ход боя +1 AP.",
    apply(stateRef) {
      stateRef.mods.firstTurnAp += 1;
    }
  },
  {
    id: "vampiric_fang",
    name: "Клык вампира",
    description: "Лечение на 16% от нанесенного удара.",
    apply(stateRef) {
      stateRef.mods.lifesteal += 0.16;
    }
  },
  {
    id: "mirror_guard",
    name: "Зеркальный щит",
    description: "Первый полученный удар в бою ослабляется на 50%.",
    apply(stateRef) {
      stateRef.mods.firstHitReduction = Math.max(stateRef.mods.firstHitReduction, 0.5);
    }
  },
  {
    id: "alchemist_belt",
    name: "Пояс алхимика",
    description: "+1 зелье, зелья лечат еще +10.",
    apply(stateRef) {
      stateRef.potions += 1;
      stateRef.mods.potionBonus += 10;
    }
  },
  {
    id: "arcane_battery",
    name: "Арканная батарея",
    description: "КД способности -1 (минимум 1).",
    apply(stateRef) {
      stateRef.mods.specialCdMod -= 1;
    }
  },
  {
    id: "thornmail",
    name: "Шипастый доспех",
    description: "Возвращает 25% входящего урона.",
    apply(stateRef) {
      stateRef.mods.thorns += 0.25;
    }
  },
  {
    id: "executioner",
    name: "Печать палача",
    description: "По целям ниже 35% HP наносится +35% урона.",
    apply(stateRef) {
      stateRef.mods.executeBonus += 0.35;
    }
  },
  {
    id: "tactical_wall",
    name: "Тактический бастион",
    description: "Защита дает дополнительно +6 блока.",
    apply(stateRef) {
      stateRef.mods.guardBonus += 6;
    }
  },
  {
    id: "eagle_eye",
    name: "Глаз орла",
    description: "+10% шанс крита.",
    apply(stateRef) {
      stateRef.mods.critChance += 0.1;
    }
  },
  {
    id: "rally_standard",
    name: "Штандарт ралли",
    description: "После победы в бою лечение +12 HP.",
    apply(stateRef) {
      stateRef.mods.postBattleHeal += 12;
    }
  }
];

const RARE_RELICS = [
  {
    id: "phoenix_ash",
    name: "Пепел феникса",
    tier: "S",
    description: "Один раз за забег воскресает на 35% HP.",
    apply(stateRef) {
      stateRef.mods.reviveCharges += 1;
    }
  },
  {
    id: "tempest_core",
    name: "Сердце бури",
    tier: "S",
    description: "+1 AP каждый ход, но в начале хода герой теряет 4 HP.",
    apply(stateRef) {
      stateRef.mods.apPerTurn += 1;
      stateRef.mods.selfTickDamage += 4;
    }
  },
  {
    id: "void_grimoire",
    name: "Гримуар пустоты",
    tier: "S",
    description: "Способность стоит на 1 AP меньше и сильнее, но накладывает Ожог 1 на героя.",
    apply(stateRef) {
      stateRef.mods.specialCostMod -= 1;
      stateRef.mods.specialPower += 0.35;
      stateRef.mods.selfBurnOnSpecial += 1;
    }
  },
  {
    id: "glass_cannon",
    name: "Стеклянная пушка",
    tier: "S",
    description: "Обычные удары: +55% урона, но входящий урон по герою +20%.",
    apply(stateRef) {
      stateRef.mods.strikeBonus += 0.55;
      stateRef.mods.damageTakenMult += 0.2;
    }
  },
  {
    id: "titan_heart",
    name: "Сердце титана",
    tier: "S",
    description: "+40 макс. HP и +2 атака, но в 1-й ход боя -1 AP.",
    apply(stateRef) {
      stateRef.hero.maxHp += 40;
      stateRef.hero.hp = Math.min(stateRef.hero.maxHp, stateRef.hero.hp + 40);
      stateRef.mods.attackFlat += 2;
      stateRef.mods.firstTurnAp -= 1;
    }
  },
  {
    id: "shadow_dice",
    name: "Кости тени",
    tier: "S",
    description: "+25% крит-шанс и +30% очков, но -20 макс. HP.",
    apply(stateRef) {
      stateRef.mods.critChance += 0.25;
      stateRef.mods.scoreBonus += 0.3;
      stateRef.hero.maxHp = Math.max(50, stateRef.hero.maxHp - 20);
      stateRef.hero.hp = Math.min(stateRef.hero.hp, stateRef.hero.maxHp);
    }
  }
];
const MOVE_LIBRARY = {
  goblin_slash: {
    name: "Ржавый клинок",
    intentText: "9-13 урона, шанс Кровотечения 1.",
    type: "attack",
    hits: 1,
    damage: [9, 13],
    onHit(context) {
      if (chance(context.rng, 0.34)) {
        addStatus(context.hero.statuses, "bleed", 1);
        log("Герой получает Кровотечение 1.", "bad");
      }
    }
  },
  goblin_dirt: {
    name: "Песок в глаза",
    intentText: "7-10 урона и Vulnerable 1.",
    type: "attack",
    hits: 1,
    damage: [7, 10],
    onHit(context) {
      addStatus(context.hero.statuses, "vulnerable", 1);
      log("Герой становится уязвимым (Vulnerable 1).", "bad");
    }
  },
  goblin_flurry: {
    name: "Рваный шквал",
    intentText: "2x 5-7 урона.",
    type: "attack",
    hits: 2,
    damage: [5, 7]
  },
  wolf_claw: {
    name: "Когти ярости",
    intentText: "2x 6-9 урона.",
    type: "attack",
    hits: 2,
    damage: [6, 9]
  },
  wolf_rend: {
    name: "Глубокая рана",
    intentText: "12-17 урона и Кровотечение 2.",
    type: "attack",
    hits: 1,
    damage: [12, 17],
    onHit(context) {
      addStatus(context.hero.statuses, "bleed", 2);
      log("Оборотень накладывает Кровотечение 2.", "bad");
    }
  },
  wolf_howl: {
    name: "Леденящий вой",
    intentText: "Усиливает следующий урон (+4).",
    type: "buff",
    execute(context) {
      context.enemy.tempAttack += 4;
      log("Оборотень заводится от воя (+4 к следующему удару).", "bad");
    }
  },
  golem_slam: {
    name: "Каменный удар",
    intentText: "14-20 урона.",
    type: "attack",
    hits: 1,
    damage: [14, 20]
  },
  golem_guard: {
    name: "Кристальный панцирь",
    intentText: "+16 блока и +3 к следующему удару.",
    type: "buff",
    execute(context) {
      context.enemy.block += 16;
      context.enemy.tempAttack += 3;
      log("Голем укрепляется кристаллами.", "bad");
    }
  },
  golem_quake: {
    name: "Дрожь земли",
    intentText: "11-14 урона и Vulnerable 1.",
    type: "attack",
    hits: 1,
    damage: [11, 14],
    onHit(context) {
      addStatus(context.hero.statuses, "vulnerable", 1);
      log("Герой получает Vulnerable 1.", "bad");
    }
  },
  dragon_flame: {
    name: "Огненное дыхание",
    intentText: "16-24 урона и Ожог 2.",
    type: "attack",
    hits: 1,
    damage: [16, 24],
    onHit(context) {
      addStatus(context.hero.statuses, "burn", 2);
      log("Дракон оставляет Ожог 2.", "bad");
    }
  },
  dragon_tail: {
    name: "Размашистый хвост",
    intentText: "2x 10-14 урона.",
    type: "attack",
    hits: 2,
    damage: [10, 14]
  },
  dragon_charge: {
    name: "Взмах крыльев",
    intentText: "Подготовка: следующий ход будет пикирование.",
    type: "buff",
    execute(context) {
      context.enemy.flags.chargedDive = true;
      log("Дракон поднимается в воздух для пикирования.", "bad");
    }
  },
  dragon_dive: {
    name: "Пикирование",
    intentText: "26-34 урона.",
    type: "attack",
    hits: 1,
    damage: [26, 34]
  },
  dragon_inferno: {
    name: "Инферно",
    intentText: "3x 9-12 урона, шанс Ожога 1.",
    type: "attack",
    hits: 3,
    damage: [9, 12],
    onHit(context) {
      if (chance(context.rng, 0.4)) {
        addStatus(context.hero.statuses, "burn", 1);
        log("Инферно накладывает Ожог 1.", "bad");
      }
    }
  },
  dragon_barrier: {
    name: "Чешуйчатый барьер",
    intentText: "+24 блока и усиление следующей атаки (+5).",
    type: "buff",
    execute(context) {
      context.enemy.block += 24;
      context.enemy.tempAttack += 5;
      log("Дракон усиливает защиту и накапливает ярость.", "bad");
    }
  },
  dragon_hellfire: {
    name: "Адское пламя",
    intentText: "20-28 урона, Ожог 3 и Vulnerable 1.",
    type: "attack",
    hits: 1,
    damage: [20, 28],
    onHit(context) {
      addStatus(context.hero.statuses, "burn", 3);
      addStatus(context.hero.statuses, "vulnerable", 1);
      log("Адское пламя оставляет тяжелые дебаффы.", "bad");
    }
  }
};

const STATUS_LABELS = {
  bleed: "Кровотечение",
  burn: "Ожог",
  vulnerable: "Vulnerable",
  weaken: "Weaken",
  inspire: "Inspire",
  exposed: "Exposed",
  poison: "Poison"
};

const state = {
  difficultyKey: "normal",
  difficulty: DIFFICULTIES.normal,
  seed: "",
  rng: Math.random,
  heroTemplate: null,
  hero: null,
  encounters: [],
  encounterIndex: 0,
  enemy: null,
  turn: 1,
  ap: 0,
  baseAp: 2,
  specialCooldown: 0,
  potions: 2,
  combo: 1,
  score: 0,
  relics: [],
  relicSet: new Set(),
  rewardChoices: [],
  currentEvent: null,
  intermissionNote: "",
  busy: false,
  runEnded: false,
  mods: {
    attackFlat: 0,
    firstTurnAp: 0,
    lifesteal: 0,
    firstHitReduction: 0,
    potionBonus: 0,
    specialCdMod: 0,
    thorns: 0,
    executeBonus: 0,
    guardBonus: 0,
    critChance: 0,
    postBattleHeal: 0,
    apPerTurn: 0,
    selfTickDamage: 0,
    specialCostMod: 0,
    specialPower: 0,
    selfBurnOnSpecial: 0,
    strikeBonus: 0,
    damageTakenMult: 0,
    scoreBonus: 0,
    reviveCharges: 0,
    curseStacks: 0
  },
  battle: {
    firstSpecialUsed: false,
    mirrorUsed: false,
    strikeCounter: 0,
    specialCastCounter: 0,
    intent: null
  },
  bestScore: 0
};

const ui = {
  screens: {
    start: document.getElementById("start-screen"),
    selection: document.getElementById("selection-screen"),
    battle: document.getElementById("battle-screen"),
    reward: document.getElementById("reward-screen"),
    event: document.getElementById("event-screen"),
    result: document.getElementById("result-screen")
  },
  difficultyGroup: document.getElementById("difficulty-group"),
  difficultyDesc: document.getElementById("difficulty-desc"),
  seedInput: document.getElementById("seed-input"),
  rerollSeedBtn: document.getElementById("reroll-seed-btn"),
  startBtn: document.getElementById("start-btn"),
  metaBest: document.getElementById("meta-best"),
  heroGrid: document.getElementById("hero-grid"),
  backBtn: document.getElementById("back-btn"),
  runSeed: document.getElementById("run-seed"),
  encounterLabel: document.getElementById("encounter-label"),
  turnLabel: document.getElementById("turn-label"),
  apDots: document.getElementById("ap-dots"),
  heroName: document.getElementById("hero-name"),
  heroSprite: document.getElementById("hero-sprite"),
  heroHpBar: document.getElementById("hero-hp-bar"),
  heroHpText: document.getElementById("hero-hp-text"),
  heroBlockBar: document.getElementById("hero-block-bar"),
  heroBlockText: document.getElementById("hero-block-text"),
  heroStatuses: document.getElementById("hero-statuses"),
  enemyName: document.getElementById("enemy-name"),
  enemySprite: document.getElementById("enemy-sprite"),
  enemyHpBar: document.getElementById("enemy-hp-bar"),
  enemyHpText: document.getElementById("enemy-hp-text"),
  enemyBlockBar: document.getElementById("enemy-block-bar"),
  enemyBlockText: document.getElementById("enemy-block-text"),
  enemyStatuses: document.getElementById("enemy-statuses"),
  enemyAffix: document.getElementById("enemy-affix"),
  relicList: document.getElementById("relic-list"),
  intentName: document.getElementById("intent-name"),
  intentDesc: document.getElementById("intent-desc"),
  attackBtn: document.getElementById("attack-btn"),
  specialBtn: document.getElementById("special-btn"),
  guardBtn: document.getElementById("guard-btn"),
  potionBtn: document.getElementById("potion-btn"),
  endTurnBtn: document.getElementById("end-turn-btn"),
  potionCount: document.getElementById("potion-count"),
  specialCd: document.getElementById("special-cd"),
  comboCount: document.getElementById("combo-count"),
  log: document.getElementById("log"),
  retreatBtn: document.getElementById("retreat-btn"),
  rewardText: document.getElementById("reward-text"),
  rewardGrid: document.getElementById("reward-grid"),
  skipRewardBtn: document.getElementById("skip-reward-btn"),
  eventTitle: document.getElementById("event-title"),
  eventText: document.getElementById("event-text"),
  eventGrid: document.getElementById("event-grid"),
  resultTitle: document.getElementById("result-title"),
  resultText: document.getElementById("result-text"),
  resultScore: document.getElementById("result-score"),
  resultBest: document.getElementById("result-best"),
  playAgainBtn: document.getElementById("play-again-btn")
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function hashSeed(text) {
  let hash = 2166136261;

  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function mulberry32(seed) {
  let t = seed >>> 0;

  return function random() {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), t | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function rng() {
  return state.rng();
}

function randInt(min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function chance(localRng, probability) {
  return localRng() < probability;
}

function pick(list) {
  return list[Math.floor(rng() * list.length)];
}

function sampleUnique(list, amount) {
  const pool = [...list];
  const selected = [];

  while (pool.length > 0 && selected.length < amount) {
    const idx = Math.floor(rng() * pool.length);
    selected.push(pool[idx]);
    pool.splice(idx, 1);
  }

  return selected;
}

function setBar(el, current, max) {
  const value = max <= 0 ? 0 : clamp(Math.round((current / max) * 100), 0, 100);
  el.style.width = `${value}%`;
}

function makeSeed() {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let out = "";

  for (let i = 0; i < 8; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }

  return out;
}

function initSeed() {
  const raw = (ui.seedInput.value || "").trim().toUpperCase();
  const seed = raw || makeSeed();
  const seedNum = hashSeed(seed);

  state.seed = seed;
  state.rng = mulberry32(seedNum);
  ui.seedInput.value = seed;
}

function showScreen(target) {
  Object.values(ui.screens).forEach((screen) => {
    screen.classList.remove("active");
  });

  ui.screens[target].classList.add("active");
}

function clearLog() {
  ui.log.innerHTML = "";
}

function log(message, type = "") {
  const row = document.createElement("p");
  row.textContent = message;

  if (type) {
    row.classList.add(type);
  }

  ui.log.appendChild(row);
  ui.log.scrollTop = ui.log.scrollHeight;
}

function pulseHit(el) {
  el.classList.remove("hit");
  void el.offsetWidth;
  el.classList.add("hit");
}

function addStatus(statuses, key, amount) {
  statuses[key] = Math.max(0, (statuses[key] || 0) + amount);
}

function consumeStatus(statuses, key, amount = 1) {
  if (!statuses[key]) {
    return;
  }

  statuses[key] = Math.max(0, statuses[key] - amount);
}
function cloneHero(template) {
  const hp = Math.round(template.maxHp * state.difficulty.heroHpMult);

  return {
    ...template,
    maxHp: hp,
    hp,
    block: 0,
    statuses: {
      bleed: 0,
      burn: 0,
      vulnerable: 0,
      weaken: 0,
      inspire: 0
    }
  };
}

function createEnemy(templateId, tier, opts = {}) {
  const archetype = ENEMY_ARCHETYPES[templateId];
  const elite = Boolean(opts.elite);
  const boss = Boolean(opts.boss);
  const hpScale = 1 + (tier - 1) * 0.14;
  const dmgScale = 1 + (tier - 1) * 0.12;
  const randomHpScale = 0.93 + rng() * 0.14;
  const randomDmgScale = 0.94 + rng() * 0.12;

  const enemy = {
    id: archetype.id,
    name: archetype.name,
    sprite: archetype.sprite,
    maxHp: Math.round(
      archetype.baseHp
      * hpScale
      * randomHpScale
      * state.difficulty.enemyHpMult
      * (elite ? 1.25 : 1)
      * (boss ? 1.12 : 1)
    ),
    hp: 0,
    block: 0,
    damageScale: dmgScale * randomDmgScale * state.difficulty.enemyDmgMult * (elite ? 1.14 : 1) * (boss ? 1.08 : 1),
    movePattern: [...archetype.movePattern],
    moveIndex: 0,
    statuses: {
      burn: 0,
      poison: 0,
      exposed: 0,
      weaken: 0
    },
    phase: archetype.id === "dragon" ? 1 : 0,
    tempAttack: 0,
    affix: null,
    flags: {
      regen: 0,
      venomous: false,
      firstStrikeBoost: 1,
      chargedDive: false,
      firstAttackDone: false
    },
    elite,
    boss,
    tier
  };

  enemy.hp = enemy.maxHp;

  if (!boss) {
    const affixChance = elite ? Math.min(1, state.difficulty.affixChance + 0.24) : state.difficulty.affixChance;

    if (chance(rng, affixChance)) {
      const affix = pick(AFFIXES);
      enemy.affix = affix;
      affix.apply(enemy);
    }
  }

  return enemy;
}

function generateEncounters() {
  const list = [];
  const regularPool = ["goblin", "werewolf", "golem"];

  for (let i = 0; i < 4; i += 1) {
    list.push(createEnemy(pick(regularPool), i + 1));
  }

  list.push(createEnemy(pick(["werewolf", "golem"]), 5, { elite: true }));
  list.push(createEnemy("dragon", 6, { boss: true, elite: true }));

  return list;
}

function effectiveSpecialCooldown() {
  return Math.max(1, 2 + state.mods.specialCdMod);
}

function effectiveSpecialCost() {
  const baseCost = state.hero ? state.hero.specialCost : 2;
  return Math.max(1, baseCost + state.mods.specialCostMod);
}

function tryReviveIfPossible() {
  if (state.hero.hp > 0 || state.mods.reviveCharges <= 0) {
    return false;
  }

  state.mods.reviveCharges -= 1;
  state.hero.hp = Math.max(1, Math.round(state.hero.maxHp * 0.35));
  state.hero.block = 12;
  state.hero.statuses.bleed = 0;
  state.hero.statuses.burn = 0;
  log("Пепел феникса сработал: герой воскресает.", "good");
  return true;
}

function applyOutgoingBonuses(baseDamage) {
  let damage = baseDamage;

  if (state.hero.statuses.weaken > 0) {
    damage = Math.round(damage * 0.75);
  }

  if (state.enemy.statuses.exposed > 0) {
    damage = Math.round(damage * 1.25);
  }

  const hpRatio = state.enemy.maxHp > 0 ? state.enemy.hp / state.enemy.maxHp : 1;

  if (hpRatio <= 0.35 && state.mods.executeBonus > 0) {
    damage = Math.round(damage * (1 + state.mods.executeBonus));
  }

  return Math.max(1, damage);
}

function applyIncomingOnHero(rawDamage) {
  let damage = rawDamage;

  if (state.hero.statuses.vulnerable > 0) {
    damage = Math.round(damage * 1.3);
  }

  if (state.mods.damageTakenMult > 0) {
    damage = Math.round(damage * (1 + state.mods.damageTakenMult));
  }

  if (state.mods.firstHitReduction > 0 && !state.battle.mirrorUsed && damage > 0) {
    damage = Math.round(damage * (1 - state.mods.firstHitReduction));
    state.battle.mirrorUsed = true;
    log("Зеркальный щит ослабил первый входящий удар.", "good");
  }

  let blocked = 0;

  if (state.hero.block > 0) {
    blocked = Math.min(state.hero.block, damage);
    state.hero.block -= blocked;
    damage -= blocked;
  }

  damage = Math.max(0, damage);

  if (blocked > 0) {
    log(`Блок героя поглотил ${blocked} урона.`, "good");
  }

  if (damage > 0) {
    state.hero.hp = Math.max(0, state.hero.hp - damage);
    pulseHit(ui.heroSprite);
    tryReviveIfPossible();
  }

  if (damage > 0 && state.mods.thorns > 0) {
    const reflect = Math.max(1, Math.round(damage * state.mods.thorns));
    applyDamageToEnemy(reflect, "Шипы возвращают урон", false);
  }

  return damage;
}

function applyDamageToEnemy(rawDamage, sourceText, canCrit = true) {
  let damage = Math.max(1, rawDamage);
  let crit = false;

  if (canCrit) {
    const critChance = 0.08 + state.mods.critChance;

    if (chance(rng, critChance)) {
      damage = Math.round(damage * 1.6);
      crit = true;
    }
  }

  let blocked = 0;

  if (state.enemy.block > 0) {
    blocked = Math.min(state.enemy.block, damage);
    state.enemy.block -= blocked;
    damage -= blocked;
  }

  damage = Math.max(0, damage);

  if (blocked > 0) {
    log(`Блок врага поглотил ${blocked}.`, "bad");
  }

  if (damage > 0) {
    state.enemy.hp = Math.max(0, state.enemy.hp - damage);
    pulseHit(ui.enemySprite);
  }

  if (damage > 0) {
    handleDragonPhaseTransition();
  }

  const critMark = crit ? " КРИТ" : "";
  log(`${sourceText}: ${damage}${critMark}.`, "good");

  if (damage > 0 && state.mods.lifesteal > 0) {
    const heal = Math.max(1, Math.round(damage * state.mods.lifesteal));
    state.hero.hp = Math.min(state.hero.maxHp, state.hero.hp + heal);
    log(`Похищение жизни восстанавливает ${heal} HP.`, "good");
  }

  return damage;
}

function handleDragonPhaseTransition() {
  if (!state.enemy || state.enemy.id !== "dragon" || state.enemy.hp <= 0) {
    return;
  }

  const ratio = state.enemy.maxHp > 0 ? state.enemy.hp / state.enemy.maxHp : 1;

  if (state.enemy.phase === 1 && ratio <= 0.7) {
    state.enemy.phase = 2;
    state.enemy.block += 22;
    state.enemy.hp = Math.min(state.enemy.maxHp, state.enemy.hp + 18);
    state.enemy.damageScale *= 1.1;
    state.enemy.movePattern = ["dragon_inferno", "dragon_tail", "dragon_barrier", "dragon_flame"];
    state.enemy.moveIndex = 0;
    log("Дракон входит во 2 фазу: ярость и пламя усиливаются.", "bad");
    setNextIntent();
    return;
  }

  if (state.enemy.phase === 2 && ratio <= 0.35) {
    state.enemy.phase = 3;
    state.enemy.block += 28;
    state.enemy.damageScale *= 1.14;
    state.enemy.tempAttack += 4;
    state.enemy.movePattern = ["dragon_hellfire", "dragon_dive", "dragon_tail", "dragon_hellfire"];
    state.enemy.moveIndex = 0;
    log("Дракон входит в 3 фазу: начинается финальный штурм.", "bad");
    setNextIntent();
  }
}

function calculateStrikeDamage() {
  const base = randInt(state.hero.attackMin, state.hero.attackMax) + state.mods.attackFlat;
  let damage = applyOutgoingBonuses(base);

  if (state.combo > 1) {
    damage = Math.round(damage * (1 + Math.min(0.32, (state.combo - 1) * 0.08)));
  }

  if (state.mods.strikeBonus > 0) {
    damage = Math.round(damage * (1 + state.mods.strikeBonus));
  }

  if (state.hero.statuses.inspire > 0) {
    damage += 5;
    consumeStatus(state.hero.statuses, "inspire", 1);
    log("Inspire усиливает удар на +5.", "good");
  }

  return Math.max(1, damage);
}

function applyHeroDots() {
  let total = 0;

  if (state.hero.statuses.bleed > 0) {
    const damage = 4;
    state.hero.hp = Math.max(0, state.hero.hp - damage);
    total += damage;
    consumeStatus(state.hero.statuses, "bleed", 1);
    log(`Кровотечение наносит ${damage} урона герою.`, "bad");
    pulseHit(ui.heroSprite);
  }

  if (state.hero.statuses.burn > 0) {
    const damage = 5;
    state.hero.hp = Math.max(0, state.hero.hp - damage);
    total += damage;
    consumeStatus(state.hero.statuses, "burn", 1);
    log(`Ожог наносит ${damage} урона герою.`, "bad");
    pulseHit(ui.heroSprite);
  }

  return total;
}

function applyEnemyDots() {
  let total = 0;

  if (state.enemy.statuses.burn > 0) {
    const damage = 5;
    state.enemy.hp = Math.max(0, state.enemy.hp - damage);
    total += damage;
    consumeStatus(state.enemy.statuses, "burn", 1);
    log(`Ожог обжигает врага на ${damage}.`, "good");
    pulseHit(ui.enemySprite);
  }

  if (state.enemy.statuses.poison > 0) {
    const damage = 4;
    state.enemy.hp = Math.max(0, state.enemy.hp - damage);
    total += damage;
    consumeStatus(state.enemy.statuses, "poison", 1);
    log(`Яд тикает по врагу на ${damage}.`, "good");
    pulseHit(ui.enemySprite);
  }

  return total;
}

function heroStrike() {
  if (state.ap < 1) {
    log("Недостаточно AP.", "bad");
    return;
  }

  state.ap -= 1;
  state.combo = clamp(state.combo + 1, 1, 5);
  state.battle.strikeCounter += 1;

  const damage = calculateStrikeDamage();
  applyDamageToEnemy(damage, "Обычный удар");

  if (state.hero.id === "bard" && state.battle.strikeCounter % 3 === 0) {
    addStatus(state.enemy.statuses, "exposed", 1);
    log("Ритм барда: враг получает Exposed 1.", "good");
  }
}

function heroGuard() {
  if (state.ap < 1) {
    log("Недостаточно AP.", "bad");
    return;
  }

  state.ap -= 1;
  state.combo = 1;

  let block = 14 + state.mods.guardBonus;

  if (state.hero.id === "gnome") {
    block += 4;
  }

  state.hero.block += block;
  log(`Герой накапливает ${block} блока.`, "good");
}

function heroPotion() {
  if (state.ap < 1) {
    log("Недостаточно AP.", "bad");
    return;
  }

  if (state.potions <= 0) {
    log("Зелья закончились.", "bad");
    return;
  }

  state.ap -= 1;
  state.combo = 1;
  state.potions -= 1;

  const heal = 30 + state.mods.potionBonus;
  state.hero.hp = Math.min(state.hero.maxHp, state.hero.hp + heal);
  log(`Зелье восстанавливает ${heal} HP.`, "good");
}

function heroSpecial() {
  const cost = effectiveSpecialCost();

  if (state.specialCooldown > 0) {
    log(`Способность на перезарядке еще ${state.specialCooldown} ход(а).`, "bad");
    return;
  }

  if (state.ap < cost) {
    log("Недостаточно AP для способности.", "bad");
    return;
  }

  state.ap -= cost;
  state.combo = 1;
  state.battle.specialCastCounter += 1;

  if (state.hero.id === "gnome") {
    const base = randInt(16, 24) + state.mods.attackFlat;
    const dealt = applyDamageToEnemy(applyOutgoingBonuses(Math.round(base * (1 + state.mods.specialPower))), "Пламя посоха");

    if (dealt > 0) {
      addStatus(state.enemy.statuses, "burn", 2);
      log("На враге Ожог 2.", "good");
    }
  }

  if (state.hero.id === "mage") {
    const base = randInt(14, 20) + state.mods.attackFlat;
    applyDamageToEnemy(applyOutgoingBonuses(Math.round(base * (1 + state.mods.specialPower))), "Арканный призматик");
    state.hero.block += 10;
    addStatus(state.enemy.statuses, "exposed", 1);
    log("Маг получает +10 блока, враг получает Exposed 1.", "good");

    if (!state.battle.firstSpecialUsed) {
      state.ap += 1;
      log("Пассив мага вернул 1 AP.", "good");
    }
  }
  if (state.hero.id === "gipsy") {
    const base = randInt(12, 18) + state.mods.attackFlat;
    applyDamageToEnemy(applyOutgoingBonuses(Math.round(base * (1 + state.mods.specialPower))), "Сфера рока");
    state.hero.hp = Math.min(state.hero.maxHp, state.hero.hp + 10);
    log("Гадалка лечится на 10 HP.", "good");

    const debuffKeys = ["bleed", "burn", "vulnerable", "weaken"];
    const removable = debuffKeys.filter((key) => state.hero.statuses[key] > 0);

    if (removable.length > 0) {
      const removed = removable[0];
      consumeStatus(state.hero.statuses, removed, 1);
      log(`Снят дебафф ${STATUS_LABELS[removed]}.`, "good");
    }

    if (state.battle.specialCastCounter % 3 === 0) {
      state.ap += 1;
      log("Пассив гадалки: каждая 3-я способность дает +1 AP.", "good");
    }
  }

  if (state.hero.id === "bard") {
    const base = randInt(10, 14) + state.mods.attackFlat;
    applyDamageToEnemy(applyOutgoingBonuses(Math.round(base * (1 + state.mods.specialPower))), "Боевой рефрен");
    addStatus(state.enemy.statuses, "weaken", 2);
    addStatus(state.hero.statuses, "inspire", 2);
    log("Враг ослаблен (Weaken 2), герой получает Inspire 2.", "good");
  }

  if (state.mods.selfBurnOnSpecial > 0) {
    addStatus(state.hero.statuses, "burn", state.mods.selfBurnOnSpecial);
    log(`Цена силы: герой получает Ожог ${state.mods.selfBurnOnSpecial}.`, "bad");
  }

  state.battle.firstSpecialUsed = true;
  state.specialCooldown = effectiveSpecialCooldown();
}

function pickEnemyMoveKey(enemy) {
  if (enemy.id === "dragon" && enemy.flags.chargedDive) {
    enemy.flags.chargedDive = false;
    return "dragon_dive";
  }

  const key = enemy.movePattern[enemy.moveIndex % enemy.movePattern.length];
  enemy.moveIndex += 1;
  return key;
}

function computeEnemyBaseDamage(enemy, rollValue) {
  let damage = Math.round(rollValue * enemy.damageScale + enemy.tempAttack);

  if (enemy.statuses.weaken > 0) {
    damage = Math.round(damage * 0.75);
  }

  if (!enemy.flags.firstAttackDone && enemy.flags.firstStrikeBoost > 1) {
    damage = Math.round(damage * enemy.flags.firstStrikeBoost);
  }

  return Math.max(1, damage);
}

function previewEnemyMove(enemy, move) {
  if (move.type === "buff") {
    return move.intentText;
  }

  const min = computeEnemyBaseDamage(enemy, move.damage[0]);
  const max = computeEnemyBaseDamage(enemy, move.damage[1]);

  if (move.hits > 1) {
    return `${move.hits}x ${min}-${max} урона`;
  }

  return `${min}-${max} урона`;
}

function setNextIntent() {
  const moveKey = pickEnemyMoveKey(state.enemy);
  const move = MOVE_LIBRARY[moveKey];

  state.battle.intent = {
    key: moveKey,
    name: move.name,
    text: move.intentText,
    preview: previewEnemyMove(state.enemy, move)
  };
}

function performEnemyIntent() {
  const intent = state.battle.intent;

  if (!intent) {
    return;
  }

  const move = MOVE_LIBRARY[intent.key];

  if (!move) {
    return;
  }

  log(`Враг использует: ${move.name}.`, "bad");

  if (move.type === "buff") {
    move.execute({ hero: state.hero, enemy: state.enemy, rng });
    state.enemy.flags.firstAttackDone = true;
    state.enemy.tempAttack = Math.max(0, state.enemy.tempAttack - 1);
    return;
  }

  for (let hit = 0; hit < move.hits; hit += 1) {
    if (state.hero.hp <= 0) {
      break;
    }

    const roll = randInt(move.damage[0], move.damage[1]);
    const baseDamage = computeEnemyBaseDamage(state.enemy, roll);
    const dealt = applyIncomingOnHero(baseDamage);

    if (dealt > 0) {
      log(`Враг наносит ${dealt} урона.`, "bad");
    } else {
      log("Враг не пробивает защиту.", "good");
    }

    if (dealt > 0 && state.enemy.flags.venomous && chance(rng, 0.35)) {
      addStatus(state.hero.statuses, "bleed", 1);
      log("Ядовитый эффект: Кровотечение 1.", "bad");
    }

    if (move.onHit && dealt > 0 && state.hero.hp > 0) {
      move.onHit({ hero: state.hero, enemy: state.enemy, rng });
    }
  }

  state.enemy.flags.firstAttackDone = true;
  state.enemy.tempAttack = Math.max(0, state.enemy.tempAttack - 1);
}

function collectStatusEntries(statuses) {
  return Object.keys(statuses)
    .filter((key) => statuses[key] > 0)
    .map((key) => ({ key, value: statuses[key], label: STATUS_LABELS[key] || key }));
}

function renderStatuses(container, statuses) {
  container.innerHTML = "";
  const entries = collectStatusEntries(statuses);

  if (entries.length === 0) {
    return;
  }

  entries.forEach((entry) => {
    const tag = document.createElement("span");
    tag.className = "status-tag";

    if (["bleed", "burn", "poison"].includes(entry.key)) {
      tag.classList.add("dot");
    }

    if (["inspire", "exposed"].includes(entry.key)) {
      tag.classList.add("buff");
    }

    tag.textContent = `${entry.label} ${entry.value}`;
    container.appendChild(tag);
  });
}

function renderApDots() {
  ui.apDots.innerHTML = "";
  const total = Math.max(state.baseAp + Math.max(0, state.mods.firstTurnAp) + state.mods.apPerTurn, state.ap, 3);

  for (let i = 0; i < total; i += 1) {
    const dot = document.createElement("span");
    dot.className = "ap-dot";

    if (i < state.ap) {
      dot.classList.add("on");
    }

    ui.apDots.appendChild(dot);
  }
}

function renderRelics() {
  ui.relicList.innerHTML = "";

  if (state.relics.length === 0) {
    const empty = document.createElement("div");
    empty.className = "relic-item";
    empty.innerHTML = "<p><b>Пока пусто.</b> Выбери перк после боя.</p>";
    ui.relicList.appendChild(empty);
    return;
  }

  state.relics.forEach((relic) => {
    const row = document.createElement("div");
    row.className = "relic-item";
    const tier = relic.tier === "S" ? "[S] " : "";
    row.innerHTML = `<p><b>${tier}${relic.name}</b><br>${relic.description}</p>`;
    ui.relicList.appendChild(row);
  });
}

function updateIntentUI() {
  const intent = state.battle.intent;

  if (!intent) {
    ui.intentName.textContent = "-";
    ui.intentDesc.textContent = "-";
    return;
  }

  ui.intentName.textContent = intent.name;
  ui.intentDesc.textContent = `${intent.preview}. ${intent.text}`;
}
function updateActionAvailability() {
  const frozen = state.busy || state.runEnded || !ui.screens.battle.classList.contains("active");

  ui.attackBtn.disabled = frozen || state.ap < 1;
  ui.guardBtn.disabled = frozen || state.ap < 1;
  ui.potionBtn.disabled = frozen || state.ap < 1 || state.potions <= 0;

  const specialCost = state.hero ? effectiveSpecialCost() : 2;
  ui.specialBtn.textContent = state.hero ? `${state.hero.specialName} (${specialCost} AP)` : "Способность";
  ui.specialBtn.disabled = frozen || state.ap < specialCost || state.specialCooldown > 0;

  ui.endTurnBtn.disabled = frozen;
}

function updateBattleUI() {
  if (!state.hero || !state.enemy) {
    return;
  }

  ui.runSeed.textContent = `Seed: ${state.seed}`;
  ui.encounterLabel.textContent = `Бой ${state.encounterIndex + 1} / ${state.encounters.length}`;
  ui.turnLabel.textContent = `Ход: ${state.turn}`;

  ui.heroName.textContent = state.hero.name;
  ui.heroSprite.src = state.hero.sprite;
  ui.heroHpText.textContent = `${state.hero.hp} / ${state.hero.maxHp} HP`;
  ui.heroBlockText.textContent = `Блок: ${state.hero.block}`;
  setBar(ui.heroHpBar, state.hero.hp, state.hero.maxHp);
  setBar(ui.heroBlockBar, state.hero.block, 40);

  const enemyPhaseSuffix = state.enemy.id === "dragon" && state.enemy.phase > 1 ? ` (Фаза ${state.enemy.phase})` : "";
  ui.enemyName.textContent = `${state.enemy.name}${enemyPhaseSuffix}`;
  ui.enemySprite.src = state.enemy.sprite;
  ui.enemyHpText.textContent = `${state.enemy.hp} / ${state.enemy.maxHp} HP`;
  ui.enemyBlockText.textContent = `Блок: ${state.enemy.block}`;
  setBar(ui.enemyHpBar, state.enemy.hp, state.enemy.maxHp);
  setBar(ui.enemyBlockBar, state.enemy.block, 40);

  if (state.enemy.affix) {
    ui.enemyAffix.textContent = `Аффикс: ${state.enemy.affix.name} (${state.enemy.affix.description})`;
  } else {
    ui.enemyAffix.textContent = "";
  }

  ui.potionCount.textContent = String(state.potions);
  ui.specialCd.textContent = String(state.specialCooldown);
  ui.comboCount.textContent = `x${Math.max(1, state.combo)}`;

  renderStatuses(ui.heroStatuses, state.hero.statuses);
  renderStatuses(ui.enemyStatuses, state.enemy.statuses);
  renderApDots();
  renderRelics();
  updateIntentUI();
  updateActionAvailability();
}

function tickTurnStatusesAfterPlayerTurn() {
  consumeStatus(state.hero.statuses, "vulnerable", 1);
  consumeStatus(state.hero.statuses, "weaken", 1);
}

function tickTurnStatusesAfterEnemyTurn() {
  consumeStatus(state.enemy.statuses, "weaken", 1);
  consumeStatus(state.enemy.statuses, "exposed", 1);
}

function beginPlayerTurn(isFirstTurn) {
  state.ap = state.baseAp + state.mods.apPerTurn;
  state.hero.block = 0;

  if (isFirstTurn && state.mods.firstTurnAp !== 0) {
    state.ap += state.mods.firstTurnAp;

    if (state.mods.firstTurnAp > 0) {
      log(`Перки дают +${state.mods.firstTurnAp} AP в первый ход боя.`, "good");
    } else {
      log(`Тяжелые перки уменьшают AP первого хода на ${Math.abs(state.mods.firstTurnAp)}.`, "bad");
    }
  }

  state.ap = Math.max(1, state.ap);

  if (state.specialCooldown > 0) {
    state.specialCooldown -= 1;
  }

  if (state.mods.selfTickDamage > 0) {
    state.hero.hp = Math.max(0, state.hero.hp - state.mods.selfTickDamage);
    log(`Сердце бури наносит ${state.mods.selfTickDamage} урона герою.`, "bad");
    pulseHit(ui.heroSprite);
    tryReviveIfPossible();
  }

  const dotDamage = applyHeroDots();

  if ((dotDamage > 0 || state.mods.selfTickDamage > 0) && state.hero.hp <= 0 && !tryReviveIfPossible()) {
    finishRun(false, "Герой пал от эффектов в начале хода.");
    return;
  }

  updateBattleUI();
}

function beginEncounter() {
  state.currentEvent = null;
  state.enemy = state.encounters[state.encounterIndex];
  state.turn = 1;
  state.combo = 1;
  state.specialCooldown = 0;
  state.busy = false;
  state.battle = {
    firstSpecialUsed: false,
    mirrorUsed: false,
    strikeCounter: 0,
    specialCastCounter: 0,
    intent: null
  };

  clearLog();
  log(`Начался бой ${state.encounterIndex + 1}: ${state.enemy.name}.`, "bad");

  if (state.enemy.elite && !state.enemy.boss) {
    log("Элитный бой: характеристики врага усилены.", "bad");
  }

  if (state.enemy.boss) {
    log("Финал кампании: бой с драконом.", "bad");
  }

  if (state.mods.curseStacks > 0) {
    const curseDamage = state.mods.curseStacks * 4;
    state.hero.hp = Math.max(0, state.hero.hp - curseDamage);
    log(`Проклятие забега наносит ${curseDamage} урона перед боем.`, "bad");
    tryReviveIfPossible();

    if (state.hero.hp <= 0) {
      finishRun(false, "Проклятие забега оказалось фатальным.");
      return;
    }
  }

  setNextIntent();
  showScreen("battle");
  beginPlayerTurn(true);
}

function obtainRelic(relic, sourceText = "Перк") {
  if (!relic || state.relicSet.has(relic.id)) {
    return false;
  }

  state.relicSet.add(relic.id);
  state.relics.push(relic);
  relic.apply(state);
  log(`${sourceText}: ${relic.name}.`, "good");
  return true;
}

function randomAvailableRareRelic() {
  const available = RARE_RELICS.filter((relic) => !state.relicSet.has(relic.id));
  return available.length > 0 ? pick(available) : null;
}

function buildRewardChoices(restHeal, note = "") {
  state.currentEvent = null;
  const commonAvailable = RELICS.filter((relic) => !state.relicSet.has(relic.id));
  const rareAvailable = RARE_RELICS.filter((relic) => !state.relicSet.has(relic.id));
  const chosen = [];

  if (rareAvailable.length > 0 && chance(rng, state.difficulty.rareRelicChance)) {
    chosen.push(pick(rareAvailable));
  }

  const commonPart = sampleUnique(commonAvailable, Math.min(3 - chosen.length, commonAvailable.length));
  chosen.push(...commonPart);

  if (chosen.length < 3) {
    const rareRemainder = rareAvailable.filter((relic) => !chosen.some((entry) => entry.id === relic.id));
    chosen.push(...sampleUnique(rareRemainder, 3 - chosen.length));
  }

  state.rewardChoices = chosen;

  const noteText = note ? ` ${note}` : "";
  ui.rewardText.textContent = `Короткий привал восстановил ${restHeal} HP. Выбери 1 перк.${noteText}`;
  ui.rewardGrid.innerHTML = "";

  if (state.rewardChoices.length === 0) {
    ui.rewardText.textContent = `Короткий привал восстановил ${restHeal} HP. Все перки уже собраны.${noteText}`;
  }

  state.rewardChoices.forEach((relic) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = relic.tier === "S" ? "reward-card rare" : "reward-card";
    const tierTag = relic.tier === "S" ? '<span class="tier">S-tier</span>' : "";
    card.innerHTML = `${tierTag}<h3>${relic.name}</h3><p>${relic.description}</p>`;
    card.addEventListener("click", () => {
      chooseReward(relic.id);
    });
    ui.rewardGrid.appendChild(card);
  });

  showScreen("reward");
}

function showIntermissionEvent(restHeal) {
  const eventId = pick(["merchant", "altar", "cursed"]);
  state.currentEvent = eventId;
  ui.eventGrid.innerHTML = "";

  let title = "Случайная встреча";
  let text = "";
  const choices = [];

  if (eventId === "merchant") {
    title = "Странствующий торговец";
    text = "Торговец меняет силу на здоровье. Можно рискнуть ради темпа.";
    choices.push({
      name: "Купить зелье",
      description: "Платишь 14 HP и получаешь +1 зелье.",
      apply() {
        if (state.hero.hp <= 15) {
          return "Не хватило здоровья для сделки.";
        }
        state.hero.hp -= 14;
        state.potions += 1;
        return "Сделка проведена: -14 HP, +1 зелье.";
      }
    });
    choices.push({
      name: "Заточить оружие",
      description: "Платишь 8 HP и получаешь +2 к атаке навсегда.",
      apply() {
        if (state.hero.hp <= 9) {
          return "Слишком рискованно: здоровья мало.";
        }
        state.hero.hp -= 8;
        state.mods.attackFlat += 2;
        return "Клинок заточен: -8 HP, +2 атака.";
      }
    });
    choices.push({
      name: "Уйти",
      description: "Ничего не менять.",
      apply() {
        return "Ты сохранил текущий билд без риска.";
      }
    });
  }

  if (eventId === "altar") {
    title = "Алтарь пепла";
    text = "Алтарь дает силу только за реальную плату.";
    choices.push({
      name: "Кровавая клятва",
      description: "-18 HP, но +2 атака и +8% крит-шанс.",
      apply() {
        if (state.hero.hp <= 19) {
          return "Клятва отвергнута: мало здоровья.";
        }
        state.hero.hp -= 18;
        state.mods.attackFlat += 2;
        state.mods.critChance += 0.08;
        return "Клятва принята: урон заметно вырос.";
      }
    });
    choices.push({
      name: "Курение кадила",
      description: "Потратить 1 зелье и получить редкий артефакт.",
      apply() {
        if (state.potions <= 0) {
          return "Нет зелий для ритуала.";
        }
        state.potions -= 1;
        const rare = randomAvailableRareRelic();
        if (rare) {
          obtainRelic(rare, "Алтарь дарует");
          return `Алтарь принял подношение и выдал ${rare.name}.`;
        }
        state.mods.postBattleHeal += 8;
        return "Алтарь усилил восстановление после боев (+8).";
      }
    });
    choices.push({
      name: "Оставить алтарь",
      description: "Без подношений и риска.",
      apply() {
        return "Ты игнорируешь силу алтаря.";
      }
    });
  }

  if (eventId === "cursed") {
    title = "Проклятая шкатулка";
    text = "Сильная награда, но каждый дар имеет цену.";
    choices.push({
      name: "Взять реликвию",
      description: "Получить S-tier перк, но добавить 1 проклятие забега.",
      apply() {
        const rare = randomAvailableRareRelic();
        if (rare) {
          obtainRelic(rare, "Проклятый дар");
        }
        state.mods.curseStacks += 1;
        return "Ты принял проклятие: в каждом бою будет дополнительный урон по герою.";
      }
    });
    choices.push({
      name: "Разбить печать",
      description: "+95 очков, но получить Ожог 1.",
      apply() {
        state.score += 95;
        addStatus(state.hero.statuses, "burn", 1);
        return "Печать разбита: получены очки, но тебя задел огонь.";
      }
    });
    choices.push({
      name: "Не трогать",
      description: "Отказаться от риска.",
      apply() {
        return "Ты оставляешь шкатулку нетронутой.";
      }
    });
  }

  ui.eventTitle.textContent = title;
  ui.eventText.textContent = text;

  choices.forEach((choice) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "event-card";
    card.innerHTML = `<h3>${choice.name}</h3><p>${choice.description}</p>`;
    card.addEventListener("click", () => {
      const note = choice.apply();
      buildRewardChoices(restHeal, note);
    });
    ui.eventGrid.appendChild(card);
  });

  showScreen("event");
}

function finishEncounter() {
  const encounterScore = Math.round((110 + (state.encounterIndex + 1) * 28 + state.hero.hp * 0.3) * state.difficulty.scoreMult * (1 + state.mods.scoreBonus));
  state.score += encounterScore;
  log(`Победа в бою. +${encounterScore} очков.`, "good");

  if (state.encounterIndex >= state.encounters.length - 1) {
    finishRun(true, "Все враги повержены.");
    return;
  }

  const restHeal = Math.round(state.hero.maxHp * 0.08) + state.mods.postBattleHeal;
  state.hero.hp = Math.min(state.hero.maxHp, state.hero.hp + restHeal);
  state.encounterIndex += 1;

  if (chance(rng, state.difficulty.eventChance)) {
    showIntermissionEvent(restHeal);
  } else {
    buildRewardChoices(restHeal);
  }
}

function chooseReward(relicId) {
  const relic = state.rewardChoices.find((entry) => entry.id === relicId);

  if (!relic) {
    return;
  }

  obtainRelic(relic, "Получен перк");
  beginEncounter();
}

function skipReward() {
  state.hero.hp = Math.min(state.hero.maxHp, state.hero.hp + 12);
  log("Перк пропущен: герой дополнительно восстановил 12 HP.", "good");
  beginEncounter();
}

function endPlayerTurn() {
  if (state.busy || state.runEnded) {
    return;
  }

  state.busy = true;
  state.combo = 1;
  tickTurnStatusesAfterPlayerTurn();

  state.enemy.block = 0;
  const dotDamage = applyEnemyDots();

  if (dotDamage > 0 && state.enemy.hp <= 0) {
    state.busy = false;
    finishEncounter();
    updateBattleUI();
    return;
  }

  if (state.enemy.flags.regen > 0) {
    const heal = Math.min(state.enemy.flags.regen, state.enemy.maxHp - state.enemy.hp);

    if (heal > 0) {
      state.enemy.hp += heal;
      log(`Регенерация врага: +${heal} HP.`, "bad");
    }
  }

  performEnemyIntent();

  if (state.hero.hp <= 0 && !tryReviveIfPossible()) {
    finishRun(false, "Герой не пережил ход противника.");
    state.busy = false;
    updateBattleUI();
    return;
  }

  tickTurnStatusesAfterEnemyTurn();
  setNextIntent();
  state.turn += 1;
  state.busy = false;
  beginPlayerTurn(false);
}

function executePlayerAction(action) {
  if (state.busy || state.runEnded || !state.hero || !state.enemy) {
    return;
  }

  if (action === "end") {
    endPlayerTurn();
    return;
  }

  state.busy = true;

  if (action === "strike") {
    heroStrike();
  }

  if (action === "special") {
    heroSpecial();
  }

  if (action === "guard") {
    heroGuard();
  }

  if (action === "potion") {
    heroPotion();
  }

  if (state.enemy.hp <= 0) {
    finishEncounter();
    state.busy = false;
    updateBattleUI();
    return;
  }

  state.busy = false;
  updateBattleUI();

  if (state.ap <= 0) {
    endPlayerTurn();
  }
}

function finishRun(victory, text) {
  state.runEnded = true;
  state.busy = true;

  if (victory) {
    const hpBonus = Math.round(state.hero.hp * 1.2);
    const relicBonus = state.relics.length * 42;
    const finalBonus = Math.round((hpBonus + relicBonus) * state.difficulty.scoreMult * (1 + state.mods.scoreBonus));
    state.score += finalBonus;
    ui.resultTitle.textContent = "Победа";
    ui.resultText.textContent = `${text} Бонус за выживание и билд: +${finalBonus}.`;
  } else {
    ui.resultTitle.textContent = "Поражение";
    ui.resultText.textContent = text;
  }

  state.bestScore = Math.max(state.bestScore, state.score);
  localStorage.setItem("sprite_legends_reforged_best", String(state.bestScore));

  ui.resultScore.textContent = `Счет: ${state.score}`;
  ui.resultBest.textContent = `Лучший счет: ${state.bestScore}`;
  ui.metaBest.textContent = `Лучший результат: ${state.bestScore}`;

  showScreen("result");
}
function resetRunState() {
  state.heroTemplate = null;
  state.hero = null;
  state.encounters = [];
  state.encounterIndex = 0;
  state.enemy = null;
  state.turn = 1;
  state.ap = 0;
  state.specialCooldown = 0;
  state.combo = 1;
  state.score = 0;
  state.relics = [];
  state.relicSet = new Set();
  state.rewardChoices = [];
  state.currentEvent = null;
  state.intermissionNote = "";
  state.busy = false;
  state.runEnded = false;
  state.mods = {
    attackFlat: 0,
    firstTurnAp: 0,
    lifesteal: 0,
    firstHitReduction: 0,
    potionBonus: 0,
    specialCdMod: 0,
    thorns: 0,
    executeBonus: 0,
    guardBonus: 0,
    critChance: 0,
    postBattleHeal: 0,
    apPerTurn: 0,
    selfTickDamage: 0,
    specialCostMod: 0,
    specialPower: 0,
    selfBurnOnSpecial: 0,
    strikeBonus: 0,
    damageTakenMult: 0,
    scoreBonus: 0,
    reviveCharges: 0,
    curseStacks: 0
  };
}

function startRun(heroId) {
  const template = HEROES.find((hero) => hero.id === heroId);

  if (!template) {
    return;
  }

  resetRunState();
  initSeed();
  state.heroTemplate = template;
  state.hero = cloneHero(template);
  state.potions = state.difficulty.potions;
  state.encounters = generateEncounters();

  beginEncounter();
}

function renderHeroCards() {
  ui.heroGrid.innerHTML = "";

  HEROES.forEach((hero) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "hero-card";
    card.innerHTML = `
      <img src="${hero.sprite}" alt="${hero.name}">
      <h3>${hero.name}</h3>
      <p>HP: ${hero.maxHp} | Удар: ${hero.attackMin}-${hero.attackMax}</p>
      <p><strong>${hero.specialName}</strong>: ${hero.specialDescription}</p>
      <p>Пассив: ${hero.passiveDescription}</p>
    `;

    card.addEventListener("click", () => {
      startRun(hero.id);
    });

    ui.heroGrid.appendChild(card);
  });
}

function setDifficulty(key) {
  if (!DIFFICULTIES[key]) {
    return;
  }

  state.difficultyKey = key;
  state.difficulty = DIFFICULTIES[key];

  const buttons = ui.difficultyGroup.querySelectorAll(".diff-btn");
  buttons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.difficulty === key);
  });

  if (ui.difficultyDesc) {
    ui.difficultyDesc.textContent = state.difficulty.effectText;
  }
}

function bindEvents() {
  ui.difficultyGroup.querySelectorAll(".diff-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      setDifficulty(btn.dataset.difficulty);
    });
  });

  ui.rerollSeedBtn.addEventListener("click", () => {
    ui.seedInput.value = makeSeed();
  });

  ui.startBtn.addEventListener("click", () => {
    renderHeroCards();
    showScreen("selection");
  });

  ui.backBtn.addEventListener("click", () => {
    showScreen("start");
  });

  ui.attackBtn.addEventListener("click", () => executePlayerAction("strike"));
  ui.specialBtn.addEventListener("click", () => executePlayerAction("special"));
  ui.guardBtn.addEventListener("click", () => executePlayerAction("guard"));
  ui.potionBtn.addEventListener("click", () => executePlayerAction("potion"));
  ui.endTurnBtn.addEventListener("click", () => executePlayerAction("end"));

  ui.retreatBtn.addEventListener("click", () => {
    finishRun(false, "Герой добровольно покинул арену.");
  });

  ui.skipRewardBtn.addEventListener("click", () => {
    skipReward();
  });

  ui.playAgainBtn.addEventListener("click", () => {
    ui.seedInput.value = makeSeed();
    showScreen("start");
  });
}

function init() {
  const savedBest = Number(localStorage.getItem("sprite_legends_reforged_best") || "0");
  state.bestScore = Number.isFinite(savedBest) ? Math.max(0, Math.floor(savedBest)) : 0;

  ui.metaBest.textContent = `Лучший результат: ${state.bestScore}`;
  ui.seedInput.value = makeSeed();

  bindEvents();
  renderHeroCards();
  setDifficulty("normal");
  showScreen("start");
}

init();






















