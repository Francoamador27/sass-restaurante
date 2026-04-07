# Frontend — [Nombre del proyecto]

React + Vite. Consume API REST del backend Laravel en /backend.

## Comandos

- `npm run dev` — servidor local (puerto 5173)
- `npm run build` — build producción
- `npm install` — dependencias

## Estructura relevante

- `src/pages` — vistas principales
- `src/components` — componentes reutilizables
- `src/services` o `src/api` — llamadas al backend
- `src/context` o `src/store` — estado global

## Reglas

- Nunca hardcodear la URL del backend, usar variables de entorno
- Variables de entorno con prefijo VITE\_

```

---

## Paso siguiente

Una vez creados ambos archivos, abrí Claude Code y usá este prompt desde **cualquiera de los dos proyectos** (o desde ambos en sesiones separadas):
```

Tengo un workspace multi-root con dos proyectos: Laravel (backend API REST)
y React Vite (frontend). Ambos tienen su CLAUDE.md.

Analizá ambos proyectos completos y generá un archivo plan-multitenancy.md
en el backend con:

1. Estrategia de multitenancy para MySQL (tenant_id por tabla vs schema
   separado vs DB separada) con justificación según el proyecto actual
2. Cambios en Laravel: modelos, middlewares, autenticación, rutas
3. Cambios en React: resolución del tenant (subdominio, URL, header)
4. Lista exacta de archivos a modificar en cada proyecto
5. Fases de implementación ordenadas de menor a mayor riesgo

NO implementes nada. Solo el análisis y el plan.
