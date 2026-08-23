// Con las interfaces logramos que los objetos luzcan como nosotros queramos]
let skills: String[] = ['Dash', 'Healing'];

// De esta manera con una interfaz podemos definir la estructura de un objeto que la implemente
interface Player {
    name: string;
    hp: number;
    skills: string[];
    hometown?: string // Con el signo de pregunta definimos que ese parametro es opcional
}

const strider: Player = {
    name: "Strider",
    hp: 100,
    skills: ["Dash"]
}

console.log(skills);
console.table(strider);

export { }; // De esta manera transformamos el archivo en un modulo