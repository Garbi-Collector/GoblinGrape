import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { CharacterSheet, CharacterTheme } from '../models/Character';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  generateCharacterSheetPDF(character: CharacterSheet, theme: CharacterTheme): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter'
    });

    // Set colors based on theme
    const primaryRGB = this.hexToRGB(theme.primaryColor);
    const secondaryRGB = this.hexToRGB(theme.secondaryColor);
    const textRGB = this.hexToRGB(theme.textColor);

    // Page 1 - Character Sheet
    this.drawPage1(doc, character, theme, primaryRGB, secondaryRGB, textRGB);

    // Page 2 - Character Details
    doc.addPage();
    this.drawPage2(doc, character, theme, primaryRGB, secondaryRGB, textRGB);

    // Save PDF
    doc.save(`${character.characterName || 'character'}-sheet.pdf`);
  }

  private drawPage1(doc: jsPDF, char: CharacterSheet, theme: CharacterTheme, primary: number[], secondary: number[], text: number[]): void {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Header Section
    doc.setFillColor(primary[0], primary[1], primary[2]);
    doc.rect(10, 10, pageWidth - 20, 20, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('D&D CHARACTER SHEET', pageWidth / 2, 18, { align: 'center' });

    doc.setTextColor(text[0], text[1], text[2]);
    doc.setFontSize(10);

    // Character Info
    let y = 35;
    doc.text(`Character Name: ${char.characterName}`, 15, y);
    doc.text(`Class: ${char.className} ${char.level}`, 100, y);
    y += 7;
    doc.text(`Race: ${char.race}`, 15, y);
    doc.text(`Background: ${char.background}`, 100, y);
    y += 7;
    doc.text(`Player: ${char.playerName}`, 15, y);
    doc.text(`Alignment: ${char.alignment}`, 100, y);
    y += 7;
    doc.text(`XP: ${char.experiencePoints}`, 15, y);

    y += 10;

    // Core Stats Box
    doc.setFillColor(secondary[0], secondary[1], secondary[2]);
    doc.rect(10, y, 60, 35, 'F');
    doc.setDrawColor(primary[0], primary[1], primary[2]);
    doc.setLineWidth(0.5);
    doc.rect(10, y, 60, 35, 'D');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text(`AC: ${char.armorClass}`, 15, y + 7);
    doc.text(`Initiative: ${char.initiative >= 0 ? '+' : ''}${char.initiative}`, 15, y + 14);
    doc.text(`Speed: ${char.speed}`, 15, y + 21);
    doc.text(`Prof Bonus: +${char.proficiencyBonus}`, 15, y + 28);

    // HP Box
    doc.rect(75, y, 60, 35, 'F');
    doc.rect(75, y, 60, 35, 'D');
    doc.text(`HP Max: ${char.hitPointMaximum}`, 80, y + 7);
    doc.text(`Current HP: ${char.currentHitPoints}`, 80, y + 14);
    doc.text(`Temp HP: ${char.temporaryHitPoints}`, 80, y + 21);
    doc.text(`Hit Dice: ${char.hitDice}`, 80, y + 28);

    y += 40;

    // Abilities
    doc.setTextColor(text[0], text[1], text[2]);
    doc.setFontSize(12);
    doc.text('ABILITIES', 15, y);
    y += 7;

    const abilities = [
      { name: 'STR', data: char.abilities.strength },
      { name: 'DEX', data: char.abilities.dexterity },
      { name: 'CON', data: char.abilities.constitution },
      { name: 'INT', data: char.abilities.intelligence },
      { name: 'WIS', data: char.abilities.wisdom },
      { name: 'CHA', data: char.abilities.charisma }
    ];

    doc.setFontSize(9);
    let x = 15;
    abilities.forEach(ability => {
      doc.setFillColor(secondary[0], secondary[1], secondary[2]);
      doc.rect(x, y, 25, 20, 'F');
      doc.setDrawColor(primary[0], primary[1], primary[2]);
      doc.rect(x, y, 25, 20, 'D');

      doc.setTextColor(255, 255, 255);
      doc.text(ability.name, x + 12.5, y + 5, { align: 'center' });
      doc.text(`${ability.data.score}`, x + 12.5, y + 11, { align: 'center' });
      doc.text(`(${ability.data.modifier >= 0 ? '+' : ''}${ability.data.modifier})`, x + 12.5, y + 17, { align: 'center' });

      x += 28;
    });

    y += 25;

    // Skills
    doc.setTextColor(text[0], text[1], text[2]);
    doc.setFontSize(12);
    doc.text('SKILLS', 15, y);
    y += 7;

    doc.setFontSize(8);
    const skillsPerColumn = 9;
    let skillX = 15;

    char.skills.forEach((skill, index) => {
      if (index === skillsPerColumn) {
        skillX = 100;
        y = y - (skillsPerColumn * 6);
      }

      doc.text(`${skill.proficient ? '●' : '○'} ${skill.name}: ${skill.value >= 0 ? '+' : ''}${skill.value}`, skillX, y);
      y += 6;
    });

    y = Math.max(y, 195);

    // Equipment & Features
    doc.setFontSize(10);
    doc.text('EQUIPMENT', 15, y);
    y += 5;
    doc.setFontSize(8);
    const equipmentLines = this.wrapText(doc, char.equipment || 'None', 170);
    equipmentLines.slice(0, 3).forEach(line => {
      doc.text(line, 15, y);
      y += 5;
    });
  }

  private drawPage2(doc: jsPDF, char: CharacterSheet, theme: CharacterTheme, primary: number[], secondary: number[], text: number[]): void {
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(primary[0], primary[1], primary[2]);
    doc.rect(10, 10, pageWidth - 20, 20, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('CHARACTER DETAILS', pageWidth / 2, 18, { align: 'center' });

    doc.setTextColor(text[0], text[1], text[2]);
    doc.setFontSize(10);

    let y = 35;

    // Physical Description
    doc.text(`Age: ${char.age}  |  Height: ${char.height}  |  Weight: ${char.weight}`, 15, y);
    y += 7;
    doc.text(`Eyes: ${char.eyes}  |  Skin: ${char.skin}  |  Hair: ${char.hair}`, 15, y);
    y += 12;

    // Appearance
    doc.setFontSize(12);
    doc.text('APPEARANCE', 15, y);
    y += 7;
    doc.setFontSize(9);
    const appearanceLines = this.wrapText(doc, char.characterAppearance || 'Not described', 170);
    appearanceLines.slice(0, 5).forEach(line => {
      doc.text(line, 15, y);
      y += 5;
    });

    y += 10;

    // Personality
    doc.setFontSize(12);
    doc.text('PERSONALITY TRAITS', 15, y);
    y += 7;
    doc.setFontSize(9);
    const personalityLines = this.wrapText(doc, char.personalityTraits || 'Not defined', 170);
    personalityLines.slice(0, 3).forEach(line => {
      doc.text(line, 15, y);
      y += 5;
    });

    y += 8;

    doc.setFontSize(12);
    doc.text('IDEALS', 15, y);
    y += 7;
    doc.setFontSize(9);
    const idealsLines = this.wrapText(doc, char.ideals || 'Not defined', 170);
    idealsLines.slice(0, 3).forEach(line => {
      doc.text(line, 15, y);
      y += 5;
    });

    y += 8;

    doc.setFontSize(12);
    doc.text('BONDS', 15, y);
    y += 7;
    doc.setFontSize(9);
    const bondsLines = this.wrapText(doc, char.bonds || 'Not defined', 170);
    bondsLines.slice(0, 3).forEach(line => {
      doc.text(line, 15, y);
      y += 5;
    });

    y += 8;

    doc.setFontSize(12);
    doc.text('FLAWS', 15, y);
    y += 7;
    doc.setFontSize(9);
    const flawsLines = this.wrapText(doc, char.flaws || 'Not defined', 170);
    flawsLines.slice(0, 3).forEach(line => {
      doc.text(line, 15, y);
      y += 5;
    });

    y += 10;

    // Backstory
    doc.setFontSize(12);
    doc.text('BACKSTORY', 15, y);
    y += 7;
    doc.setFontSize(9);
    const backstoryLines = this.wrapText(doc, char.characterBackstory || 'To be written...', 170);
    backstoryLines.slice(0, 10).forEach(line => {
      doc.text(line, 15, y);
      y += 5;
    });
  }

  private wrapText(doc: jsPDF, text: string, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach(word => {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const width = doc.getTextWidth(testLine);

      if (width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  private hexToRGB(hex: string): number[] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [0, 0, 0];
  }
}
