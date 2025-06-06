# Task Management Application

This is a fullstack task management application built with Vue 3, TypeScript, and Pinia for state management. The application allows users to create, read, update, and delete tasks, providing a user-friendly interface for task management.

## Project Structure

- **src/**: Contains the source code for the application.
  - **main.ts**: Entry point of the Vue application.
  - **App.vue**: Root component that serves as the main layout.
  - **components/**: Contains reusable components.
    - **TaskCard.vue**: Displays individual task details.
    - **TaskForm.vue**: Form for creating and editing tasks.
    - **TaskFilters.vue**: Component for filtering tasks.
    - **common/**: Contains common reusable components.
      - **LoadingSpinner.vue**: Displays a loading spinner.
      - **ConfirmDialog.vue**: Provides a confirmation dialog.
  - **views/**: Contains view components.
    - **TasksView.vue**: Displays the list of tasks.
  - **stores/**: Contains Pinia stores for state management.
    - **tasks.ts**: Store for managing task state.
    - **ui.ts**: Store for managing UI state.
  - **services/**: Contains API service functions.
    - **api.ts**: Handles CRUD operations for tasks.
  - **types/**: Contains TypeScript interfaces and types.
    - **index.ts**: Exports types used throughout the application.
  - **utils/**: Contains utility functions.
    - **dateHelpers.ts**: Utility functions for date manipulation.
  - **plugins/**: Contains plugins for the application.
    - **vuetify.ts**: Sets up Vuetify as a plugin.

## Getting Started

### Prerequisites

- Node.js >= 20
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the frontend directory:
   ```
   cd frontend
   ```

3. Install dependencies:
   ```
   npm install
   ```

### Running the Application

To run the application in development mode, use the following command:
```
npm run dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

To build the application for production, use:
```
npm run build
```

The built files will be available in the `dist` directory.

## Technical Description

This application follows the MVC architecture pattern on the backend and utilizes a modular structure on the frontend. It employs Pinia for state management, ensuring a clear separation of concerns and maintainability. The application is designed to be responsive and user-friendly, with a focus on good UX/UI practices.

## Notes on Architecture Decisions

- **State Management**: Pinia was chosen for its simplicity and integration with Vue 3.
- **Component Structure**: Components are designed to be reusable and decoupled, promoting modularity.
- **Error Handling**: Centralized error handling is implemented to manage API errors and user feedback effectively.

## License

This project is licensed under the MIT License.