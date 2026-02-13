import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dice-roller',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dice-roller.component.html',
  styleUrl: './dice-roller.component.scss'
})
export class DiceRollerComponent {
  @Input() isRolling = false;
  @Input() showResult = false;
  @Input() diceResults: number[] = [];
  @Input() droppedIndex = -1;
  @Input() total = 0;
}
