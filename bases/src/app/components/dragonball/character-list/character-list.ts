import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import type { Character } from '../../../interfaces/characterinterface';

@Component({
  selector: 'character-list',
  imports: [],
  templateUrl: './character-list.html',
})
export class CharacterList {
  // Con el input decimos que vamos a recibir informacion como un parametro desde fuera
  characters = input.required<Character[]>()
  listName = input.required<string>();
}
