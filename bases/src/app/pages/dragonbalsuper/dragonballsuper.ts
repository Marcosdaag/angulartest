import { Component, signal } from '@angular/core';
import { CharacterList } from '../../components/dragonball/character-list/character-list';
import { CharacterApp } from "../../components/dragonball/character-app/character-app";

interface Character {
  id: number;
  name: string;
  power: number;
}

@Component({
  selector: 'app-dragonballsuper',
  imports: [CharacterList, CharacterApp],
  templateUrl: './dragonballsuper.html',
})
export class Dragonbalsuper {
  name = signal('');
  power = signal(0);

  characters = signal<Character[]>([
    { id: 1, name: 'Goku', power: 9001 },
  ]);

  addCharacter(character: Character) {
    this.characters.update(list => [...list, character]);
  }
}
