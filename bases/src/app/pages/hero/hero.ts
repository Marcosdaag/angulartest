import { UpperCasePipe } from "@angular/common";
import { Component, computed, signal } from "@angular/core";

@Component({
  selector: 'hero-root',
  templateUrl: './hero.html',
  styleUrl: './hero.css',
  imports: [UpperCasePipe]
})
export class Hero {

  name = signal('Ironman');
  age = signal(45);

  //Otra forma de enviar la descripcion
  heroDescription = computed(() => {
    const description = `${this.name()} - ${this.age()}`;
    return description;
  });

  // A esto se le llama señales computadas
  capitalizedName = computed(() => {
    const name = this.name().toUpperCase();
    return name;
  });

  /* getHeroDescription(name: string, age: number) {
    return `${name} - ${age}`;
  } */

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
