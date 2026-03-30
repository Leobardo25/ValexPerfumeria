---
trigger: always_on
---

AntiGravity Project Rules: Valex Perfumería (React Architecture)
Instrucción General: Actúa como un Arquitecto de Software Senior con enfoque en Clean Code y escalabilidad. Cada línea de código generada debe seguir estrictamente esta estructura.

1. Arquitectura de Carpetas (Feature-Based)
Organiza el proyecto por funcionalidad, no por tipo de archivo. Estructura obligatoria:

src/components/ui/: Componentes atómicos y reutilizables (botones, inputs, modales).

src/components/layout/: Elementos estructurales (Navbar, Footer, Sidebar).

src/features/landing/: Componentes específicos de la página de inicio.

src/features/catalog/: Lógica y UI de la tienda y filtros de perfumes.

src/features/admin/: Panel de gestión y CRUDs (basado en lógica de administración).

src/hooks/: Lógica compartida extraída de los componentes.

src/services/: Capa de datos (Configuración de Firebase/API y llamadas fetch).

2. Reglas de Desarrollo (Clean Code)
Single Responsibility Principle (SRP): Ningún archivo debe superar las 120-150 líneas. Si un componente es más grande, divídelo en sub-componentes o extrae lógica a un Custom Hook.

Separación de Lógica: Prohibido tener lógica pesada dentro del JSX. Usa hooks para manejar estados y efectos.

Naming Conventions: * Componentes: PascalCase.jsx

Hooks: useCamelCase.js

Utilidades/Servicios: camelCase.js

Props Destructuring: Siempre desestructura las props en la firma del componente.

3. Identidad Visual y Estilo (Branding)
Cada componente debe respetar la paleta "Lujo Silencioso":

Colores: Negro Mate (#1A1A1B), Bronce Cepillado (#A68966), Gris Piedra (#D1D1D1), Blanco Hueso (#F5F5F5).

Tipografía: Títulos en Serif (Elegante/Autoridad) y cuerpo en Sans-Serif (Limpio/Minimalista).

UI: Bordes finos, sombras sutiles y mucho espacio en blanco (respiro visual).

4. Escalabilidad
No uses "hardcode" para textos o configuraciones. Centraliza constantes en src/constants/.

Prepara los componentes de la Landing para recibir datos vía props, anticipando la integración con el Panel de Administración.