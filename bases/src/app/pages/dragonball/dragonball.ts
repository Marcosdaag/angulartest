import { Component, signal, computed } from '@angular/core';

interface Character {
  id: number;
  name: string;
  power: number;
}

@Component({
  selector: 'app-dragonball',
  imports: [],
  templateUrl: './dragonball.html',
})
export class Dragonball {
  characters = signal<Character[]>([
    { id: 1, name: 'Goku', power: 9001 },
    { id: 2, name: 'Vegeta', power: 8001 },
    { id: 3, name: 'Picollo', power: 3001 },
    { id: 4, name: 'Yamcha', power: 500 },
  ]);

  powerClasses = computed(() => {
    return {
      'text-danger': true,
    };
  });

}
