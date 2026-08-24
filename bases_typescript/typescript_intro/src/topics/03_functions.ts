// Definicion de una funcion en TS
// function+nombre+parametros+:tipoquedevuelve

// De esta forma definimos que tipo de valor entra en cada parametro y que tipo de valor devuelve la funcion
function addNumbers(a: number, b: number): number {
    return a + b;
}
const result: number = addNumbers(1, 2);
// Con los corchetes podemos devolver por consola el resultado en formato de objeto
console.log({ result });


// LAMBDA functions o funciones de flecha
const addNumberArrow = (a: number, b: number): String => {
    return `${a + b}`;
}
const result2: String = addNumberArrow(2, 2);
console.log(result2);


// De esta manera podemos asignar parametros opcionales o predefinidos en una funcion
// El secondNumber es opcional y la base es por defecto 2
function multiply(firstNumber: number, secondNumber?: number, base: number = 2): number {
    return firstNumber * base;
}
const resultadoMultiply = multiply(1);
console.log(resultadoMultiply);


// Funciones con objetos como parametros
interface Character {
    name: string;
    hp: number;
    showHp: () => void;
}

const heal = (character: Character, amount: number) => {
    character.hp += amount;
}

const jett: Character = {
    name: 'Aragon',
    hp: 50,
    showHp() {
        console.log(this.hp);
    }
}

jett.showHp();
heal(jett, 50);

export { };