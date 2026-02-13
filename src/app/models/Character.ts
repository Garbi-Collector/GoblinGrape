export interface Ability {
  score: number;
  modifier: number;
}

export interface Skill {
  name: string;
  ability: string;
  proficient: boolean;
  value: number;
}

export interface Attack {
  name: string;
  atkBonus: string;
  damageType: string;
}

export interface DeathSaves {
  successes: number;
  failures: number;
}

export interface CharacterSheet {
  // Header info
  characterName: string;
  className: string;
  level: number;
  background: string;
  playerName: string;
  race: string;
  alignment: string;
  experiencePoints: number;

  // Core stats
  proficiencyBonus: number;
  armorClass: number;
  initiative: number;
  speed: number;
  hitPointMaximum: number;
  currentHitPoints: number;
  temporaryHitPoints: number;

  // Hit dice
  hitDice: string;
  hitDiceTotal: number;

  // Death saves
  deathSaves: DeathSaves;

  // Abilities
  abilities: {
    strength: Ability;
    dexterity: Ability;
    constitution: Ability;
    intelligence: Ability;
    wisdom: Ability;
    charisma: Ability;
  };

  // Saving throws
  savingThrows: {
    strength: { proficient: boolean; value: number };
    dexterity: { proficient: boolean; value: number };
    constitution: { proficient: boolean; value: number };
    intelligence: { proficient: boolean; value: number };
    wisdom: { proficient: boolean; value: number };
    charisma: { proficient: boolean; value: number };
  };

  // Skills
  skills: Skill[];

  // Other stats
  passivePerception: number;
  inspiration: boolean;

  // Equipment and features
  equipment: string;
  attacksSpellcasting: Attack[];
  featuresTraits: string;
  otherProficienciesLanguages: string;

  // Currency
  cp: number;
  sp: number;
  ep: number;
  gp: number;
  pp: number;

  // Personality
  personalityTraits: string;
  ideals: string;
  bonds: string;
  flaws: string;

  // Page 2
  age: string;
  height: string;
  weight: string;
  eyes: string;
  skin: string;
  hair: string;
  characterAppearance: string;
  alliesOrganizations: string;
  characterBackstory: string;
  additionalFeaturesTraits: string;
  treasure: string;

  // Spellcasting
  spellcastingClass: string;
  spellcastingAbility: string;
  spellSaveDC: number;
  spellAttackBonus: number;
  cantrips: string[];
  spells: {
    level: number;
    slotsTotal: number;
    slotsExpended: number;
    spells: string[];
  }[];
}

export interface CharacterTheme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  backgroundColor: string;
  borderColor: string;
}
