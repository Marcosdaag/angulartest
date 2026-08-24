# Desestructuración en TypeScript

Resumen del bloque de desestructuración, basado en los archivos `05_basicdestructuring.ts`, `06_functiondestructuring.ts` y `07_import_exportr.ts`.

---

## ¿Qué es la desestructuración?

La **desestructuración** es una sintaxis que permite extraer propiedades de un objeto (o elementos de un array) y asignarlos directamente a variables, **sin tener que acceder a ellos uno por uno**.

```typescript
// Sin desestructuración — repetitivo
console.log(audioPlayer.song);
console.log(audioPlayer.songDuration);
console.log(audioPlayer.details.author);

// Con desestructuración — limpio y directo
const { song, songDuration, details: { author } } = audioPlayer;
console.log(song, songDuration, author);
```

---

## 1. Desestructuración de objetos

### Caso básico

```typescript
interface AudioPlayer {
    audioVolume: number;
    songDuration: number;
    song: string;
    details: Details;
}

interface Details {
    author: string;
    year: number;
}

const audioPlayer: AudioPlayer = {
    audioVolume: 90,
    songDuration: 36,
    song: "Mess",
    details: {
        author: "Skrillex",
        year: 2020
    }
}

const { song, songDuration } = audioPlayer;
// song       → "Mess"
// songDuration → 36
```

### Renombrar variables al desestructurar

Si el nombre original de la propiedad ya está en uso o querés uno más descriptivo, podés renombrarlo con `:`:

```typescript
const { song: anotherSong, songDuration: duration } = audioPlayer;
// anotherSong → "Mess"
// duration    → 36
```

### Desestructuración anidada (objetos dentro de objetos)

Para acceder a propiedades de un objeto anidado en una sola línea:

```typescript
const { song: anotherSong, songDuration: duration, details: { author } } = audioPlayer;
// anotherSong → "Mess"
// duration    → 36
// author      → "Skrillex"  ← extraído directamente del objeto details
```

> **Nota:** Al desestructurar `details: { author }`, la variable `details` en sí **no queda disponible**, solo `author`. Si necesitás ambas, deberías desestructurarlas por separado.

---

## 2. Desestructuración de arrays

A diferencia de los objetos (donde se extraen por nombre de propiedad), en los arrays se extrae **por posición**.

```typescript
const [primero, segundo, tercero] = ['Goku', 'Vegeta', 'Trunks'];
// primero  → 'Goku'
// segundo  → 'Vegeta'
// tercero  → 'Trunks'
```

### Omitir elementos

Podés saltarte posiciones usando comas sin nombre de variable:

```typescript
// Omitimos los primeros dos elementos con comas vacías
const [, , trunks] = ['Goku', 'Vegeta', 'Trunks'];
// trunks → 'Trunks'
```

### Valor por defecto en arrays

Si el elemento no existe en el array, se puede definir un valor por defecto con `=`:

```typescript
const [, , trunks = 'Not found']: string[] = ['Goku', 'Vegeta', 'Trunks'];
// Si 'Trunks' existiera → trunks = 'Trunks'
// Si no existiera       → trunks = 'Not found'
```

---

## 3. Desestructuración en funciones

Una de las aplicaciones más útiles es pasar y recibir **objetos como parámetros** de una función, y desestructurar el resultado al mismo tiempo.

### Función que recibe un objeto (options pattern)

En lugar de pasar múltiples parámetros individuales, se agrupa todo en un objeto. Esto hace la función más legible y flexible:

```typescript
interface Product {
    name: string;
    price: number;
}

interface TaxCalculationOptions {
    tax: number;
    products: Product[];
}

function taxCalculation(options: TaxCalculationOptions): number[] {
    let total = 0;

    options.products.forEach(product => {
        total += product.price;
    });

    return [total, total * options.tax];
}
```

### Desestructurar el resultado de la función

La función devuelve un array `[total, totalConImpuesto]`. Al recibirlo, se puede desestructurar directamente:

```typescript
// Sin desestructuración — menos expresivo
const result = taxCalculation({ products: shoppingCart, tax: 0.15 });
console.log(result[0], result[1]); // ¿qué es [0] y [1]? no es claro

// Con desestructuración — claro y expresivo ✅
const [total, tax] = taxCalculation({ products: shoppingCart, tax: 0.15 });
console.log(total, tax); // se entiende de inmediato
```

---

## 4. Import / Export entre archivos

TypeScript (y Angular) trabajan con **módulos**: cada archivo puede exportar lo que quiere compartir e importar lo que necesita de otros archivos.

### Exportar desde un archivo

```typescript
// 06_functiondestructuring.ts
export interface Product {   // export → disponible para otros archivos
    name: string;
    price: number;
}

export function taxCalculation(options: TaxCalculationOptions): number[] {
    // ...
}
```

### Importar en otro archivo

```typescript
// 07_import_exportr.ts
import type { Product } from './06_functiondestructuring';  // solo tipo
import { taxCalculation } from './06_functiondestructuring'; // valor real

const shoppingCart: Product[] = [
    { name: 'Celular', price: 200 }
];

const [total, tax] = taxCalculation({
    products: shoppingCart,
    tax: 0.15
});

console.log(total, tax);
```

### `import` vs `import type`

| Sintaxis | Cuándo usarla |
|---|---|
| `import { algo }` | Cuando importás una **función, clase o variable** (existe en runtime) |
| `import type { Algo }` | Cuando importás solo una **interfaz o tipo** (desaparece al compilar) |

> Esta distinción es obligatoria cuando `verbatimModuleSyntax` está habilitado en el `tsconfig.json`, que es el caso en proyectos Angular modernos.

---

## Observación sobre el código

En `06_functiondestructuring.ts` el resultado se consume sin desestructurar:

```typescript
// Línea 40 — forma menos expresiva
const result = taxCalculation({ products: shoppingCart, tax: tax });
console.log('Total ', result[0], result[1]);
```

Sin embargo, en `07_import_exportr.ts` ya aplicás correctamente la desestructuración al importar y usar la misma función:

```typescript
// Forma correcta y más expresiva ✅
const [total, tax] = taxCalculation({ products: shoppingCart, tax: 0.15 });
console.log(total, tax);
```

Esto demuestra la evolución natural del aprendizaje: primero usás `result[0]` y `result[1]`, y luego ya sabés que podés desestructurar directamente.

---

## Resumen del bloque

| Concepto | Ejemplo rápido |
|---|---|
| **Desestructuración de objeto** | `const { name, price } = product` |
| **Renombrar al desestructurar** | `const { name: productName } = product` |
| **Desestructuración anidada** | `const { details: { author } } = audioPlayer` |
| **Desestructuración de array** | `const [primero, segundo] = array` |
| **Omitir posiciones** | `const [, , tercero] = array` |
| **Valor por defecto en array** | `const [, , tercero = 'default'] = array` |
| **Desestructurar resultado de función** | `const [total, tax] = taxCalculation(...)` |
| **export / import** | `export function foo()` → `import { foo } from './archivo'` |
| **import type** | `import type { MiInterface } from './archivo'` |
