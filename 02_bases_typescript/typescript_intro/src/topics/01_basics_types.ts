// Si defino una variable asi, typescript infiere que es un tipo String
let name = 'Marcos';

// Si defino una variable constante, typescript infiere que el valor esta autoasignado
const nombre = 'Facundo';

// De esta forma ya typescript no infiere que la variable esta autoasignada sino que realmente es un String
const name2: String = 'Sofia';

// De esta manera decimos que una variable puede recibir varios tipos de valores
let hpPoints: number | 'FULL' = 95;

console.log({
    name2, hpPoints
})

export { };