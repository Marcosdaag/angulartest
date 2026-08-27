import { Injectable, signal } from '@angular/core';
import { Character } from '../interfaces/characterinterface';

@Injectable({ providedIn: 'root' })
export class DragonballService {

  characters = signal<Character[]>([
    { id: 1, name: 'Goku', power: 9001 },
  ]);

  addCharacter(character: Character) {
    this.characters.update(list => [...list, character]);
  }

}
