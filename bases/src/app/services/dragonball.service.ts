import { effect, Injectable, signal } from '@angular/core';
import { Character } from '../interfaces/characterinterface';


const loadFromLocalstorage = (): Character[] => {

  const characters = localStorage.getItem('characters');
  return characters ? JSON.parse(characters) : [];

}


@Injectable({ providedIn: 'root' })
export class DragonballService {

  characters = signal<Character[]>(loadFromLocalstorage());

  saveToLocalStorage = effect(() => {
    localStorage.setItem('characters', JSON.stringify(this.characters()));
  })


  addCharacter(character: Character) {
    this.characters.update(list => [...list, character]);
  }

}
