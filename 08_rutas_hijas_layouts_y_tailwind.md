# Rutas Hijas, Layouts, Lazy Loading y Tailwind CSS

Resumen de las características vistas en el proyecto `gifs-app`: arquitectura modular por features, Tailwind CSS v4, carga perezosa (`loadComponent`), rutas hijas (`children`), layouts anidados con múltiples `<router-outlet>` y redirecciones comodín.

---

## 1. Arquitectura Modular por Características (*Feature-First*)

En proyectos reales de Angular se recomienda organizar el código por **dominios de negocio o funcionalidades** en lugar de agrupar todos los componentes juntos:

```
src/app/
├── auth/                       ← Módulo o feature de autenticación
├── shared/                     ← Componentes/utilidades compartidos por toda la app
└── gifs/                       ← Feature principal de GIFs
    ├── components/             ← Componentes reutilizables de esta feature
    ├── interfaces/             ← Tipos e interfaces de datos (modelos de API)
    ├── services/               ← Servicios con lógica y llamadas HTTP
    └── pages/                  ← Vistas o pantallas completas
        ├── dashboard/
        │   ├── dashboard.ts
        │   └── dashboard.html
        ├── trending/
        │   ├── trending.ts
        │   └── trending.html
        └── search/
            ├── search.ts
            └── search.html
```

> **Ventaja:** Cada carpeta de feature es autónoma, fácil de encontrar, mantener y mover.

---

## 2. Integración de Tailwind CSS (Tailwind v4)

En este proyecto se utiliza la versión más moderna de Tailwind CSS integrada directamente con PostCSS:

### Dependencias instaladas
- `tailwindcss`
- `@tailwindcss/postcss`
- `postcss`

### Configuración en `src/styles.css`
A diferencia de versiones viejas de Tailwind (que usaban `@tailwind base; components; utilities;`), en Tailwind v4 se importa con una sola directiva limpia:

```css
/* src/styles.css */
@import 'tailwindcss';

html, body {
  height: 100%;
  overflow-x: hidden;
}
```

### Lección clave de maquetación: Viewport y Scrollbars
- **`w-screen` vs `w-full`**:
  - `w-screen` (`100vw`): Ocupa el ancho total de la ventana ignorando la barra de desplazamiento. Si hay scroll vertical, genera desbordamiento horizontal.
  - `w-full` (`100%`): Se ajusta al 100% del contenedor padre respetando el espacio disponible sin desbordar.
- **`overflow-y-scroll` vs `overflow-y-auto`**:
  - `overflow-y-scroll`: Fuerza la aparición de la barra de desplazamiento vertical siempre, haya o no contenido excedente.
  - `overflow-y-auto`: Muestra la barra únicamente cuando el contenido realmente desborda.

---

## 3. Carga Perezosa (Lazy Loading) de Componentes

En lugar de importar estáticamente los componentes al inicio (lo que cargaría todo el código de la app en la primera visita), se usa **Lazy Loading**:

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./gifs/pages/dashboard/dashboard'),
    // ...
  }
];
```

### `export default class`
Al usar `export default` en el componente:

```typescript
// dashboard.ts
export default class Dashboard { }
```

Angular puede cargar el componente directamente con `loadComponent: () => import('./ruta')` sin necesidad de agregar `.then(m => m.Dashboard)`.

> **Impacto:** El navegador solo descarga el archivo JavaScript de esa página cuando el usuario entra en esa URL, reduciendo el bundle inicial drásticamente.

---

## 4. Rutas Hijas y Layout Pattern (`children`)

Una de las técnicas más usadas en paneles y dashboards es el **Layout Pattern**: tener una estructura común fija (sidebar, barra superior) y cambiar dinámicamente solo el área de contenido principal.

### Definición en `app.routes.ts`

```typescript
export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./gifs/pages/dashboard/dashboard'),
    children: [
      {
        path: 'trending',
        loadComponent: () => import('./gifs/pages/trending/trending'),
      },
      {
        path: 'search',
        loadComponent: () => import('./gifs/pages/search/search'),
      },
      {
        path: '**',
        redirectTo: 'trending',
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
```

### ¿Cómo interactúan las URLs resultantes?
Las rutas hijas se concatenan a la ruta padre:
- `/dashboard` + `/trending` → `/dashboard/trending`
- `/dashboard` + `/search`   → `/dashboard/search`

---

## 5. El Patrón de Múltiples `<router-outlet>`

Para que las rutas hijas funcionen visualmente, se usan dos niveles de salida de router:

### Nivel 1: `src/app/app.html` (Raíz)
```html
<!-- Carga el componente Dashboard cuando la ruta coincide con /dashboard -->
<router-outlet></router-outlet>
```

### Nivel 2: `dashboard.html` (Layout anidado)
El Dashboard actúa como **marco o layout**:
1. Menú lateral fijo a la izquierda (`fixed w-[220px]`).
2. Contenedor principal a la derecha (`ml-[220px]`) con su propio `<router-outlet>`:

```html
<div class="flex flex-col relative w-full">
  <!-- Menú lateral fijo -->
  <div id="menu" class="w-[220px] fixed left-0 h-screen ...">
    <!-- Links, avatar, opciones -->
  </div>

  <!-- Contenido dinámico hijo -->
  <div class="ml-[220px] px-4 flex flex-col flex-1 w-full h-full">
    <!-- Aquí Angular inyecta Trending o Search según la sub-ruta -->
    <router-outlet></router-outlet>
  </div>
</div>
```

> **Importante:** Para usar `<router-outlet>` dentro de `dashboard.html`, el componente `Dashboard` debe incluir `RouterOutlet` en su arreglo de `imports`:
> ```typescript
> @Component({
>   selector: 'app-dashboard',
>   imports: [RouterOutlet],
>   templateUrl: './dashboard.html',
> })
> export default class Dashboard { }
> ```

---

## 6. Redirecciones y Rutas Comodín (`**`)

### Redirección directa (`redirectTo`)
Indica al router que reenvíe la navegación a otra dirección si coincide con el patrón especificado.

```typescript
{
  path: '**',
  redirectTo: 'dashboard',
}
```

### Ruta comodín (`path: '**'`)
El asterisco doble `**` atrapa **cualquier ruta que no haya hecho coincidencia previa**.

En la configuración del proyecto hay dos comodines estratégicos:
1. **Comodín hijo (dentro de `dashboard.children`):** Si alguien entra a `/dashboard/cualquier-cosa-inventada`, se redirige automáticamente a `/dashboard/trending`.
2. **Comodín global:** Si alguien entra a `/ruta-desconocida`, se redirige automáticamente a `/dashboard` (y este a su vez caerá en `/dashboard/trending`).

> **Regla de oro:** El `{ path: '**' }` siempre debe definirse al **final** del arreglo de rutas, ya que Angular evalúa las rutas en orden de arriba a abajo. Si se pone al principio, bloquearía todas las demás.

---

## 7. Patrón Smart vs Dumb Components (Contenedor vs Presentacional)

Es uno de los patrones más importantes en Angular. Divide los componentes en dos roles claros:

| | **Smart (Contenedor)** | **Dumb (Presentacional)** |
|---|---|---|
| **Rol** | Maneja datos y lógica | Solo muestra lo que recibe |
| **Obtiene datos** | De servicios, APIs, signals | Por `input()` del padre |
| **Sabe de la app** | Sí | No — es reutilizable |
| **Ejemplo** | `TrendingPage`, `SearchPage` | `GifList`, `GifListItem` |

```
TrendingPage (Smart)
    │  Tiene los datos: gifs = signal<Gif[]>([])
    │  Los baja con [gifs]="gifService.trendingGifs()"
    ▼
GifList (Dumb)
    │  No sabe de dónde salieron los gifs
    │  Solo arma la cuadrícula con @for
    ▼
GifListItem (Dumb)
    Solo muestra una imagen. No sabe que existe una "lista" ni "trending"
```

> **Ventaja:** Si mañana hacés la página de `Search`, reutilizás `GifList` y `GifListItem` sin tocar ni una línea de esos componentes. Solo creás un nuevo `SearchPage` (Smart) que les pase los datos.

---

## 8. `input()` — Signal Inputs (nueva forma de `@Input`)

Angular moderno reemplaza el decorador `@Input()` por la función `input()`, que devuelve un Signal:

```typescript
import { Component, input } from '@angular/core';

// Antiguo — con decorador
export class GifListItem {
  @Input() imageUrl!: string; // no es un Signal, valor directo
}

// Moderno — Signal Input
export class GifListItem {
  imageUrl = input.required<string>(); // Signal, se lee con imageUrl()
}
```

En el template se usa **con paréntesis** (como cualquier Signal):
```html
<img [src]="imageUrl()" alt="" />
```

Al usar el componente desde el padre, la sintaxis es la misma de siempre:
```html
<!-- El padre le pasa el valor con property binding -->
<app-gif-list-item [imageUrl]="gif.url" />
```

### Variantes de `input()`

```typescript
// Requerido — Angular da error si el padre no lo pasa
imageUrl = input.required<string>();

// Opcional con valor por defecto
limit = input<number>(20);

// Opcional sin valor por defecto (puede ser undefined)
title = input<string>();
```

---

## 9. `ChangeDetectionStrategy.OnPush`

Por defecto, Angular verifica si la UI necesita actualizarse en muchos momentos (eventos, timers, peticiones HTTP). Con `OnPush` le decís: *"solo revisá este componente cuando cambie alguno de sus `input()` o algún Signal interno"*.

```typescript
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-gif-list-item',
  templateUrl: './gif-list-item.html',
  changeDetection: ChangeDetectionStrategy.OnPush, // ← solo re-renderiza cuando cambia imageUrl
})
export class GifListItem {
  imageUrl = input.required<string>();
}
```

**¿Cuándo usarlo?**  
En componentes **Dumb/Presentacionales** que solo reciben datos por `input()`. Como no tienen lógica propia, solo necesitan re-renderizarse cuando el padre les manda algo nuevo. `OnPush` mejora el rendimiento evitando verificaciones innecesarias.

> **Regla práctica:** Si el componente usa `input()` y no maneja eventos propios, agregale `OnPush`.

---

## Resumen del Bloque

| Concepto | Sintaxis / Elemento | Propósito |
|---|---|---|
| **Rutas Hijas** | `children: [ ... ]` | Anidar sub-rutas dentro de un padre común (`/padre/hijo`) |
| **Lazy Loading** | `loadComponent: () => import(...)` | Descargar el código del componente solo al navegar a él |
| **Export Default** | `export default class ...` | Simplificar la importación dinámica en `loadComponent` |
| **Router Outlet Anidado** | `<router-outlet>` dentro del padre | Permitir que el layout padre permanezca fijo mientras cambia el hijo |
| **Redirección** | `redirectTo: 'destino'` | Desviar al usuario a una ruta predeterminada |
| **Wildcard** | `path: '**'` | Atrapar rutas inexistentes (404 o fallback) |
| **Tailwind v4** | `@import 'tailwindcss';` | Sistema moderno de estilos atómicos en el CSS global |
| **Smart Component** | Inyecta servicios, maneja datos | Contenedor con lógica |
| **Dumb Component** | Solo recibe `input()` | Presentacional y reutilizable |
| **`input.required<T>()`** | Signal Input obligatorio | Reemplaza `@Input()`, es un Signal |
| **`OnPush`** | `changeDetection: ChangeDetectionStrategy.OnPush` | Optimiza re-renders en componentes presentacionales |

