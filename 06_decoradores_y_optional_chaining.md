# Decoradores y Optional Chaining en TypeScript

Resumen del último bloque de TypeScript, basado en `10_decorators.ts` y `11_optional_chainning.ts`.

---

## 1. Decoradores

### ¿Qué es un decorador?

Un **decorador** es una función que se adjunta a una clase, método o propiedad usando el símbolo `@`. Su propósito es **agregar funcionalidad extra** sin modificar el código interno de lo que decora.

> En Angular, los decoradores son el núcleo del framework: una clase sola no es nada, el decorador es lo que le da identidad y comportamiento dentro de la aplicación.

### Anatomía de un decorador de clase

```typescript
// Un decorador es una función que recibe el constructor de la clase
function classDecorator<T extends { new(...args: any[]): {} }>(constructor: T) {
    // Devuelve una nueva clase que extiende la original
    return class extends constructor {
        newProperty = 'New Property'; // agrega una propiedad nueva
    }
}
```

- Recibe el **constructor** de la clase como parámetro
- Devuelve una **nueva clase** que extiende la original con el comportamiento adicional
- La clase original no se modifica directamente

### Uso

```typescript
@classDecorator       // ← se aplica con @
class SuperClass {
    public myProperty: string = 'Abc123';

    print() {
        console.log('Hola mundo');
    }
}

// SuperClass ahora tiene también `newProperty` gracias al decorador
const myClass = new SuperClass();
console.log(myClass); // { myProperty: 'Abc123', newProperty: 'New Property' }
```

### `console.log(SuperClass)` vs `new SuperClass()`

```typescript
console.log(SuperClass);       // muestra la DEFINICIÓN de la clase (el molde)
const myClass = new SuperClass();
console.log(myClass);          // muestra una INSTANCIA (el objeto creado)
```

Son cosas distintas: la clase es el molde, la instancia es el objeto concreto creado a partir de ese molde.

---

### Decoradores en Angular

En la práctica, vos no vas a crear decoradores propios — Angular ya los trae listos. El concepto clave es entender qué hacen:

```typescript
@Component({ selector: 'app-root', templateUrl: './app.component.html' })
class AppComponent { }
// → Angular trata esta clase como un componente de UI

@Injectable({ providedIn: 'root' })
class UserService { }
// → Angular trata esta clase como un servicio singleton inyectable

@NgModule({ declarations: [...], imports: [...] })
class AppModule { }
// → Angular trata esta clase como un módulo que agrupa la app
```

**Todo en Angular son clases. El decorador es lo que le dice al framework cómo tratarlas.**

---

## 2. Optional Chaining (`?.`)

### El problema

Cuando accedés a una propiedad que puede no existir (es `undefined` o `null`), JavaScript/TypeScript arroja un error en tiempo de ejecución:

```typescript
interface Passenger {
    name: string;
    children?: string[]; // opcional — puede no existir
}

const passenger1: Passenger = { name: 'Marcos' }; // sin children

// ❌ Sin optional chaining — explota si children no existe
const count = passenger1.children.length; // TypeError: Cannot read properties of undefined
```

### La solución: `?.`

El operador `?.` evalúa la expresión solo si el valor **no es** `undefined` ni `null`. Si lo es, devuelve `undefined` en lugar de lanzar un error.

```typescript
const howManyChildren = passenger.children?.length || 0;
//                                        ^^
//                      Si children existe → devuelve su length
//                      Si children es undefined → devuelve undefined → el || lo convierte en 0
```

### Desglose de la expresión

```typescript
passenger.children?.length || 0
```

| Parte | Qué hace |
|---|---|
| `passenger.children` | Accede a `children` |
| `?.length` | Solo evalúa `.length` si `children` existe |
| `\|\| 0` | Si el resultado es `undefined` (o falsy), usa `0` como valor por defecto |

Esto garantiza que la función **siempre devuelve un número**, sin importar si el pasajero tiene hijos o no.

### Comparación completa

```typescript
const passenger1: Passenger = { name: 'Marcos' };           // sin children
const passenger2: Passenger = { name: 'Melisa', children: ['Natalia', 'Carla'] };

const printChildren = (passenger: Passenger) => {
    const howManyChildren = passenger.children?.length || 0;
    console.log(howManyChildren);
}

printChildren(passenger1); // → 0  (children no existe, no explota)
printChildren(passenger2); // → 2  (children existe, devuelve su length)
```

### Otros usos de `?.`

```typescript
// En métodos
objeto.metodo?.(); // solo llama al método si existe

// En arrays
array?.[0]; // solo accede al índice si el array existe

// Encadenado
usuario?.direccion?.ciudad; // seguro aunque usuario o dirección no existan
```

---

## Resumen del bloque

| Concepto | Clave |
|---|---|
| **Decorador** | Función que se adjunta con `@` y agrega comportamiento a una clase/método/propiedad |
| **Decorador de clase** | Recibe el constructor y devuelve una clase extendida |
| **`@Component`, `@Injectable`, etc.** | Decoradores de Angular que definen el rol de cada clase |
| **Todo en Angular son clases** | El decorador es lo que les da identidad dentro del framework |
| **`?.` (Optional Chaining)** | Accede a una propiedad solo si el objeto existe, evita errores en runtime |
| **`\|\| 0` con `?.`** | Patrón para asegurar un valor por defecto cuando algo puede ser undefined |
