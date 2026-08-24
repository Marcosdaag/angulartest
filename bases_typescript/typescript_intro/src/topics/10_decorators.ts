// Decorador no es mas que una funcion que se puede adjuntar a las clases, en las propiedades o en los metodos con un @
function classDecorator<T extends { new(...args: any[]): {} }>(
    constructor: T
) {
    return class extends constructor {
        newProperty = 'New Property';
    }
}

@classDecorator
class SuperClass {
    public myProperty: string = 'Abc123';

    print() {
        console.log('Hola mundo');
    }
}

// Se imprime una definicion de la clase pero NO es una nueva isntancia
console.log(SuperClass);

// Instancia de la clase
const myClass = new SuperClass();

console.log(myClass);