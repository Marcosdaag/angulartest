import type { Product } from './06_functiondestructuring';
import { taxCalculation } from './06_functiondestructuring';

const shoppingCart: Product[] = [
    {
        name: 'Celular',
        price: 200
    },
];

// Tax 0.5
const [total, tax] = taxCalculation({
    products: shoppingCart,
    tax: 0.15
});
console.log(total, tax);