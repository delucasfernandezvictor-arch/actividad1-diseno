# SmartLab Monitor — Ionic React + TypeScript + Tailwind CSS

Proyecto base para el módulo **Desarrollo de Interfaces (Código 0488)** — 2.º CFGS DAM (Comunidad de Madrid).

## Estructura del Proyecto

- `src/pages/Home.tsx`: Vista principal con cabecera reactiva, Pull-to-Refresh, KPIs en Tailwind Grid, búsqueda y filtrado segmentado, lista con gestos laterales (`IonItemSliding`), modal de alta (`IonModal`), botón flotante (`IonFab`) y notificaciones (`IonToast`).
- `src/types/incident.ts`: Definición estricta de interfaces y tipos de dominio en TypeScript.
- `src/theme/variables.css`: Directivas `@tailwind` y variables CSS de personalización para Shadow DOM de Ionic.
- `Dockerfile` y `nginx.conf`: Empaquetado multietapa listo para despliegue en contenedor.

## Puesta en Marcha Local (Node.js >= 20 LTS)

```bash
npm install
npm run dev
```

## Compilación de Producción

```bash
npm run build
```

## Despliegue en Contenedor Docker

```bash
docker build -t smartlab-ionic-tw:1.0 .
docker run -d -p 8080:80 --name smartlab-container smartlab-ionic-tw:1.0
```

## Mejoras implementadas (apartado 3 de la guía)

| Requisito | Dónde está |
|---|---|
| 1. Modularización (sin `any`) | `src/components/KpiCard.tsx`, `src/components/IncidentItem.tsx` (interfaces `KpiCardProps`, `IncidentItemProps`) |
| 2. Persistencia con Custom Hook | `src/hooks/useIncidentsStorage.ts` (localStorage) + `src/context/IncidentsContext.tsx` para compartir una sola instancia entre páginas |
| 3. Vista de detalle `/incident/:id` | `src/pages/IncidentDetail.tsx` con `<IonBackButton defaultHref="/home" />` y edición de la descripción; ruta registrada en `src/App.tsx` |
| 4. Accesibilidad y responsive | Textos `slate-400`/`blue-100` cambiados a tonos con contraste ≥ 4.5:1; botón de estado nativo (teclado + 44×44 px); `aria-label` en acciones deslizables y botones; segmento desplazable en 360 px |
| 5. Docker | `Dockerfile` multietapa con `npm ci` (se incluye `package-lock.json`) + `nginx.conf` con fallback SPA para que `/incident/:id` funcione al recargar |

### Verificación (capturas para la entrega)
1. `npm install && npm run dev` → Chrome DevTools, modo dispositivo **360×800** y **1280×800**: sin scroll horizontal.
2. Lighthouse → Accesibilidad (contraste).
3. Abrir el modal con el botón `+` y recorrerlo solo con `Tab` / `Enter`.
4. Crear, resolver, editar y borrar incidencias → recargar (F5) → los cambios siguen.
5. `docker build -t smartlab-ionic-tw:1.0 .` y `docker run -d -p 8080:80 --name smartlab-container smartlab-ionic-tw:1.0` → http://localhost:8080

## Estilo, interacciones y layout (añadido por el profesor)

**Neo-brutalismo** (`tailwind.config.js` + `src/theme/variables.css`)
- Paleta plana `brutal-*` (amarillo, rosa, verde, rojo, azul) + negro puro; fondo crema `#FFFBEA`.
- Bordes negros de 3 px, esquinas rectas (`--border-radius: 0`) y sombras duras sin desenfoque (`shadow-brutal`, `shadow-brutal-lg`).
- Tipografía gruesa (`font-black`, mayúsculas) y etiquetas tipo bloque (ID en negro/amarillo, prioridad con color plano).
- Componentes Ionic (Shadow DOM) estilados con CSS Custom Properties: `.brutal-search`, `.brutal-segment`, `.brutal-field`, `.brutal-ion-btn`, `.brutal-fab`, `.brutal-modal`.

**Interacciones**
- Clase `.brutal-interactive`: hover = la pieza "se levanta" (translate + sombra grande); active = "se hunde" (translate + sin sombra).
- Foco visible con teclado (`focus-visible:ring-4`), campos que se elevan al enfocarlos (`:focus-within`).
- FAB cuyo icono `+` gira 90° al pasar el ratón; animación `animate-pop` al aparecer cada incidencia.
- `aria-pressed` en el botón de estado; `prefers-reduced-motion` desactiva animaciones.

**Layout con vh**
- Contenedor principal: `min-h-[calc(100vh-56px)]` (altura visible menos la cabecera) en Home y en Ficha.
- Espaciados verticales en vh: `pt-[3vh]`, `mb-[4vh]`, `pb-[12vh]`.
- Rejilla KPI: `min-h-[26vh]` en móvil y `md:min-h-[18vh]` en escritorio con `auto-rows-fr`.
- Estado vacío: `min-h-[35vh]`; formulario del modal: `min-h-[70vh]` con botón anclado abajo (`mt-auto`).
- Modal: `--height: 100vh` en móvil y `85vh` en escritorio; ficha técnica `min-h-[70vh]`.
