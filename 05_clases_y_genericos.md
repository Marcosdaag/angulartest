# Clases, Herencia, Composición y Genéricos en TypeScript

Resumen del bloque basado en `08_clases.ts` y `09_generics.ts`.

---

## 1. Clases

Una **clase** es un molde o plantilla para crear objetos. Define qué propiedades y métodos van a tener esos objetos.

### Estructura de una clase en TypeScript

```typescript
export class Person {
    public name: string;    // 1. Declaración de propiedades
    public address: string;

    constructor(name: string, address: string) {  // 2. Constructor
        this.name = name;       // 3. Asignación
        this.address = address;
    }
}
```

Los tres pasos clave:
1. **Declarar** las propiedades con su tipo arriba de la clase
2. **Recibir** los valores como parámetros en el `constructor`
3. **Asignar** con `this.propiedad = parametro`

> El **constructor** es una función especial que se ejecuta automáticamente en el momento en que se instancia la clase. Solo se ejecuta una vez, al crear el objeto.

### Crear una instancia

```typescript
const ironman = new Person('Ironman', 'New York');
console.log(ironman); // Person { name: 'Ironman', address: 'New York' }
```

### Modificadores de acceso

| Modificador | Descripción |
|---|---|
| `public` | Accesible desde cualquier lado (por defecto) |
| `private` | Solo accesible dentro de la misma clase |
| `protected` | Accesible dentro de la clase y sus clases hijas |

---

## 2. Herencia

La herencia permite que una clase **extienda** otra, heredando sus propiedades y métodos.

```typescript
export class Hero extends Person {
    public alterEgo: string;
    public age: number;

    constructor(alterEgo: string, age: number) {
        super(alterEgo, 'New York'); // llama al constructor de Person
        this.alterEgo = alterEgo;
        this.age = age;
    }
}
```

- `extends` → indica de qué clase se hereda
- `super(...)` → **obligatorio** en el constructor cuando se hereda; llama al constructor de la clase padre y le pasa los valores que necesita

### El problema con la herencia en cascada

```
Animal
  └── LivingBeing extends Animal
        └── Character extends LivingBeing
              └── Hero extends Character
                    └── SuperHero extends Hero  ← hereda TODO aunque no lo necesite
```

Cuanto más profunda la cadena, más difícil es mantener, debuggear y entender el código.

---

## 3. Composición — "Preferir Composición sobre Herencia"

En lugar de construir cadenas de herencia largas, la **composición** propone que una clase **contenga instancias de otras clases** como propiedades.

```typescript
// ❌ Herencia — Hero "ES" una Person (y hereda todo lo que eso implica)
export class Hero extends Person { ... }

// ✅ Composición — HeroTwo "TIENE" una Person
export class HeroTwo {
    public person: Person;   // tiene una Person como propiedad
    public heroName: string;

    constructor(heroName: string) {
        this.heroName = heroName;
        this.person = new Person(heroName, 'New York'); // la instancia adentro
    }
}
```

### ¿Cuándo usar cada una?

| Situación | Usar |
|---|---|
| La relación es "A **es un** B" (Hero es una Person) | Herencia |
| La relación es "A **tiene un** B" (Hero tiene una Person) | Composición |
| La cadena de herencia tiene más de 2-3 niveles | Composición |
| Necesitás reutilizar comportamiento sin una relación directa | Composición |

> **Regla práctica:** Si dudás entre herencia y composición, preferí composición. Es más flexible y menos propensa a errores a largo plazo.

### Composición vs Inyección de Dependencias

La composición que vemos en `HeroTwo` crea la dependencia **adentro** de la clase. La **Inyección de Dependencias** da un paso más: la dependencia se **recibe desde afuera**:

```typescript
// Composición — crea adentro
class HeroTwo {
    person = new Person('Ironman', 'NY'); // acoplado
}

// Inyección de Dependencias — recibe desde afuera
class HeroTwo {
    constructor(public person: Person) {} // desacoplado, más flexible
}
```

En Angular, el framework se encarga de crear los servicios y los inyecta automáticamente — nunca hacés `new MiServicio()` a mano.

---

## 4. Genéricos

Los **genéricos** permiten crear funciones, clases o interfaces que trabajen con **cualquier tipo de dato**, sin perder la información del tipo.

### El problema sin genéricos

```typescript
// Con `any` — pierde el tipo, no hay autocompletado ni validación
function identity(arg: any): any {
    return arg;
}

let result = identity('hola');
result.toUpperCase(); // TS no sabe que es string, no ayuda
```

### Con genéricos

```typescript
// Con genérico <T> — conserva el tipo
export function whatsMyType<T>(argument: T): T {
    return argument;
}
```

- `<T>` es el **parámetro de tipo** (como un parámetro normal pero para tipos)
- `T` es una convención, podría llamarse cualquier cosa (`<Type>`, `<Item>`, etc.)
- La función dice: *"recibo algo de tipo T y devuelvo algo del mismo tipo T"*

### Uso

```typescript
let amIString = whatsMyType<string>('Hola mundo');
// TypeScript sabe que amIString es string
console.log(amIString.toUpperCase()); // ✅ autocompletado disponible

let amINumber = whatsMyType<number>(42);
console.log(amINumber.toFixed(2)); // ✅ métodos de number disponibles
```

### ¿Por qué son importantes en Angular?

Los genéricos aparecen constantemente en Angular, por ejemplo al hacer llamadas HTTP:

```typescript
// Le decís a Angular qué tipo de dato va a devolver la API
this.http.get<User[]>('/api/usuarios').subscribe(usuarios => {
    // `usuarios` es User[], TypeScript lo sabe y te ayuda
    console.log(usuarios[0].name); // autocompletado ✅
});
```

---

## Resumen del bloque

| Concepto | Clave |
|---|---|
| **Clase** | Molde para crear objetos, con propiedades y constructor |
| **Constructor** | Función que se ejecuta al instanciar, asigna las propiedades |
| **`public` / `private`** | Controlan desde dónde se puede acceder a una propiedad |
| **Herencia (`extends`)** | Una clase "es un" tipo de otra, hereda todo |
| **`super()`** | Llama al constructor de la clase padre, obligatorio al heredar |
| **Composición** | Una clase "tiene" otra como propiedad, más flexible |
| **Composición > Herencia** | Preferir composición para evitar cadenas largas y frágiles |
| **Inyección de Dependencias** | Como la composición, pero la dependencia se recibe desde afuera |
| **Genéricos `<T>`** | Funciones/clases que trabajan con cualquier tipo preservando la info del tipo |
