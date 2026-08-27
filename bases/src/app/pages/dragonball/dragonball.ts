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
  name = signal('');
  power = signal(0);

  characters = signal<Character[]>([
    { id: 1, name: 'Goku', power: 9001 },
  ]);

  powerClasses = computed(() => ({
    'text-danger': this.power() > 9000,
    'text-primary': this.power() <= 9000,
  }));

  addCharacter() {
    if (!this.name() || this.power() <= 0) return;

    const newCharacter: Character = {
      id: this.characters().length + 1,
      name: this.name(),
      power: this.power(),
    };

    this.characters.update((list) => [...list, newCharacter]);

    // Resetear el formulario
    this.name.set('');
    this.power.set(0);
  }

}
