// De esta manera podemos especificar el tipo de dato, pasarselo como parametro e incluso devolverlo
// Nos sirve para que una misma funcion actue de distintas maneras segun el tipo de dato que reciba
export function whatsMyTytpe<T>(argument: T): T {
    return argument;
}

// Lo que hace esto es darle un valor T que en este caso seria string
// Retorna el mismo valor
let amIString = whatsMyTytpe<string>('Hola mundo'); // Le avisamos que el generico que va a entrar es un string

// Al llamar la variable nos deja autocompletar sus metodos
console.log(amIString.toUpperCase());