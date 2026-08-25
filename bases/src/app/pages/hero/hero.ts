import { Component, signal } from "@angular/core";

@Component({
  selector: 'hero-root',
  templateUrl: './hero.html',
  styleUrl: './hero.css'
})
export class Hero {

  name = signal('Ironman');
  age = signal(45);

  getHeroDescription(name: string, age: number) {
    return `${name} - ${age}`;
  }

  changeHero() {
    this.name.set('Spiderman');
    this.age.set(22);
  }

  resetForm() {
    this.name.set('Ironman');
    this.age.set(45);
  }

  cambiarEdad() {
    this.age.set(60);
  }

}
