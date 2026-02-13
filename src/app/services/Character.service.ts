import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CharacterSheet, CharacterTheme } from '../models/Character';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private autoFillEnabled = new BehaviorSubject<boolean>(true);
  public autoFillEnabled$ = this.autoFillEnabled.asObservable();

  private currentTheme = new BehaviorSubject<CharacterTheme>(this.getDefaultTheme());
  public currentTheme$ = this.currentTheme.asObservable();

  private characterSheet = new BehaviorSubject<CharacterSheet>(this.getEmptyCharacter());
  public characterSheet$ = this.characterSheet.asObservable();

  private predefinedThemes: CharacterTheme[] = [
    {
      id: 'classic',
      name: 'Classic D&D',
      primaryColor: '#8B4513',
      secondaryColor: '#D2691E',
      accentColor: '#CD853F',
      textColor: '#000000',
      backgroundColor: '#F5DEB3',
      borderColor: '#8B4513'
    },
    {
      id: 'goblin-grape',
      name: 'Goblin Grape',
      primaryColor: '#6B2C6B',
      secondaryColor: '#8B4789',
      accentColor: '#A855A8',
      textColor: '#FFFFFF',
      backgroundColor: '#2D1B2E',
      borderColor: '#6B2C6B'
    },
    {
      id: 'forest',
      name: 'Forest',
      primaryColor: '#2D5016',
      secondaryColor: '#4A7C2C',
      accentColor: '#6B9F4A',
      textColor: '#FFFFFF',
      backgroundColor: '#1A2F0F',
      borderColor: '#2D5016'
    },
    {
      id: 'ocean',
      name: 'Ocean',
      primaryColor: '#1E3A5F',
      secondaryColor: '#2E5A8F',
      accentColor: '#4A7ABF',
      textColor: '#FFFFFF',
      backgroundColor: '#0F1F2F',
      borderColor: '#1E3A5F'
    },
    {
      id: 'fire',
      name: 'Fire',
      primaryColor: '#8B0000',
      secondaryColor: '#B22222',
      accentColor: '#DC143C',
      textColor: '#FFFFFF',
      backgroundColor: '#2B0000',
      borderColor: '#8B0000'
    }
  ];

  constructor() { }

  toggleAutoFill(): void {
    this.autoFillEnabled.next(!this.autoFillEnabled.value);
  }

  setAutoFill(enabled: boolean): void {
    this.autoFillEnabled.next(enabled);
  }

  getAutoFillStatus(): boolean {
    return this.autoFillEnabled.value;
  }

  setTheme(theme: CharacterTheme): void {
    this.currentTheme.next(theme);
  }

  getPredefinedThemes(): CharacterTheme[] {
    return this.predefinedThemes;
  }

  getCurrentTheme(): CharacterTheme {
    return this.currentTheme.value;
  }

  updateCharacter(character: CharacterSheet): void {
    this.characterSheet.next(character);
  }

  getCharacter(): CharacterSheet {
    return this.characterSheet.value;
  }

  rollAbilityScore(): number {
    // Roll 4d6, drop lowest
    const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
    rolls.sort((a, b) => a - b);
    return rolls.slice(1).reduce((sum, val) => sum + val, 0);
  }

  calculateModifier(score: number): number {
    return Math.floor((score - 10) / 2);
  }

  private getEmptyCharacter(): CharacterSheet {
    return {
      characterName: '',
      className: '',
      level: 1,
      background: '',
      playerName: '',
      race: '',
      alignment: '',
      experiencePoints: 0,
      proficiencyBonus: 2,
      armorClass: 10,
      initiative: 0,
      speed: 30,
      hitPointMaximum: 10,
      currentHitPoints: 10,
      temporaryHitPoints: 0,
      hitDice: '1d8',
      hitDiceTotal: 1,
      deathSaves: { successes: 0, failures: 0 },
      abilities: {
        strength: { score: 10, modifier: 0 },
        dexterity: { score: 10, modifier: 0 },
        constitution: { score: 10, modifier: 0 },
        intelligence: { score: 10, modifier: 0 },
        wisdom: { score: 10, modifier: 0 },
        charisma: { score: 10, modifier: 0 }
      },
      savingThrows: {
        strength: { proficient: false, value: 0 },
        dexterity: { proficient: false, value: 0 },
        constitution: { proficient: false, value: 0 },
        intelligence: { proficient: false, value: 0 },
        wisdom: { proficient: false, value: 0 },
        charisma: { proficient: false, value: 0 }
      },
      skills: this.getDefaultSkills(),
      passivePerception: 10,
      inspiration: false,
      equipment: '',
      attacksSpellcasting: [],
      featuresTraits: '',
      otherProficienciesLanguages: '',
      cp: 0,
      sp: 0,
      ep: 0,
      gp: 0,
      pp: 0,
      personalityTraits: '',
      ideals: '',
      bonds: '',
      flaws: '',
      age: '',
      height: '',
      weight: '',
      eyes: '',
      skin: '',
      hair: '',
      characterAppearance: '',
      alliesOrganizations: '',
      characterBackstory: '',
      additionalFeaturesTraits: '',
      treasure: '',
      spellcastingClass: '',
      spellcastingAbility: '',
      spellSaveDC: 10,
      spellAttackBonus: 0,
      cantrips: [],
      spells: []
    };
  }

  private getDefaultSkills() {
    return [
      { name: 'Acrobatics', ability: 'dexterity', proficient: false, value: 0 },
      { name: 'Animal Handling', ability: 'wisdom', proficient: false, value: 0 },
      { name: 'Arcana', ability: 'intelligence', proficient: false, value: 0 },
      { name: 'Athletics', ability: 'strength', proficient: false, value: 0 },
      { name: 'Deception', ability: 'charisma', proficient: false, value: 0 },
      { name: 'History', ability: 'intelligence', proficient: false, value: 0 },
      { name: 'Insight', ability: 'wisdom', proficient: false, value: 0 },
      { name: 'Intimidation', ability: 'charisma', proficient: false, value: 0 },
      { name: 'Investigation', ability: 'intelligence', proficient: false, value: 0 },
      { name: 'Medicine', ability: 'wisdom', proficient: false, value: 0 },
      { name: 'Nature', ability: 'intelligence', proficient: false, value: 0 },
      { name: 'Perception', ability: 'wisdom', proficient: false, value: 0 },
      { name: 'Performance', ability: 'charisma', proficient: false, value: 0 },
      { name: 'Persuasion', ability: 'charisma', proficient: false, value: 0 },
      { name: 'Religion', ability: 'intelligence', proficient: false, value: 0 },
      { name: 'Sleight of Hand', ability: 'dexterity', proficient: false, value: 0 },
      { name: 'Stealth', ability: 'dexterity', proficient: false, value: 0 },
      { name: 'Survival', ability: 'wisdom', proficient: false, value: 0 }
    ];
  }

  private getDefaultTheme(): CharacterTheme {
    return this.predefinedThemes[1]; // Goblin Grape by default
  }
}
