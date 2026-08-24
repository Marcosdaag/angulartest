# Bases de TypeScript

Resumen del primer bloque de aprendizaje de TypeScript, basado en los ejercicios de la carpeta `02_bases_typescript/typescript_intro/src/topics`.

---

## 1. Tipos básicos

TypeScript permite declarar variables con tipos explícitos o dejar que los **infiera** automáticamente según el valor asignado.

### Inferencia de tipos

```typescript
// TypeScript infiere que `name` es de tipo string
let name = 'Marcos';

// TypeScript infiere que `nombre` es una constante con valor fijo 'Facundo'
const nombre = 'Facundo';
```

### Tipo explícito

```typescript
// Indicamos explícitamente que name2 es de tipo String
const name2: String = 'Sofia';
```

### Union types (tipos múltiples)

Cuando una variable puede aceptar más de un tipo de valor, se usa el operador `|`:

```typescript
// hpPoints puede ser un número O el string literal 'FULL'
let hpPoints: number | 'FULL' = 95;

hpPoints = 'FULL'; // ✅ válido
hpPoints = 'otro'; // ❌ error: solo acepta number o 'FULL'
```

> **Nota:** La diferencia entre `let` y `const`:
> - `let` → variable reasignable.
> - `const` → no puede reasignarse (pero si es objeto/array, su contenido interno sí puede cambiar).

---

## 2. Objetos e Interfaces

Las **interfaces** permiten definir la estructura que debe tener un objeto. Son uno de los pilares de TypeScript para garantizar que los datos tengan la forma esperada.

### Definir una interfaz

```typescript
interface Player {
    name: string;
    hp: number;
    skills: string[];
    hometown?: string; // El ? indica que es un campo opcional
}
```

### Usar la interfaz

```typescript
const strider: Player = {
    name: "Strider",
    hp: 100,
    skills: ["Dash"]
    // hometown no es obligatorio, puede omitirse
};
```

Si intentás agregar un campo que no existe en la interfaz, o si omitís uno obligatorio, TypeScript te avisará con un **error en el editor** antes de ejecutar el código.

### Arrays tipados

```typescript
let skills: String[] = ['Dash', 'Healing'];
// Solo puede contener strings, no números ni otros tipos
```

### `export {}` — Convertir el archivo en módulo

```typescript
export {};
```

Esta línea al final de un archivo hace que TypeScript lo trate como un **módulo** independiente, evitando conflictos de variables entre archivos.

---

## 3. Funciones

### Función tradicional tipada

En TypeScript, podés (y es recomendable) tipar los **parámetros** y el **valor de retorno** de las funciones:

```typescript
// function + nombre + (parámetros: tipo) : tipoQueDevuelve
function addNumbers(a: number, b: number): number {
    return a + b;
}

const result: number = addNumbers(1, 2);
console.log({ result }); // { result: 3 } — los {} muestran el resultado como objeto
```

### Lambda functions / Arrow functions

Son funciones anónimas asignadas a una variable. Más concisas y muy usadas en Angular.

```typescript
const addNumberArrow = (a: number, b: number): string => {
    return `${a + b}`;
}

const result2: string = addNumberArrow(2, 2);
console.log(result2); // "4"
```

### Parámetros opcionales y valores por defecto

```typescript
// secondNumber es opcional (?), base tiene valor por defecto 2
function multiply(firstNumber: number, secondNumber?: number, base: number = 2): number {
    return firstNumber * base;
}

multiply(5);        // → 10 (usa base = 2 por defecto)
multiply(5, 3);     // → 10 (secondNumber existe pero no se usa en este caso)
multiply(5, 3, 4);  // → 20 (usa base = 4)
```

> **Regla:** Los parámetros opcionales (`?`) y los que tienen valor por defecto siempre van **al final** de la lista de parámetros.

### Funciones con objetos como parámetros

Se puede combinar interfaces con funciones para tipar los objetos que reciben:

```typescript
interface Character {
    name: string;
    hp: number;
    showHp: () => void; // método que no devuelve nada (void)
}

// Función que recibe un Character y un número
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

jett.showHp(); // 50
heal(jett, 50);
jett.showHp(); // 100
```

#### ¿Qué es `void`?

`void` indica que una función **no devuelve ningún valor**. Es el equivalente a no tener `return`, o tener un `return` vacío.

---

## 4. Interfaces anidadas (ejercicio práctico)

Cuando un objeto tiene propiedades que son a su vez objetos complejos, la buena práctica es **definir una interfaz separada** para cada uno y referenciarla.

```typescript
interface Address {
    calle: string;
    pais: string;
    city: string;
}

interface SuperHero {
    name: string;
    age: number;
    address: Address;        // referencia a la otra interfaz
    showAddress: () => void; // método tipado
}
```

```typescript
const superHeroe: SuperHero = {
    name: 'Spiderman',
    age: 30,
    address: {
        calle: 'Main St',
        pais: 'USA',
        city: 'NY'
    },
    showAddress() {
        // `this` hace referencia al objeto superHeroe
        return this.name + ', ' + this.address.city + ', ' + this.address.pais;
    }
}

const address = superHeroe.showAddress();
console.log(address); // "Spiderman, NY, USA"
```

> **¿Por qué interfaces anidadas?**
> - Reutilizables: `Address` puede usarse en otros objetos (como `Villain`, `NPC`, etc.)
> - Más legibles y mantenibles
> - TypeScript valida cada nivel por separado

---

## Resumen del bloque

| Concepto | Clave |
|---|---|
| **Inferencia de tipos** | TS detecta el tipo automáticamente según el valor |
| **Tipos explícitos** | Se declaran con `: tipo` después del nombre de la variable |
| **Union types** | Permiten múltiples tipos con el operador `\|` |
| **Interfaces** | Definen la estructura obligatoria de un objeto |
| **Campos opcionales** | Se marcan con `?` en la interfaz |
| **Funciones tipadas** | Se tipan parámetros y valor de retorno |
| **Arrow functions** | Funciones anónimas asignadas a variables (lambdas) |
| **Parámetros por defecto** | Se asignan con `= valor` en la firma de la función |
| **`void`** | Indica que una función no retorna nada |
| **Interfaces anidadas** | Un objeto dentro de otro se modela con su propia interfaz |
