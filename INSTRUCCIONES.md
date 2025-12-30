# 🚀 Contadoria Frontend - Sistema de Gestión

Sistema de gestión contable construido con Angular 19+ y la plantilla SB Admin Pro.

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- npm o yarn
- Angular CLI (`npm install -g @angular/cli`)

## 🛠️ Instalación

1. **Clonar el repositorio** (si aplica)
```bash
git clone <url-del-repositorio>
cd contadoria_frontend
```

2. **Instalar dependencias**
```bash
npm install
```

## 🎨 Configuración de Plantilla SB Admin Pro

### Importante: Estilos y Assets

Los archivos CSS y JS actualmente tienen contenido básico de placeholder. Para obtener la experiencia completa de la plantilla:

1. **Copiar archivos de la plantilla SB Admin Pro:**
   - Copia `dist/css/styles.css` → `public/assets/css/styles.css`
   - Copia `dist/js/scripts.js` → `public/assets/js/scripts.js`
   - Copia todas las imágenes de `dist/assets/img/` → `public/assets/img/`

2. **Alternativa:** Los archivos placeholder funcionan pero con estilos limitados.

## 🚀 Comandos para Correr el Proyecto

### Desarrollo
```bash
# Iniciar servidor de desarrollo
npm start
# o
ng serve

# El proyecto estará disponible en: http://localhost:4200
```

### Producción
```bash
# Construir para producción
npm run build
# o
ng build --configuration production

# Los archivos compilados estarán en dist/
```

### Tests
```bash
# Ejecutar tests unitarios
npm test
# o
ng test

# Ejecutar tests con cobertura
ng test --code-coverage
```

## 📁 Estructura del Proyecto

```
contadoria_frontend/
├── src/
│   ├── core/                          # Módulo core de la aplicación
│   │   ├── components/                # Componentes compartidos del core
│   │   │   ├── navbar/               # Barra de navegación superior
│   │   │   ├── sidebar/              # Menú lateral
│   │   │   └── footer/               # Pie de página
│   │   ├── layouts/                   # Layouts de la aplicación
│   │   │   └── admin-layout/         # Layout principal con navbar + sidebar
│   │   ├── pages/                     # Páginas principales
│   │   │   ├── dashboard/            # Dashboard principal
│   │   │   └── not-found/            # Página 404
│   │   ├── guards/                    # Guards de rutas
│   │   ├── interceptors/             # HTTP Interceptors
│   │   ├── services/                 # Servicios del core
│   │   └── core.routes.ts            # Rutas del módulo core
│   │
│   ├── modules/                       # Módulos de características
│   │   └── users/                    # Módulo de usuarios
│   │       ├── components/           # Componentes del módulo
│   │       ├── pages/                # Páginas del módulo
│   │       ├── services/             # Servicios del módulo
│   │       ├── models/               # Modelos de datos
│   │       ├── store/                # Estado (NgRx/Signals)
│   │       └── users.routes.ts       # Rutas del módulo
│   │
│   ├── shared/                        # Recursos compartidos
│   │   ├── components/               # Componentes reutilizables
│   │   ├── services/                 # Servicios compartidos
│   │   ├── models/                   # Modelos compartidos
│   │   └── utils/                    # Utilidades
│   │
│   ├── app.component.ts              # Componente raíz
│   ├── app.routes.ts                 # Rutas principales
│   ├── index.html                    # HTML principal
│   └── styles.css                    # Estilos globales
│
├── public/                            # Archivos públicos (assets)
│   └── assets/
│       ├── css/                      # Estilos de la plantilla
│       ├── js/                       # Scripts de la plantilla
│       └── img/                      # Imágenes
│
├── angular.json                       # Configuración de Angular
├── package.json                       # Dependencias del proyecto
├── tsconfig.json                      # Configuración de TypeScript
└── README.md                          # Este archivo
```

## 🏗️ Arquitectura

El proyecto sigue una **arquitectura hexagonal/modular**:

### Core Module
- Contiene componentes y servicios esenciales
- Layout principal (navbar, sidebar, footer)
- Páginas comunes (dashboard, 404)
- Guards, interceptors y configuración global

### Feature Modules (modules/)
- Módulos independientes por característica
- Cada módulo es auto-contenido con sus propios:
  - Componentes
  - Servicios
  - Modelos
  - Rutas
  - Estado (opcional)

### Shared Module
- Recursos reutilizables entre módulos
- Componentes, directivas, pipes comunes
- Utilidades y helpers

## 🎯 Rutas Principales

```typescript
/                    → Dashboard principal
/users               → Módulo de usuarios
/404                 → Página no encontrada
```

## 🔧 Componentes Principales

### AdminLayoutComponent
Layout principal que incluye:
- Navbar superior (NavbarComponent)
- Sidebar lateral (SidebarComponent)
- Área de contenido (router-outlet)
- Footer (FooterComponent)

### NavbarComponent
- Barra de navegación superior
- Botón toggle para sidebar
- Búsqueda
- Notificaciones
- Perfil de usuario

### SidebarComponent
- Menú de navegación lateral
- Acordeones desplegables
- Enlaces a diferentes módulos
- Responsive (se oculta en móvil)

### DashboardComponent
- Dashboard principal con estadísticas
- Tarjetas con métricas
- Tablas de resumen
- Router outlet para rutas anidadas

## 🎨 Personalización

### Cambiar colores
Edita las variables CSS en `public/assets/css/styles.css` o copia el archivo completo de la plantilla SB Admin Pro.

### Agregar nuevos módulos
```bash
# Crear estructura de módulo
mkdir -p src/modules/nuevo-modulo/{components,pages,services,models,store}

# Crear archivo de rutas
touch src/modules/nuevo-modulo/nuevo-modulo.routes.ts
```

### Agregar al sidebar
Edita `src/core/components/sidebar/sidebar.component.html` y agrega tu nuevo enlace.

## 📦 Dependencias Principales

- **Angular 19+**: Framework principal
- **Bootstrap 5.2.3**: Framework CSS
- **Font Awesome 6.3.0**: Iconos
- **Feather Icons 4.29.0**: Iconos adicionales
- **RxJS**: Programación reactiva
- **TypeScript 5+**: Lenguaje de programación

## 🔒 Seguridad

- Implementa guards para rutas protegidas en `src/core/guards/`
- Usa interceptors para manejo de tokens en `src/core/interceptors/`
- Valida datos en formularios

## 📝 Notas Adicionales

### Standalone Components
Este proyecto usa **Standalone Components** de Angular (sin NgModules), aprovechando las últimas características de Angular 19.

### Lazy Loading
Los módulos de características se cargan de forma lazy para mejor performance.

### Feather Icons
Los iconos Feather se inicializan en `ngAfterViewInit()` de cada componente que los usa.

## 🐛 Solución de Problemas

### Los estilos no se ven correctamente
1. Verifica que `public/assets/css/styles.css` existe
2. Copia el archivo completo de la plantilla SB Admin Pro
3. Reinicia el servidor de desarrollo

### El sidebar no funciona
1. Verifica que Bootstrap JS esté cargado
2. Verifica que `scripts.js` esté en `public/assets/js/`
3. Revisa la consola del navegador por errores

### Error 404 en assets
Angular en desarrollo sirve archivos desde `public/`. Asegúrate de que tus assets estén en esa carpeta.

## 📞 Soporte

Para problemas o preguntas, por favor crea un issue en el repositorio.

## 📄 Licencia

Este proyecto usa la plantilla SB Admin Pro. Asegúrate de tener la licencia correspondiente.

---

**¡Feliz codificación! 🎉**
