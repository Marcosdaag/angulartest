# HTTP, HttpClient y RxJS en Angular

Resumen sobre cómo funcionan las peticiones HTTP, la diferencia entre `fetch` y `HttpClient`, el concepto de headers y body, y una introducción práctica a RxJS.

---

## 1. Anatomía de una Petición HTTP

Toda petición HTTP tiene dos partes: **headers** (el sobre) y **body** (la carta).

### Headers — Las instrucciones

Son **metadatos** que le dicen al servidor *cómo leer e interpretar* lo que le mandás. No son los datos en sí, son las indicaciones para procesarlos.

```http
Content-Type: application/json     → "Lo que te mando está en formato JSON"
Authorization: Bearer TOKEN123     → "Soy yo, estoy autenticado"
Accept-Language: es                → "Quiero la respuesta en español"
```

### Body — Los datos reales

Es el **contenido** que querés que el servidor procese o guarde.

```json
{
  "email": "marcos@mail.com",
  "password": "12345"
}
```

### La analogía de la carta

```
┌─────────────────────────────────────┐
│         SOBRE (Headers)             │
│  Content-Type: application/json     │ ← Cómo leer la carta
│  Authorization: Bearer token123     │ ← Quién la manda
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│          CARTA (Body)               │
│  { "nombre": "Marcos",             │ ← Lo que realmente
│    "email": "marcos@mail.com" }    │   querés enviar
└─────────────────────────────────────┘
```

### ¿Dónde van el token y los parámetros?

| Dato | Dónde va | Por qué |
|---|---|---|
| **Token de autenticación** | Header (`Authorization`) | Es una credencial de identidad, no un dato a guardar |
| **Tipo de contenido** | Header (`Content-Type`) | Es una instrucción de formato, no un dato |
| **Datos a crear/modificar** | Body | Son los datos que el servidor procesa |
| **Filtros y búsquedas** | URL (`?query=cats&limit=25`) | Son parámetros de consulta, no datos |

---

## 2. Flujo típico de una app con autenticación

```
1. POST /login
   Headers: Content-Type: application/json
   Body: { email, password }
   ↓ Servidor verifica → devuelve TOKEN

2. GET /mis-datos
   Headers: Authorization: Bearer TOKEN
   Body: (vacío — los GET no tienen body)
   ↓ Servidor lee el token → devuelve tus datos

3. POST /publicacion
   Headers: Authorization: Bearer TOKEN
   Headers: Content-Type: application/json
   Body: { titulo: "Hola", contenido: "Mundo" }
   ↓ Servidor verifica identidad → guarda la publicación
```

---

## 3. `fetch` (JavaScript nativo) vs `HttpClient` (Angular)

### `fetch` — Para cualquier framework o sin framework

```typescript
// GET — el método por defecto
const response = await fetch('https://api.giphy.com/v1/gifs/trending?api_key=ABC');
const data = await response.json();

// POST
const response = await fetch('https://api.ejemplo.com/usuarios', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',      // obligatorio
    'Authorization': 'Bearer mi-token'
  },
  body: JSON.stringify({ nombre: 'Marcos' }) // obligatorio convertir a string
});

// PUT, PATCH, DELETE — igual de arriba cambiando `method`
```

### `HttpClient` — Angular

```typescript
// Registrar en app.config.ts:
// providers: [provideHttpClient()]

import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

export class GifService {
  private http = inject(HttpClient);

  // GET
  getTrending() {
    return this.http.get<GiphyResponse>(url);
  }

  // POST — Angular serializa el objeto automáticamente
  crearUsuario(datos: Usuario) {
    return this.http.post<Usuario>(url, datos);
  }

  // PUT, PATCH, DELETE
  actualizarUsuario(id: number, datos: Partial<Usuario>) {
    return this.http.patch(`${url}/${id}`, datos);
  }
}
```

### Tabla comparativa

| Característica | `fetch` | `HttpClient` |
|---|---|---|
| **Devuelve** | `Promise` | `Observable` (RxJS) |
| **Serialización del body** | Manual (`JSON.stringify()`) | Automática |
| **Header Content-Type** | Manual (obligatorio en POST) | Automático |
| **Tipado genérico** | Manual | `http.get<MiTipo>(url)` |
| **Cancelar petición** | ❌ Complejo | ✅ `.unsubscribe()` |
| **Transformar respuesta** | Con `.then()` | Con operadores RxJS (`map`, `filter`) |
| **Interceptors globales** | No existe | ✅ Interceptors |
| **Testing** | Complejo de mockear | `HttpClientTestingModule` incluido |

---

## 4. RxJS — Reactive Extensions for JavaScript

RxJS es una librería para manejar **flujos de datos asíncronos**. Angular la usa como base de `HttpClient`.

### La idea central: Observable

Un Observable es un **flujo de datos** que puede emitir valores a lo largo del tiempo. Para recibir esos valores hay que **suscribirse**:

```typescript
// Una Promise: un único resultado, una vez
fetch(url).then(data => console.log(data));

// Un Observable: puede emitir valores en el tiempo
this.http.get(url).subscribe(data => console.log(data));
```

> **El Observable no hace nada hasta que alguien se suscribe.**
> ```typescript
> const obs = this.http.get(url); // ← No hace la petición aún
> obs.subscribe(data => ...);      // ← Ahora sí hace la petición
> ```

### El método `pipe()` y los operadores

La gracia de RxJS es **transformar los datos en el camino** usando operadores dentro de `pipe()`:

```typescript
getTrendingGifs() {
  return this.http.get<GiphyResponse>(url).pipe(

    map(response => response.data),    // extraer solo el array de gifs

    filter(gifs => gifs.length > 0),   // ignorar si viene vacío

    tap(gifs => console.log(gifs)),    // espiar sin modificar (debug)

    catchError(err => {                // manejar errores sin romper la app
      console.error(err);
      return of([]);                   // fallback: array vacío
    })

  );
}
```

### Operadores más usados en Angular

| Operador | Para qué |
|---|---|
| `map(fn)` | Transformar la respuesta (extraer `.data`, cambiar estructura) |
| `filter(fn)` | Descartar valores que no cumplan una condición |
| `tap(fn)` | Espiar el valor sin modificarlo (`console.log` sin efectos) |
| `catchError(fn)` | Manejar errores y devolver un valor alternativo |
| `switchMap(fn)` | Cancelar la petición anterior al llegar una nueva (buscador) |
| `debounceTime(ms)` | Esperar N milisegundos antes de ejecutar (búsqueda en tiempo real) |
| `of(valor)` | Crear un Observable que emite un valor fijo (útil en fallbacks) |

### La analogía de la cinta transportadora

```
Observable           pipe()               subscribe()
(grifo de datos)     (máquinas de proceso) (receptor final)

  API Giphy  ──► map(res => res.data) ──► filter(x > 0) ──► componente
               "Extrae el array"         "Solo si hay gifs"   "Recibe el array"
```

### `toSignal()` — RxJS + Signals (lo moderno)

Angular moderno permite convertir un Observable directamente en un Signal para no tener que manejar `.subscribe()` manualmente:

```typescript
import { toSignal } from '@angular/core/rxjs-interop';

export class TrendingComponent {
  private gifService = inject(GifService);

  // Se suscribe automáticamente y actualiza la UI cuando llegan datos
  gifs = toSignal(this.gifService.getTrendingGifs(), { initialValue: [] });
}
```

```html
<!-- En el template se usa como Signal normal -->
@for (gif of gifs(); track gif.id) {
  <app-gif-list-item [imageUrl]="gif.images.fixed_width.url" />
}
```

---

## Resumen del Bloque

| Concepto | Clave |
|---|---|
| **Headers** | Instrucciones para el servidor (formato, autenticación, idioma) |
| **Body** | Los datos reales que querés enviar (solo en POST, PUT, PATCH) |
| **Token de auth** | Siempre en el Header (`Authorization: Bearer TOKEN`) |
| **Query params** | En la URL (`?key=valor`) — filtros y búsquedas en GETs |
| **`fetch`** | Devuelve Promise, serialización manual, sin extras |
| **`HttpClient`** | Devuelve Observable, serialización automática, interceptors, tipado |
| **Observable** | Flujo de datos que se activa al suscribirse |
| **`pipe()`** | Cadena de operadores para transformar los datos |
| **`map()`** | El operador más usado — extrae y transforma la respuesta |
| **`toSignal()`** | Convierte un Observable en Signal para usarlo sin `.subscribe()` |
