# `viewChild`, Scroll Infinito y Preservación de Estado de Scroll

Resumen de la **Sección 8** del curso: cómo tomar referencias del DOM con `viewChild`, detectar el final de un scroll con métricas del navegador, implementar scroll infinito con paginación acumulativa (`offset`) y preservar la posición del scroll al navegar entre rutas.

---

## 1. El Problema: Pérdida del Scroll al Navegar

En aplicaciones SPA (Single Page Application) con Angular:
1. Cuando entras a `/dashboard/trending`, Angular monta el componente `Trending`.
2. Haces scroll hasta el elemento 100.
3. Haces clic en el menú y navegas a `/dashboard/search`.
4. Angular **destruye** el componente `Trending` y limpia su HTML del DOM.
5. Si regresas a `/dashboard/trending`, Angular crea una **nueva instancia** de `Trending`, renderiza el DOM desde cero y el scroll vuelve a estar arriba (`scrollTop = 0`).

### La Solución: Un Servicio Singleton (`ScrollStateService`)

Los componentes en Angular tienen un ciclo de vida efímero (nacen y mueren con las rutas), pero los **servicios provistos en `'root'` son singletons** que viven durante toda la ejecución de la aplicación.

```typescript
// src/app/shared/services/scroll-state.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScrollStateService {
  trendingScrollState = signal(0);
}
```

Cada vez que el usuario scrollea, actualizamos el signal con la posición actual (`scrollTop`). Al regresar a la página, leemos ese valor y se lo reasignamos al elemento del DOM.

---

## 2. Tomar Referencias del DOM: `viewChild` vs `@ViewChild`

### Enfoque Antiguo (`@ViewChild`)
Históricamente en Angular se usaba el decorador `@ViewChild`:
```typescript
@ViewChild('groupDiv') scrollDivRef!: ElementRef<HTMLDivElement>;
```
Requería manejar signos de exclamación (`!`), no era reactivo y dependía fuertemente de ciclos de vida tradicionales.

### Enfoque Moderno (`viewChild` con Signals)
En Angular moderno (Angular 17.2+ en adelante), Angular introdujo la función `viewChild()` basada en Signals:

```typescript
// src/app/gifs/pages/trending/trending.ts
import { ElementRef, viewChild } from '@angular/core';

export default class Trending {
  // Retorna un Signal<ElementRef<HTMLDivElement> | undefined>
  scrollDivRef = viewChild<ElementRef<HTMLDivElement>>('groupDiv');
}
```

En la plantilla HTML:
```html
<div #groupDiv (scroll)="onScroll($event)">
  <!-- Contenido -->
</div>
```

* `#groupDiv` es una **variable de referencia de plantilla**.
* `viewChild('groupDiv')` busca en la vista el elemento con esa referencia y lo envuelve en una Signal.
* Para acceder al nodo real del DOM en TypeScript:
  ```typescript
  const element = this.scrollDivRef()?.nativeElement;
  ```

---

## 3. Ciclo de Vida: `AfterViewInit` y Restauración

No podemos manipular el DOM en el `constructor` porque los elementos HTML aún no existen en memoria. Debemos esperar a que la vista inicialice mediante la interfaz `AfterViewInit`:

```typescript
export default class Trending implements AfterViewInit {
  scrollStateService = inject(ScrollStateService);
  scrollDivRef = viewChild<ElementRef<HTMLDivElement>>('groupDiv');

  ngAfterViewInit(): void {
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    if (!scrollDiv) return;

    // Restauramos la posición guardada en el servicio
    scrollDiv.scrollTop = this.scrollStateService.trendingScrollState();
  }
}
```

---

## 4. Detección del Fin de Scroll

Para saber cuándo el usuario llegó (o está cerca de llegar) al fondo del contenedor, comparamos tres propiedades del elemento HTML:

```
┌──────────────────────────────────────────────┐ ◄── Top del elemento
│                                              │
│               scrollTop                      │ (Píxeles scrolleados hacia abajo)
│                                              │
├──────────────────────────────────────────────┤ ◄── Área visible en pantalla
│                                              │
│              clientHeight                    │ (Altura visible del contenedor)
│                                              │
├──────────────────────────────────────────────┤ ◄── Fondo visible
│                  + 300px (Umbral)            │
└──────────────────────────────────────────────┘ ◄── scrollHeight (Altura total)
```

1. **`scrollTop`**: Cuántos píxeles de contenido ya pasaron hacia arriba.
2. **`clientHeight`**: La altura visible actual de la ventana o caja.
3. **`scrollHeight`**: La altura total de todo el contenido interno (visible + oculto).

### La Fórmula
```typescript
const isAtBottom = scrollTop + clientHeight + 300 >= scrollHeight;
```

> **¿Por qué sumar 300px?**
> Si esperamos a que `scrollTop + clientHeight === scrollHeight`, la nueva petición recién se dispararía cuando el usuario choque contra el fondo. Con un margen de anticipación (`+ 300`), los nuevos elementos se cargan antes de que el usuario note una pausa o salto en la navegación.

---

## 5. Scroll Infinito y Paginación en `GifService`

### Manejo de Estados con Signals
```typescript
trendingGifs = signal<Gif[]>([]);
trendingGifsLoading = signal(false);
private trendingPage = signal(0);
```

### Petición con `offset` y Acumulación
En lugar de sustituir el arreglo con `.set()`, acumulamos los nuevos GIFs con `.update()`:

```typescript
loadTrendingGifs() {
  // Evita disparar múltiples peticiones simultáneas si ya hay una cargando
  if (this.trendingGifsLoading()) return;

  this.trendingGifsLoading.set(true);

  this.http.get<GiphyResponse>(`${environment.apiUrl}/gifs/trending`, {
    params: {
      api_key: environment.gifApiKey,
      limit: 20,
      offset: this.trendingPage() * 20, // Página 0 -> offset 0; Página 1 -> offset 20; etc.
    },
  }).subscribe((resp) => {
    const gifs = GifMapper.mapGiphyItemToGifArray(resp.data);
    
    // Acumula los gifs existentes con los nuevos
    this.trendingGifs.update((currentGifs) => [...currentGifs, ...gifs]);
    
    // Incrementa la página para el próximo scroll
    this.trendingPage.update((page) => page + 1);
    
    this.trendingGifsLoading.set(false);
  });
}
```

---

## 6. Grilla de Columnas (Layout Tipo Masonry) con `computed`

Para mostrar los GIFs en columnas verticales organizadas, se usa un `computed` que transforma el arreglo plano `Gif[]` en una matriz `Gif[][]` dividida en bloques de 3:

```typescript
trendingGifGroup = computed<Gif[][]>(() => {
  const groups = [];
  for (let i = 0; i < this.trendingGifs().length; i += 3) {
    groups.push(this.trendingGifs().slice(i, i + 3));
  }
  return groups; // [ [g1, g2, g3], [g4, g5, g6], ... ]
});
```

En la plantilla se recorre con `@for` anidado:
* El `@for` externo crea cada columna en el grid (`grid-cols-2 md:grid-cols-4`).
* El `@for` interno apila los GIFs de esa columna con espacio vertical (`grid gap-4`).
