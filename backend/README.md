# TODO App Backend

Backend API para la aplicación de gestión de tareas (TODO) construida con Node.js, TypeScript, Express y arquitectura MVC.

## 📋 Características

- **Arquitectura MVC**: Separación clara de responsabilidades
- **TypeScript**: Tipado estático para mayor seguridad
- **Validación**: Validación de datos con Zod
- **Logging**: Sistema de logs con Winston
- **Testing**: Tests unitarios con Jest
- **CORS**: Configurado para desarrollo y producción
- **Persistencia**: Almacenamiento local en JSON
- **RESTful API**: Endpoints siguiendo convenciones REST

## 🛠️ Tecnologías

- **Node.js** >= 20
- **TypeScript** 5.x
- **Express** 5.x
- **Zod** para validación
- **Winston** para logging
- **Jest** para testing
- **UUID** para generación de IDs

## 🚀 Instalación y Configuración

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
```

Editar `.env` con tus configuraciones:
```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
LOG_LEVEL=info
```

### 3. Compilar TypeScript
```bash
npm run build
```

### 4. Ejecutar en desarrollo
```bash
npm run dev
```

### 5. Ejecutar en producción
```bash
npm start
```

## 📚 Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo con hot reload
- `npm run build` - Compilar TypeScript a JavaScript
- `npm start` - Ejecutar versión compilada
- `npm test` - Ejecutar tests unitarios
- `npm run test:watch` - Ejecutar tests en modo watch
- `npm run test:coverage` - Ejecutar tests con reporte de cobertura

## 🗂️ Estructura del Proyecto

```
src/
├── controllers/     # Controladores (lógica de endpoints)
├── models/         # Modelos de datos
├── routes/         # Definición de rutas
├── services/       # Lógica de negocio
├── middleware/     # Middlewares personalizados
├── utils/          # Utilidades y validaciones
├── types/          # Definiciones de tipos TypeScript
├── data/           # Archivos de datos JSON
├── __tests__/      # Tests unitarios
└── index.ts        # Punto de entrada de la aplicación
```

## 🔌 API Endpoints

### Base URL: `http://localhost:3000/api`

#### Tareas
- `GET /tasks` - Obtener todas las tareas con filtros y paginación
- `GET /tasks/:id` - Obtener tarea por ID
- `POST /tasks` - Crear nueva tarea
- `PUT /tasks/:id` - Actualizar tarea
- `DELETE /tasks/:id` - Eliminar tarea
- `DELETE /tasks` - Eliminar todas las tareas completadas

#### Estadísticas
- `GET /tasks/stats` - Obtener estadísticas de tareas

#### Salud
- `GET /health` - Verificar estado de la API

## 📊 Filtros y Paginación

### Parámetros de consulta disponibles:

- `page` - Número de página (default: 1)
- `limit` - Elementos por página (default: 10)
- `completed` - Filtrar por estado de completado (true/false)
- `priority` - Filtrar por prioridad (low/medium/high)
- `search` - Buscar en título y descripción
- `dueDateFrom` - Fecha mínima de vencimiento (ISO string)
- `dueDateTo` - Fecha máxima de vencimiento (ISO string)

### Ejemplo:
```
GET /api/tasks?page=1&limit=5&completed=false&priority=high&search=importante
```

## 📝 Esquemas de Datos

### Task (Tarea)
```typescript
{
  id: string;              // UUID generado automáticamente
  title: string;           // Título de la tarea (requerido)
  description?: string;    // Descripción opcional
  completed: boolean;      // Estado de completado
  priority: 'low' | 'medium' | 'high'; // Prioridad
  dueDate?: string;        // Fecha de vencimiento (ISO string)
  createdAt: string;       // Fecha de creación (ISO string)
  updatedAt: string;       // Fecha de última actualización (ISO string)
}
```

### Crear Tarea
```typescript
{
  title: string;           // Requerido, máx. 255 caracteres
  description?: string;    // Opcional, máx. 1000 caracteres
  priority?: 'low' | 'medium' | 'high'; // Opcional, default: 'medium'
  dueDate?: string;        // Opcional, formato ISO datetime
}
```

### Actualizar Tarea
```typescript
{
  title?: string;          // Opcional, máx. 255 caracteres
  description?: string;    // Opcional, máx. 1000 caracteres
  completed?: boolean;     // Opcional
  priority?: 'low' | 'medium' | 'high'; // Opcional
  dueDate?: string;        // Opcional, formato ISO datetime
}
```

## 🧪 Testing

Los tests están ubicados en `src/__tests__/` y cubren:

- Servicios de tareas
- Validaciones
- Modelos de datos

Ejecutar tests:
```bash
# Tests únicos
npm test

# Tests con watch mode
npm run test:watch

# Tests con cobertura
npm run test:coverage
```

## 📊 Logging

El sistema utiliza Winston para logging con diferentes niveles:

- **error**: Errores críticos
- **warn**: Advertencias
- **info**: Información general
- **debug**: Información de depuración

Los logs se guardan en:
- `logs/error.log` - Solo errores
- `logs/combined.log` - Todos los logs
- Consola (en desarrollo)

## 🔒 Manejo de Errores

- Validación de entrada con Zod
- Manejo centralizado de errores
- Responses consistentes
- Logging de errores
- Códigos de estado HTTP apropiados

## 📋 Postman Collection

Importa el archivo `postman-collection.json` en Postman para probar todos los endpoints fácilmente.

## 🏗️ Decisiones de Arquitectura

### MVC Pattern
- **Models**: Manejo de datos y persistencia
- **Views**: Responses JSON (no vistas HTML)
- **Controllers**: Lógica de endpoints y coordinación

### Separación de Responsabilidades
- **Services**: Lógica de negocio
- **Models**: Acceso a datos
- **Controllers**: Manejo de HTTP requests/responses
- **Middleware**: Validación, logging, manejo de errores

### Validación
- Zod para validación de esquemas
- Validación en middlewares
- Tipos TypeScript generados automáticamente

### Persistencia
- JSON file storage para simplicidad
- Fácil migración a base de datos SQL/NoSQL
- Operaciones CRUD completas

## 🚀 Despliegue

### Variables de Entorno para Producción
```env
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://tu-frontend.com
LOG_LEVEL=warn
```

### Build para Producción
```bash
npm run build
npm start
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.
