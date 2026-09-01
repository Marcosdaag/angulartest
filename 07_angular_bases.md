# Angular — Bases y Arquitectura

Resumen del primer bloque práctico de Angular: scaffolding, arquitectura de archivos, rutas y Signals.

---

## 1. Scaffolding — Crear un proyecto Angular

El **Angular CLI** genera automáticamente toda la estructura del proyecto con un solo comando:

```bash
ng new nombre-del-proyecto
```

Durante la creación el CLI pregunta:
- **¿Agregar SSR?** → No (para aprender)
- **¿Zoneless?** → No (experimental, el curso no lo cubre)

---

## 2. Arquitectura de archivos

Un proyecto Angular moderno tiene esta estructura:

```
bases/
├── src/
│   ├── main.ts               ← punto de entrada de la aplicación
│   └── app/
│       ├── app.ts            ← componente raíz
│       ├── app.html          ← template del componente raíz
│       ├── app.config.ts     ← configuración global de la app
│       ├── app.routes.ts     ← definición de rutas
│       └── pages/            ← componentes de páginas
│           ├── counter/
│           │   ├── counter.ts
│           │   └── counter.html
│           └── hero/
│               ├── hero.ts
│               └── hero.html
├── tsconfig.json             ← config base de TypeScript
├── tsconfig.app.json         ← config TS para la app
├── tsconfig.spec.json        ← config TS para los tests
└── angular.json              ← config del CLI de Angular
```

### ¿Qué hace cada archivo clave?

#### `main.ts` — El punto de entrada
```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
```
Es el primer archivo que se ejecuta. **Arranca la aplicación** tomando el componente raíz (`App`) y la configuración (`appConfig`).

---

#### `app.config.ts` — Configuración global
```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes)  // ← registra las rutas
  ]
};
```
Configura los **providers** globales de la app: el router, el manejo de errores, Zone.js, etc. En Angular moderno reemplaza al antiguo `AppModule`.

---

#### `app.ts` — Componente raíz
```typescript
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('bases');
}
```
Es el componente principal. Contiene el `<router-outlet>` que es donde Angular renderiza cada página según la ruta activa.

---

#### `app.html` — Template del componente raíz
```html
<!-- nav, header irían acá -->
<router-outlet></router-outlet>
<!-- footer iría acá -->
```
Solo contiene el `<router-outlet>`. Todo lo que sea layout global (navbar, footer) va en este archivo.

---

#### `app.routes.ts` — Definición de rutas
```typescript
export const routes: Routes = [
  { path: '',      component: Counter },
  { path: 'hero',  component: Hero    },
];
```
Define qué componente se muestra para cada URL. **Importante:** las rutas nunca llevan `/` al inicio.

---

## 3. Componentes

Cada componente en Angular tiene al menos dos archivos:

```
counter.ts    ← lógica (clase TypeScript con decorador @Component)
counter.html  ← template (lo que se muestra en el navegador)
```

### Estructura de un componente

```typescript
@Component({
  selector: 'counter-root',      // nombre para usarlo en otros templates
  templateUrl: './counter.html', // archivo HTML asociado
  styleUrl: './counter.css'      // estilos del componente
})
export class Counter {
  // lógica del componente
}
```

---

## 4. Signals

Las **Signals** son la nueva forma de manejar estado reactivo en Angular. Cuando el valor de un Signal cambia, Angular actualiza **solo** los lugares del template donde se usa ese Signal.

### Crear un Signal

```typescript
import { signal } from '@angular/core';

counter = signal(10);       // valor inicial: 10
name    = signal('Ironman');
```

### Leer un Signal en el template

Los Signals se llaman como funciones en el template:

```html
<h1>{{ counter() }}</h1>   <!-- los () son obligatorios -->
<h1>{{ name() }}</h1>
```

### Modificar un Signal

```typescript
// set() — reemplaza el valor
this.counter.set(0);
this.name.set('Spiderman');

// update() — modifica basándose en el valor actual
this.counter.update(current => current + 1);
this.counter.update(current => current - 1);
```

### Ejemplo completo — Counter

```typescript
export class Counter {
  counter = signal(10);

  increaseByOne(value: number) {
    this.counter.update(current => current + value);
  }

  decreaseByOne(value: number) {
    this.counter.update(current => current - value);
  }

  reset() {
    this.counter.set(0);
  }
}
```

```html
<h1>Contador: {{ counter() }}</h1>
<button (click)="increaseByOne(1)">+1</button>
<button (click)="decreaseByOne(1)">-1</button>
<button (click)="reset()">Reset</button>
```

### Signals vs variable normal

```typescript
// Variable normal — Angular no detecta el cambio automáticamente
counter = 10;
this.counter += 1; // puede que la UI no se actualice

// Signal — Angular detecta el cambio y actualiza la UI al instante
counter = signal(10);
this.counter.update(c => c + 1); // UI se actualiza sola ✅
```

### `computed()` — Signals derivadas

Un `computed()` crea un Signal cuyo valor **se calcula automáticamente** a partir de otros Signals. Se recalcula solo cuando alguno de los Signals que usa cambia.

```typescript
import { signal, computed } from '@angular/core';

power = signal(0);

// Se recalcula automáticamente cuando power() cambia
powerClasses = computed(() => ({
  'text-danger':  this.power() > 9000,
  'text-primary': this.power() <= 9000,
}));
```

En el template:
```html
<!-- powerClasses() devuelve el objeto con las clases activas -->
<span [ngClass]="powerClasses()">{{ power() }}</span>

<!-- O con class binding directo -->
<span [class.text-danger]="power() > 9000">{{ power() }}</span>
```

> **Regla:** No hagas cálculos complejos dentro del template. Si un valor depende de un Signal, usá `computed()` en la clase y accedé al resultado en el template.

---

### `effect()` — Reaccionar a cambios con efectos secundarios

`effect()` ejecuta una función automáticamente **cada vez que algún Signal que usa cambia**. Es ideal para sincronizar datos con sistemas externos (localStorage, APIs, logs).

```typescript
import { signal, effect } from '@angular/core';

characters = signal<Character[]>([]);

// Se ejecuta automáticamente cada vez que characters cambia
saveToLocalStorage = effect(() => {
  localStorage.setItem('characters', JSON.stringify(this.characters()));
});
```

**¿Por qué `JSON.stringify`?**  
`localStorage` solo almacena strings. `JSON.stringify()` convierte el array/objeto a string JSON. Para recuperarlo después:
```typescript
JSON.parse(localStorage.getItem('characters') ?? '[]')
```

| | `signal()` | `computed()` | `effect()` |
|---|---|---|---|
| **Para qué** | Guardar estado | Calcular valor derivado | Ejecutar código cuando algo cambia |
| **Devuelve** | Un valor reactivo | Un valor reactivo (readonly) | Nada (solo ejecuta) |
| **Ejemplo** | `name = signal('')` | `fullName = computed(() => ...)` | `effect(() => localStorage...)` |

---

### `@for` — Control flow moderno en templates

Angular moderno usa la sintaxis `@for` en lugar de la directiva `*ngFor`. Es más legible y no requiere importar nada:

```html
<!-- Sintaxis moderna (Angular 17+) -->
@for (gif of gifs(); track gif.id) {
  <app-gif-list-item [imageUrl]="gif.url" />
}

<!-- Equivalente antiguo con *ngFor (aún funciona pero está en desuso) -->
<app-gif-list-item *ngFor="let gif of gifs(); trackBy: trackByFn" />
```

El `track` es obligatorio — le dice a Angular cómo identificar cada elemento para actualizar solo los que cambian, no re-renderizar toda la lista:

```html
@for (item of menuOptions; track item.route) {
  <a [routerLink]="item.route">{{ item.label }}</a>
}
```

También existe `@if` y `@switch` para condicionales:
```html
@if (loading()) {
  <p>Cargando...</p>
} @else {
  <app-gif-list [gifs]="gifs()" />
}
```

---

## 5. Bindings — Conectar TypeScript con el HTML

Angular conecta la lógica con el template a través de **bindings**:

| Sintaxis | Nombre | Dirección | Ejemplo |
|---|---|---|---|
| `{{ valor }}` | Interpolación | TS → HTML | `{{ name() }}` |
| `(click)="metodo()"` | Event binding | HTML → TS | `(click)="changeHero()"` |
| `[propiedad]="valor"` | Property binding | TS → HTML | `[disabled]="isLoading"` |
| `[(ngModel)]="valor"` | Two-way binding | TS ↔ HTML | `[(ngModel)]="name"` |

---

## 6. Pipes — Transformar datos en el template

Los **pipes** transforman cómo se muestra un valor en el template **sin modificar el dato original** en la clase. Se usan con el operador `|`.

```html
{{ valor | nombreDelPipe }}
```

### Pipes más comunes de Angular

```html
<!-- Texto -->
{{ 'hola mundo' | uppercase }}     → HOLA MUNDO
{{ 'HOLA MUNDO' | lowercase }}     → hola mundo
{{ 'hola mundo' | titlecase }}     → Hola Mundo

<!-- Números -->
{{ 3.14159 | number:'1.2-2' }}     → 3.14
{{ 0.25 | percent }}               → 25%
{{ 1500 | currency:'USD' }}        → $1,500.00

<!-- Fechas -->
{{ fecha | date:'dd/MM/yyyy' }}    → 25/08/2026
{{ fecha | date:'short' }}         → 8/25/26, 11:00 AM

<!-- Debug -->
{{ objeto | json }}                → muestra el objeto como JSON legible

<!-- Arrays -->
{{ ['a','b','c','d'] | slice:0:2 }} → a, b
```

### Pipes con parámetros

Se pasan después de `:`:

```html
{{ 3.14159265 | number:'1.0-2' }}
<!--                   ^ ^  ^
                       | |  máximo de decimales (2)
                       | mínimo de decimales (0)
                       mínimo de dígitos enteros (1)
-->
```

### Encadenar pipes

Se pueden aplicar varios en secuencia:

```html
{{ nombre | uppercase | slice:0:5 }}
<!-- primero mayúsculas, luego toma los primeros 5 caracteres -->
```

### ¿Por qué son útiles?

```typescript
// Sin pipe — transformás en el componente (innecesario para presentación)
getNombreMayus() {
  return this.name().toUpperCase();
}
```

```html
<!-- Con pipe — la transformación va directo en el template ✅ -->
{{ name() | uppercase }}
```

Los pipes mantienen la lógica de presentación **en el template** y la lógica de negocio **en el componente**, respetando la separación de responsabilidades.

---

## 7. Rutas — Errores comunes

```typescript
// ❌ Con barra — inválido, puede dejar el router-outlet en blanco
{ path: '/hero', component: Hero }

// ✅ Sin barra — correcto
{ path: 'hero', component: Hero }
{ path: '', component: Counter }    // ruta raíz
{ path: '**', component: NotFound } // wildcard 404
```

---

## Resumen del bloque

| Concepto | Clave |
|---|---|
| **Scaffolding** | `ng new` genera toda la estructura automáticamente |
| **`main.ts`** | Punto de entrada, arranca la app con `bootstrapApplication` |
| **`app.config.ts`** | Providers globales: router, Zone.js, errores |
| **`app.routes.ts`** | Define qué componente renderiza cada URL |
| **`<router-outlet>`** | Donde Angular inserta el componente de la ruta activa |
| **Componente** | Clase TS con `@Component` + archivo HTML (+ CSS opcional) |
| **`signal(valor)`** | Estado reactivo — la UI se actualiza automáticamente |
| **`.set()`** | Reemplaza el valor del signal |
| **`.update(fn)`** | Modifica el signal basándose en su valor actual |
| **`{{ signal() }}`** | Los signals se leen con `()` en el template |
| **Bindings** | Conectan TypeScript con el HTML en distintas direcciones |
