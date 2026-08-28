# Environments y Path Aliases en Angular

Resumen sobre el manejo de variables de entorno en Angular, configuración de alias de rutas (*Path Aliases*) en TypeScript y la diferencia fundamental entre los `environments` de Angular y los archivos `.env` tradicionales.

---

## 1. Environments en Angular

Los **environments** permiten manejar diferentes configuraciones según el entorno en el que se ejecuta la aplicación (desarrollo local, pruebas, producción).

### Generación automática
En versiones modernas de Angular se generan con el comando CLI:

```bash
ng generate environments
# o abreviado:
ng g environments
```

Esto crea la carpeta `src/environments/` con dos archivos base:

1. **`environment.ts`**: Configuración para **producción** (por defecto).
2. **`environment.development.ts`**: Configuración para **desarrollo local**.

---

### Ejemplo de configuración

```typescript
// src/environments/environment.development.ts (Desarrollo)
export const environment = {
  production: false,
  companyName: 'Gifs',
  companyName2: 'App',
  companySlogan: 'Maneja tus gifs',
  apiUrl: 'http://localhost:3000/api',
  giphyApiKey: 'CLAVE_DEV_PUBLICA'
};
```

```typescript
// src/environments/environment.ts (Producción)
export const environment = {
  production: true,
  companyName: 'Gifs',
  companyName2: 'App',
  companySlogan: 'Maneja tus gifs',
  apiUrl: 'https://api.midominio.com/api',
  giphyApiKey: 'CLAVE_PROD_PUBLICA'
};
```

---

## 2. ¿Cómo sabe Angular cuál archivo usar? (`fileReplacements`)

Al ejecutar `ng g environments`, el Angular CLI actualiza automáticamente `angular.json` en la sección `build > configurations > development`:

```json
"development": {
  "optimization": false,
  "extractLicenses": false,
  "sourceMap": true,
  "fileReplacements": [
    {
      "replace": "src/environments/environment.ts",
      "with": "src/environments/environment.development.ts"
    }
  ]
}
```

### El truco del reemplazo en tiempo de compilación (*Build Time*):
1. En tu código TypeScript siempre importas desde el archivo base:
   ```typescript
   import { environment } from '@environments/environment';
   ```
2. Cuando ejecutas `ng serve` (modo desarrollo), Angular detecta la regla `fileReplacements` y **sustituye físicamente** el contenido de `environment.ts` por el de `environment.development.ts`.
3. Cuando ejecutas `ng build` (producción), Angular compila directamente con `environment.ts`.

---

## 3. Path Aliases en TypeScript (`tsconfig.json`)

### El problema de las rutas relativas
Sin alias, si un componente está muy anidado en carpetas, la importación se vuelve fea y frágil:

```typescript
// ❌ Difícil de leer y se rompe si mueves el archivo
import { environment } from '../../../../environments/environment';
```

### La solución moderna: `paths` en `tsconfig.json` (sin `baseUrl`)
En versiones modernas de TypeScript, la opción `baseUrl` está obsoleta (*deprecated*). La forma recomendada es definir `paths` directamente con rutas relativas con `./`:

```json
{
  "compilerOptions": {
    "paths": {
      "@environments/*": ["./src/environments/*"]
    }
  }
}
```

### Uso en tus componentes:
```typescript
// ✅ Limpio, elegante y funciona sin importar dónde esté el componente
import { environment } from '@environments/environment';

@Component({
  selector: 'app-side-menu-header',
  imports: [],
  templateUrl: './side-menu-header.html',
})
export class SideMenuHeader {
  envs = environment; // Disponible para el template HTML
}
```

En el HTML:
```html
<h1 class="text-2xl font-bold text-white">
  {{ envs.companyName }}<span class="text-blue-500">{{ envs.companyName2 }}</span>
</h1>
<p class="text-slate-500 text-sm">{{ envs.companySlogan }}</p>
```

---

## 4. Diferencia fundamental: Angular `environment.ts` vs archivos `.env`

Esta es una de las dudas más frecuentes y críticas en desarrollo web.

| Característica | `environment.ts` (Angular) | `.env` (Backend / Node.js / Spring) |
|---|---|---|
| **¿Dónde vive?** | En el **Frontend** (navegador del usuario) | En el **Servidor** (servidor privado / backend) |
| **¿Cuándo se resuelve?** | En **Build time** (al compilar) | En **Runtime** (al arrancar el servidor) |
| **Visibilidad** | **100% PÚBLICO**. El bundle JS se descarga en el navegador | **PRIVADO**. Solo el servidor tiene acceso |
| **¿Para qué sirve?** | URLs de APIs públicas, nombres, flags (`production: true`), títulos | Contraseñas de bases de datos, claves secretas (`JWT_SECRET`, Stripe Secret Key) |
| **Modificación** | Requiere recompilar la app (`ng build`) | Modificas el archivo y reinicias el servidor |

---

### ⚠️ Regla de Oro de Seguridad

> **NUNCA, BAJO NINGUNA CIRCUNSTANCIA, pongas claves secretas o privadas en `environment.ts` de Angular.**
>
> Aunque se llame "environment", Angular es una aplicación que corre en la computadora del usuario. Cualquier persona puede presionar `F12` en Chrome, abrir la pestaña *Sources*, buscar el archivo `.js` y leer todo el contenido de tu `environment.ts`.
>
> Las claves secretas (acceso a base de datos, API Keys que cobran dinero por petición, tokens de administrador) deben vivir **exclusivamente en el backend dentro de archivos `.env`**.

---

## Resumen del Bloque

| Concepto | Utilidad |
|---|---|
| **`ng g environments`** | Genera la infraestructura de variables para dev y prod |
| **`fileReplacements`** | Regla en `angular.json` que sustituye el archivo de entorno según el target de build |
| **`tsconfig.json > paths`** | Permite crear alias como `@environments/*` para evitar `../../..` |
| **`environment.ts`** | Contiene configuraciones públicas para el cliente web |
| **`.env`** | Variables privadas de servidor que jamás deben exponerse al cliente |
