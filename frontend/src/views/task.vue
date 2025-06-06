<template>
  <v-container fluid class="pa-4">
    <!-- Header -->
    <v-row class="mb-4">
      <v-col cols="12" md="8">
        <div class="text-h4 font-weight-bold mb-2">Gestión de Tareas</div>
        <div class="text-h6 text-medium-emphasis">
          {{ totalTasksText }}
        </div>
      </v-col>
      
      <v-col cols="12" md="4" class="d-flex justify-end align-center">
        <v-btn
          color="primary"
          variant="elevated"
          prepend-icon="mdi-plus"
          @click="showTaskForm = true"
          class="mr-2"
        >
          Nueva Tarea
        </v-btn>

        <v-btn
          v-if="taskStore.completedTasks.length > 0"
          color="error"
          variant="outlined"
          prepend-icon="mdi-delete"
          @click="showDeleteDialog = true"
        >
          Eliminar Completadas
        </v-btn>
      </v-col>
    </v-row>

    <!-- Error Alert -->
    <v-alert
      v-if="taskStore.error"
      type="error"
      variant="tonal"
      closable
      @click:close="taskStore.clearError()"
      class="mb-4"
    >
      {{ taskStore.error }}
    </v-alert>

    <!-- Filters -->
    <v-row class="mb-4">
      <v-col cols="12">
        <task-filter
          :filters="currentFilters"
          @update:filters="handleFiltersUpdate"
        />
      </v-col>
    </v-row>

    <!-- Task List -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <!-- Loading State -->
          <div v-if="taskStore.loading" class="text-center pa-8">
            <v-progress-circular
              indeterminate
              color="primary"
              size="64"
            ></v-progress-circular>
            <div class="mt-4 text-h6">Cargando tareas...</div>
          </div>

          <!-- Empty State -->
          <div v-else-if="displayedTasks.length === 0" class="text-center pa-8">
            <v-icon size="64" color="grey-lighten-1">
              {{ hasFilters ? 'mdi-filter-remove' : 'mdi-clipboard-text-outline' }}
            </v-icon>
            <div class="text-h6 mt-4 text-medium-emphasis">
              {{ hasFilters ? 'No se encontraron tareas' : 'No hay tareas' }}
            </div>
            <div class="text-body2 text-medium-emphasis mb-4">
              {{ hasFilters ? 'Prueba ajustando los filtros' : '¡Crea tu primera tarea!' }}
            </div>
            
            <v-btn
              v-if="!hasFilters"
              color="primary"
              variant="elevated"
              prepend-icon="mdi-plus"
              @click="showTaskForm = true"
            >
              Crear Primera Tarea
            </v-btn>
            
            <v-btn
              v-else
              variant="outlined"
              @click="clearAllFilters"
            >
              Limpiar Filtros
            </v-btn>
          </div>

          <!-- Task List -->
          <div v-else class="pa-4">
            <!-- Sort Options -->
            <div class="d-flex align-center justify-space-between mb-4">
              <div class="text-h6">
                {{ displayedTasks.length }} tarea{{ displayedTasks.length !== 1 ? 's' : '' }}
                <span v-if="hasFilters" class="text-medium-emphasis">
                  (de {{ taskStore.tasks.length }} total{{ taskStore.tasks.length !== 1 ? 'es' : '' }})
                </span>
              </div>
              
              <v-select
                v-model="sortBy"
                :items="sortOptions"
                label="Ordenar por"
                variant="outlined"
                density="compact"
                style="max-width: 200px;"
              ></v-select>
            </div>

            <!-- Tasks -->
            <div class="task-list">
              <task-card
                v-for="task in sortedTasks"
                :key="task.id"
                :task="task"
                @toggle="handleToggleTask"
                @edit="handleEditTask"
                @delete="handleDeleteTask"
                @duplicate="handleDuplicateTask"
                class="mb-3"
              />
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Task Form Dialog -->
    <v-dialog v-model="showTaskForm" max-width="600" persistent>
      <task-form
        :task="editingTask"
        @save="handleSaveTask"
        @cancel="handleCancelForm"
      />
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="500">
      <v-card>
        <v-card-title>
          <v-icon color="error" class="mr-2">mdi-alert</v-icon>
          Confirmar Eliminación
        </v-card-title>
        <v-card-text>
          ¿Estás seguro de que quieres eliminar todas las tareas completadas? 
          Se eliminarán {{ taskStore.completedTasks.length }} tarea{{ taskStore.completedTasks.length !== 1 ? 's' : '' }}.
          Esta acción no se puede deshacer.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showDeleteDialog = false">Cancelar</v-btn>
          <v-btn
            color="error"
            @click="handleDeleteCompleted"
            :loading="taskStore.loading"
          >
            Eliminar {{ taskStore.completedTasks.length }} tarea{{ taskStore.completedTasks.length !== 1 ? 's' : '' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Floating Action Button (Mobile) -->
    <v-fab
      v-if="$vuetify.display.mobile"
      icon="mdi-plus"
      color="primary"
      size="large"
      location="bottom end"
      @click="showTaskForm = true"
    ></v-fab>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useTaskStore } from '@/stores/task.store';
import type { Task, TaskFilters, CreateTaskRequest } from '@/types';
import TaskCard from '@/components/taskCard.vue';
import TaskForm from '@/components/taskForm.vue';
import TaskFilter from '@/components/taskFilter.vue';

const taskStore = useTaskStore();

// Local state
const showTaskForm = ref(false);
const showDeleteDialog = ref(false);
const editingTask = ref<Task | undefined>();
const currentFilters = ref<TaskFilters>({});
const sortBy = ref('createdAt-desc');

// Sort options
const sortOptions = [
  { title: 'Más recientes', value: 'createdAt-desc' },
  { title: 'Más antiguos', value: 'createdAt-asc' },
  { title: 'Título A-Z', value: 'title-asc' },
  { title: 'Título Z-A', value: 'title-desc' },
  { title: 'Prioridad alta primero', value: 'priority-desc' },
  { title: 'Prioridad baja primero', value: 'priority-asc' },
  { title: 'Fecha vencimiento', value: 'dueDate-asc' },
  { title: 'Completadas al final', value: 'completed-asc' }
];

// Computed
const hasFilters = computed(() => {
  return Object.keys(currentFilters.value).length > 0;
});

const displayedTasks = computed(() => {
  if (!hasFilters.value) {
    return taskStore.tasks;
  }
  return taskStore.filteredTasks;
});

const sortedTasks = computed(() => {
  const tasks = [...displayedTasks.value];
  const [field, direction] = sortBy.value.split('-');
  
  return tasks.sort((a, b) => {
    let aValue: any;
    let bValue: any;
    
    switch (field) {
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'createdAt':
      case 'updatedAt':
      case 'dueDate':
        aValue = new Date(a[field as keyof Task] as string);
        bValue = new Date(b[field as keyof Task] as string);
        break;      case 'priority': {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        aValue = priorityOrder[a.priority];
        bValue = priorityOrder[b.priority];
        break;
      }
      case 'completed':
        aValue = a.completed ? 1 : 0;
        bValue = b.completed ? 1 : 0;
        break;
      default:
        return 0;
    }
    
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });
});

const totalTasksText = computed(() => {
  const total = taskStore.tasks.length;
  const completed = taskStore.completedTasks.length;
  const pending = taskStore.pendingTasks.length;
  
  if (total === 0) {
    return 'No hay tareas creadas';
  }
  
  return `${total} tarea${total !== 1 ? 's' : ''} total${total !== 1 ? 'es' : ''} • ${completed} completada${completed !== 1 ? 's' : ''} • ${pending} pendiente${pending !== 1 ? 's' : ''}`;
});

// Methods
const handleFiltersUpdate = async (filters: TaskFilters) => {
  currentFilters.value = filters;
  taskStore.updateFilters(filters);
  await taskStore.fetchTasks(filters);
};

const clearAllFilters = async () => {
  currentFilters.value = {};
  taskStore.clearFilters();
  await taskStore.fetchTasks();
};

const handleToggleTask = async (task: Task) => {
  await taskStore.toggleTaskCompletion(task.id);
};

const handleEditTask = (task: Task) => {
  editingTask.value = task;
  showTaskForm.value = true;
};

const handleDeleteTask = async (task: Task) => {
  if (confirm(`¿Estás seguro de que quieres eliminar la tarea "${task.title}"?`)) {
    await taskStore.deleteTask(task.id);
  }
};

const handleDuplicateTask = async (task: Task) => {
  const duplicateData: CreateTaskRequest = {
    title: `${task.title} (Copia)`,
    description: task.description,
    priority: task.priority,
    dueDate: task.dueDate
  };
  
  await taskStore.createTask(duplicateData);
};

const handleSaveTask = async (taskData: any) => {
  if (editingTask.value) {
    await taskStore.updateTask(editingTask.value.id, taskData);
  } else {
    await taskStore.createTask(taskData);
  }
  handleCancelForm();
};

const handleCancelForm = () => {
  showTaskForm.value = false;
  editingTask.value = undefined;
};

const handleDeleteCompleted = async () => {
  await taskStore.deleteCompletedTasks();
  showDeleteDialog.value = false;
};

// Lifecycle
onMounted(async () => {
  await taskStore.initialize();
});

// Watchers
watch(() => taskStore.filters, (newFilters) => {
  currentFilters.value = { ...newFilters };
}, { deep: true });
</script>

<style scoped>
.task-list {
  max-height: 70vh;
  overflow-y: auto;
}

@media (max-width: 600px) {
  .task-list {
    max-height: 60vh;
  }
}
</style>