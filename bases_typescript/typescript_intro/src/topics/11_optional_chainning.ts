export interface Passenger {
    name: string;
    children?: string[];
}

const passenger1: Passenger = {
    name: 'Marcos',
}

const passenger2: Passenger = {
    name: 'Melisa',
    children: ['Natalia', 'Carla']
}

const printChildren = (passenger: Passenger) => {
    // Esta es una manera de poner un IF, en resumen si el arreglo de children esta vacio se setea en 0 
    // El valor que aporta esto es que la funcion siempre va a terminar recibiendo un valor
    const howManyChildren = passenger.children?.length || 0;

    console.log(howManyChildren);
}

printChildren(passenger2);
printChildren(passenger1);