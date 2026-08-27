import { Component, output, signal } from '@angular/core';
import type { Character } from '../../../interfaces/characterinterface';

@Component({
  selector: 'app-character-app',
  imports: [],
  templateUrl: './character-app.html',
})
export class CharacterApp {
  name = signal('');
  power = signal(0);

  newCharacter = output<Character>();

  addCharacter() {
    if (!this.name() || this.power() <= 0) return;

    const newCharacter: Character = {
      id: Math.floor(Math.random() * 1000),
      name: this.name(),
      power: this.power(),
    };

    console.log(newCharacter);
    this.newCharacter.emit(newCharacter);
    // Resetear el formulario
    this.name.set('');
    this.power.set(0);
  }

}
