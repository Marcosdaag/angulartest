/**
 * De esta manera creamos una clase que sigue siendo un molde
 * Definimos sus propiedades y dentro del constructor
 * constructor = funcion que se ejecuta al instanciar una clase
 * Asignamos sus propiedades
 */

export class Person {
    public name: string;
    public address: string;

    constructor(name: string, address: string) {
        this.name = name;
        this.address = address;
    }
}

const ironman = new Person('Ironman', 'New York');

console.log(ironman);

// Extender una clase 
// Hereda metodos y propiedades de la clase padre Person
export class Hero extends Person {
    public alterEgo: string;
    public age: number;
    constructor(alterEgo: string, age: number) {
        super(alterEgo, 'New York');
        this.alterEgo = alterEgo;
        this.age = age;
    }
}


// En vez de tener una herencia en cascada muy grande es mejor hacer lo siguiente
export class HeroTwo {
    public person: Person;
    public heroName: string;

    constructor(heroName: string) {
        this.heroName = heroName;

        this.person = new Person(heroName, 'New York');
    }

}