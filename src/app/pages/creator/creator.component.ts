import { Component, OnInit, OnDestroy } from '@angular/core';
import {CommonModule, NgForOf, NgIf} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import {CharacterSheet, CharacterTheme} from "../../models/Character";
import {CharacterService} from "../../services/Character.service";
import {PdfService} from "../../services/Pdf.service";
import {DiceRollerComponent} from "../dice-roller/dice-roller.component";

@Component({
  selector: 'app-creator',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    FormsModule,
    DiceRollerComponent
  ],
  templateUrl: './creator.component.html',
  styleUrl: './creator.component.scss'
})
export class CreatorComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  character!: CharacterSheet;
  currentTheme!: CharacterTheme;
  predefinedThemes: CharacterTheme[] = [];
  autoFillEnabled = true;
  sidebarOpen = true;
  customThemeMode = false;

  // Dice rolling animation
  isRollingDice = false;
  showDiceResult = false;
  diceResults: number[] = [];
  droppedDiceIndex = -1;
  diceTotal = 0;
  currentRollingAbility: string | null = null;

  // Custom theme colors
  customColors = {
    primary: '#6B2C6B',
    secondary: '#8B4789',
    accent: '#A855A8',
    text: '#FFFFFF',
    background: '#2D1B2E',
    border: '#6B2C6B'
  };

  constructor(
    private characterService: CharacterService,
    private pdfService: PdfService
  ) {}

  ngOnInit(): void {
    this.characterService.characterSheet$
      .pipe(takeUntil(this.destroy$))
      .subscribe(char => {
        this.character = { ...char };
        this.updateCalculatedFields();
      });

    this.characterService.currentTheme$
      .pipe(takeUntil(this.destroy$))
      .subscribe(theme => {
        this.currentTheme = theme;
        this.applyTheme(theme);
      });

    this.characterService.autoFillEnabled$
      .pipe(takeUntil(this.destroy$))
      .subscribe(enabled => this.autoFillEnabled = enabled);

    this.predefinedThemes = this.characterService.getPredefinedThemes();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleAutoFill(): void {
    this.characterService.toggleAutoFill();
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  selectTheme(theme: CharacterTheme): void {
    this.customThemeMode = false;
    this.characterService.setTheme(theme);
  }

  enableCustomTheme(): void {
    this.customThemeMode = true;
    const customTheme: CharacterTheme = {
      id: 'custom',
      name: 'Custom',
      primaryColor: this.customColors.primary,
      secondaryColor: this.customColors.secondary,
      accentColor: this.customColors.accent,
      textColor: this.customColors.text,
      backgroundColor: this.customColors.background,
      borderColor: this.customColors.border
    };
    this.characterService.setTheme(customTheme);
  }

  updateCustomColor(colorType: keyof typeof this.customColors, value: string): void {
    this.customColors[colorType] = value;
    if (this.customThemeMode) {
      this.enableCustomTheme();
    }
  }

  applyTheme(theme: CharacterTheme): void {
    document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', theme.secondaryColor);
    document.documentElement.style.setProperty('--accent-color', theme.accentColor);
    document.documentElement.style.setProperty('--text-color', theme.textColor);
    document.documentElement.style.setProperty('--background-color', theme.backgroundColor);
    document.documentElement.style.setProperty('--border-color', theme.borderColor);
  }

  rollAbilityScore(abilityName: string): void {
    this.currentRollingAbility = abilityName;
    this.isRollingDice = true;
    this.showDiceResult = false;

    // Simulate rolling animation
    setTimeout(() => {
      const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
      this.diceResults = [...rolls];

      // Find lowest die
      const sortedRolls = [...rolls].sort((a, b) => a - b);
      const lowestValue = sortedRolls[0];
      this.droppedDiceIndex = rolls.indexOf(lowestValue);

      // Calculate total
      const total = rolls.reduce((sum, val, idx) =>
        idx === this.droppedDiceIndex ? sum : sum + val, 0);
      this.diceTotal = total;

      this.isRollingDice = false;
      this.showDiceResult = true;

      if (this.autoFillEnabled) {
        this.character.abilities[abilityName].score = total;
        this.character.abilities[abilityName].modifier = this.calculateModifier(total);
        this.updateCalculatedFields();
        this.saveCharacter();
      }

      // Hide result after 3 seconds
      setTimeout(() => {
        this.showDiceResult = false;
        this.currentRollingAbility = null;
      }, 3000);
    }, 1000);
  }

  calculateModifier(score: number): number {
    return Math.floor((score - 10) / 2);
  }

  updateAbilityScore(abilityName: string, score: number): void {
    this.character.abilities[abilityName].score = score;
    this.character.abilities[abilityName].modifier = this.calculateModifier(score);
    this.updateCalculatedFields();
    this.saveCharacter();
  }

  updateCalculatedFields(): void {
    // Update initiative
    this.character.initiative = this.character.abilities.dexterity.modifier;

    // Update saving throws
    Object.keys(this.character.savingThrows).forEach(key => {
      const abilityKey = key as keyof typeof this.character.abilities;
      const save = this.character.savingThrows[abilityKey];
      const abilityMod = this.character.abilities[abilityKey].modifier;
      save.value = abilityMod + (save.proficient ? this.character.proficiencyBonus : 0);
    });

    // Update skills
    this.character.skills.forEach(skill => {
      const abilityKey = skill.ability as keyof typeof this.character.abilities;
      const abilityMod = this.character.abilities[abilityKey].modifier;
      skill.value = abilityMod + (skill.proficient ? this.character.proficiencyBonus : 0);
    });

    // Update passive perception
    const perceptionSkill = this.character.skills.find(s => s.name === 'Perception');
    this.character.passivePerception = 10 + (perceptionSkill?.value || 0);
  }

  toggleSkillProficiency(skillName: string): void {
    const skill = this.character.skills.find(s => s.name === skillName);
    if (skill) {
      skill.proficient = !skill.proficient;
      this.updateCalculatedFields();
      this.saveCharacter();
    }
  }

  toggleSavingThrowProficiency(ability: string): void {
    this.character.savingThrows[ability].proficient = !this.character.savingThrows[ability].proficient;
    this.updateCalculatedFields();
    this.saveCharacter();
  }

  saveCharacter(): void {
    this.characterService.updateCharacter(this.character);
  }

  exportToPDF(): void {
    this.pdfService.generateCharacterSheetPDF(this.character, this.currentTheme);
  }

  getAbilityShorthand(ability: string): string {
    const map: { [key: string]: string } = {
      'strength': 'Str',
      'dexterity': 'Dex',
      'constitution': 'Con',
      'intelligence': 'Int',
      'wisdom': 'Wis',
      'charisma': 'Cha'
    };
    return map[ability] || ability;
  }
}
