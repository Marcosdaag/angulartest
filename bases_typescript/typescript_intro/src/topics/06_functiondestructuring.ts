export interface Product {
    name: string;
    price: number;
}

const phone: Product = {
    name: 'Nokia a1',
    price: 15
}

const table: Product = {
    name: 'Mesa',
    price: 100
}

const shoppingCart = [phone, table];
const tax = 0.15;


interface TaxCalculationOptions {
    tax: number;
    products: Product[];
}

export function taxCalculation(options: TaxCalculationOptions): number[] {
    let total = 0;

    options.products.forEach(product => {
        total += product.price;
    });

    return [total, total * options.tax];
}

const result = taxCalculation({
    products: shoppingCart,
    tax: tax
});

console.log('Total ', result[0], result[1]);
