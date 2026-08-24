# Shortcuts de Visual Studio Code

Guía de atajos de teclado útiles para el desarrollo con TypeScript y Angular en VS Code.

---

## 🔤 Renombrar y refactorizar

### `F2` — Renombrar símbolo

Es uno de los atajos más poderosos. Renombra una variable, función, clase o interfaz **en todos los archivos del proyecto** donde se use, no solo en el archivo actual.

**¿Cómo funciona?**

VS Code usa el **Language Server** de TypeScript que analiza todas las referencias del símbolo en el proyecto. Al presionar `F2` sobre cualquier identificador:

1. Aparece un campo de texto para escribir el nuevo nombre
2. Al confirmar con `Enter`, renombra en **todos los archivos** donde ese símbolo sea referenciado

```
Antes → let hpPoints = 95;    (usado en 3 archivos)
F2 → renombrar a healthPoints
Después → let healthPoints = 95;  (actualizado en los 3 archivos)
```

> **¿Se extiende a todo el proyecto?**
> Sí. Siempre que los archivos estén dentro del mismo proyecto TypeScript (mismo `tsconfig.json`), `F2` encuentra y renombra **todas las referencias**, incluso en archivos que no tenés abiertos.

---

## 🔍 Navegación de código

| Shortcut | Acción |
|---|---|
| `F12` | **Ir a la definición** — Salta al archivo y línea donde se definió el símbolo |
| `Alt + F12` | **Ver definición sin saltar** — Muestra la definición en un panel flotante inline |
| `Shift + F12` | **Ver todas las referencias** — Lista todos los lugares donde se usa ese símbolo |
| `Ctrl + F12` | **Ir a la implementación** — Útil con interfaces: va a la clase que la implementa |
| `Ctrl + Click` | Igual que `F12`, navegar a la definición con el mouse |
| `Alt + ←` | **Volver atrás** — Regresa al lugar desde donde navegaste |
| `Alt + →` | **Ir adelante** — Avanza en el historial de navegación |
| `Ctrl + G` | **Ir a línea** — Escribe el número de línea y salta directo |
| `Ctrl + P` | **Buscar archivo** — Abre cualquier archivo del proyecto por nombre |
| `Ctrl + T` | **Buscar símbolo en el proyecto** — Busca variables, funciones, clases por nombre en todo el workspace |
| `Ctrl + Shift + O` | **Buscar símbolo en el archivo actual** — Igual pero solo en el archivo abierto |

---

## ✏️ Edición de código

| Shortcut | Acción |
|---|---|
| `Ctrl + D` | **Seleccionar la siguiente ocurrencia** del texto seleccionado (multicursor) |
| `Ctrl + Shift + L` | **Seleccionar todas las ocurrencias** del texto seleccionado a la vez |
| `Alt + Click` | **Agregar cursor** en múltiples posiciones (editar varias líneas simultáneamente) |
| `Ctrl + Alt + ↑ / ↓` | **Agregar cursor arriba/abajo** de la línea actual |
| `Alt + ↑ / ↓` | **Mover línea** hacia arriba o abajo |
| `Shift + Alt + ↑ / ↓` | **Duplicar línea** hacia arriba o abajo |
| `Ctrl + Shift + K` | **Eliminar línea** completa |
| `Ctrl + Enter` | **Insertar línea debajo** sin mover el cursor al final de la línea actual |
| `Ctrl + Shift + Enter` | **Insertar línea arriba** |
| `Ctrl + /` | **Comentar / descomentar** la línea o selección |
| `Shift + Alt + F` | **Formatear el documento** completo (auto-indentación, espacios, etc.) |
| `Ctrl + K, Ctrl + F` | **Formatear la selección** (solo el bloque seleccionado) |
| `Ctrl + Z` | **Deshacer** |
| `Ctrl + Y` | **Rehacer** |

---

## 🔎 Búsqueda y reemplazo

| Shortcut | Acción |
|---|---|
| `Ctrl + F` | **Buscar** en el archivo actual |
| `Ctrl + H` | **Buscar y reemplazar** en el archivo actual |
| `Ctrl + Shift + F` | **Buscar en todos los archivos** del proyecto |
| `Ctrl + Shift + H` | **Buscar y reemplazar en todos los archivos** del proyecto |

> **Diferencia clave entre `Ctrl+H` y `F2`:**
> - `Ctrl + H` hace una búsqueda de texto simple (busca el string tal cual, sin entender el código).
> - `F2` entiende el código: renombra solo el símbolo correcto, no cualquier texto que coincida por casualidad.
>
> Ejemplo: si tenés una variable `name` y un string `"name"`, `F2` solo renombra la variable. `Ctrl+H` reemplazaría ambas.

---

## 🧠 IntelliSense y ayudas del editor

| Shortcut | Acción |
|---|---|
| `Ctrl + Space` | **Activar autocompletado** manualmente |
| `Ctrl + .` | **Acciones rápidas / Quick Fix** — Muestra sugerencias para arreglar un error o importar algo |
| `F8` | **Ir al siguiente error o advertencia** del archivo |
| `Shift + F8` | **Ir al error anterior** |
| `Ctrl + Shift + M` | **Abrir panel de Problemas** — Lista todos los errores y warnings del proyecto |
| `Hover (pasar el mouse)` | Muestra el tipo inferido de una variable o la firma de una función |

---

## 🖥️ Interfaz y panel

| Shortcut | Acción |
|---|---|
| `Ctrl + B` | **Mostrar/ocultar barra lateral** (explorador de archivos) |
| `` Ctrl + ` `` | **Abrir/cerrar terminal integrada** |
| `` Ctrl + Shift + ` `` | **Nueva terminal** |
| `Ctrl + Shift + P` | **Paleta de comandos** — El shortcut más importante: permite ejecutar cualquier comando de VS Code por nombre |
| `Ctrl + ,` | **Abrir configuración** de VS Code |
| `Ctrl + K, Z` | **Zen Mode** — Pantalla completa sin distracciones |
| `Ctrl + \` | **Dividir el editor** en dos paneles |
| `Ctrl + W` | **Cerrar el tab** actual |
| `Ctrl + Shift + T` | **Reabrir el último tab cerrado** |
| `Ctrl + Tab` | **Navegar entre tabs** abiertos |

---

## 🔁 Flujo de trabajo típico con TypeScript/Angular

Combinando estos shortcuts, un flujo de trabajo eficiente se vería así:

```
1. Ctrl + P          → Buscar y abrir el archivo que necesito
2. Ctrl + T          → Buscar la función/clase/variable en el proyecto
3. F12               → Saltar a su definición
4. Shift + F12       → Ver todos los lugares donde se usa
5. F2                → Renombrarlo en todo el proyecto si es necesario
6. Ctrl + .          → Arreglar errores de importación automáticamente
7. Shift + Alt + F   → Formatear el archivo antes de commitear
8. F8                → Recorrer errores uno por uno
```

---

## Resumen rápido (cheat sheet)

| Categoría | Shortcut | Acción |
|---|---|---|
| Refactor | `F2` | Renombrar en todo el proyecto |
| Navegar | `F12` | Ir a definición |
| Navegar | `Shift + F12` | Ver referencias |
| Navegar | `Ctrl + P` | Abrir archivo |
| Editar | `Ctrl + D` | Seleccionar siguiente ocurrencia |
| Editar | `Alt + ↑↓` | Mover línea |
| Editar | `Ctrl + /` | Comentar línea |
| Editar | `Shift + Alt + F` | Formatear documento |
| Buscar | `Ctrl + Shift + F` | Buscar en todo el proyecto |
| Ayuda | `Ctrl + .` | Quick Fix |
| Ayuda | `F8` | Ir al siguiente error |
| Panel | `Ctrl + Shift + P` | Paleta de comandos |
| Panel | `` Ctrl + ` `` | Terminal integrada |
