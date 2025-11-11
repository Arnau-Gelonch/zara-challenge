# Zara Challenge

Aplicación web de e-commerce desarrollada con React, TypeScript y Vite.

## 🔗 Enlaces

- **Código fuente**: [https://github.com/Arnau-Gelonch/zara-challenge](https://github.com/Arnau-Gelonch/zara-challenge)
- **Demo en vivo**: [https://arnau-gelonch.github.io/zara-challenge/](https://arnau-gelonch.github.io/zara-challenge/)

## 🚀 Inicio Rápidoa Challenge

Aplicación web de e-commerce desarrollada con React, TypeScript y Vite.

## � Inicio Rápido

### Instalación y Ejecución

```bash
# Clonar e instalar
git clone <repository-url>
cd zara-challenge
pnpm install

# Iniciar desarrollo
pnpm dev
```

La aplicación estará disponible en `http://localhost:5173`

### Scripts Principales

```bash
pnpm dev              # Servidor de desarrollo
pnpm build            # Build de producción
pnpm test             # Ejecutar tests
pnpm test:coverage    # Tests con cobertura
pnpm lint             # Linting con ESLint
pnpm format           # Formatear código
```

## ✨ Características

- 🛍️ Lista de productos con búsqueda en tiempo real
- 📱 Detalle de producto con selección de color y almacenamiento
- 🛒 Carrito de compras con persistencia en localStorage
- 📊 Productos similares
- 🎨 Diseño responsive (desktop, tablet, mobile)
- ⚡ Optimización con React Query
- 🧪 Cobertura completa de tests

## � Stack Tecnológico

- **React 19** + **TypeScript** + **Vite**
- **TanStack Query** - Gestión de estado del servidor
- **React Router DOM** - Enrutamiento
- **Axios** - Cliente HTTP
- **CSS Modules** - Estilos
- **Jest** + **React Testing Library** - Testing
- **ESLint** + **Prettier** - Calidad de código
- **Husky** + **Commitlint** - Git hooks

## 🏗 Arquitectura

### Gestión de Estado

- **Estado del Cliente** (Context + localStorage): Carrito de compras

### Estructura de Carpetas

```
src/
├── assets/          # Iconos SVG
├── components/      # Componentes reutilizables + tests
├── context/         # Context API (CartContext)
├── hooks/           # Custom hooks (useProducts, useProduct)
├── pages/           # Páginas (ProductList, ProductDetail, Cart)
├── plugins/         # Providers (TanStackProvider)
├── services/        # Servicios de API
├── types/           # Tipos TypeScript
├── utils/           # Utilidades (axios config)
├── App.tsx
└── main.tsx
```

## 🧪 Testing

Tests completos con Jest y React Testing Library:

```bash
pnpm test                    # Todos los tests
pnpm test:watch              # Modo watch
pnpm test:coverage           # Con cobertura
```

**Cobertura**: Componentes, páginas, hooks, context, services y utils testeados.

## 🔄 CI/CD

### Pipeline Automatizado

El proyecto implementa un pipeline de CI/CD con **GitHub Actions** que se ejecuta automáticamente:

- **Despliegue automático**: Cada commit a la rama `master` despliega la aplicación a GitHub Pages
- **URL de producción**: [https://arnau-gelonch.github.io/zara-challenge/](https://arnau-gelonch.github.io/zara-challenge/)

### Git Hooks (Pre-commit)

Cada commit ejecuta automáticamente mediante **Husky**:

1. ✅ **ESLint** - Verifica calidad del código
2. ✅ **Prettier** - Formatea el código automáticamente
3. ✅ **Tests** - Ejecuta todos los tests
4. ✅ **Commitlint** - Valida el mensaje del commit

Esto garantiza que todo el código que llega al repositorio cumple con los estándares de calidad.

## 🔐 Variables de Entorno

Crear `.env`:

```env
VITE_API_URL=https://backend.example.com
VITE_API_KEY=your_api_key
```

## 📝 Convenciones

### Código

- Componentes funcionales con TypeScript
- CSS Modules para estilos
- Interfaces explícitas para props
- Custom hooks con prefijo `use`

### Commits (Commitlint)

```
feat: nueva característica
fix: corrección de bug
docs: documentación
test: tests
refactor: refactorización
```

## 👨‍💻 Autor

Arnau Gelonch
