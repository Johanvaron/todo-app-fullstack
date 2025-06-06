<template>
  <v-container fluid class="pa-4">
    <!-- Header Section -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="text-h3 font-weight-bold mb-2">¡Bienvenido a Todo App!</div>
        <div class="text-h6 text-medium-emphasis">Organiza tus tareas de manera eficiente</div>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <v-row v-if="taskStore.loading" class="justify-center">
      <v-col cols="12" class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        ></v-progress-circular>
        <div class="mt-4 text-h6">Cargando...</div>
      </v-col>
    </v-row>

    <!-- Error State -->
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

    <!-- Statistics Cards -->
    <v-row class="mb-6">
      <v-col cols="12" md="3" sm="6">
        <v-card color="primary" variant="elevated" class="text-white">
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon size="40" class="mr-4">mdi-format-list-bulleted</v-icon>
              <div>
                <div class="text-h4 font-weight-bold">{{ taskStore.stats.total }}</div>
                <div class="text-body1">Total de Tareas</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3" sm="6">
        <v-card color="success" variant="elevated" class="text-white">
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon size="40" class="mr-4">mdi-check-circle</v-icon>
              <div>
                <div class="text-h4 font-weight-bold">{{ taskStore.stats.completed }}</div>
                <div class="text-body1">Completadas</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3" sm="6">
        <v-card color="warning" variant="elevated" class="text-white">
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon size="40" class="mr-4">mdi-clock-outline</v-icon>
              <div>
                <div class="text-h4 font-weight-bold">{{ taskStore.stats.pending }}</div>
                <div class="text-body1">Pendientes</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3" sm="6">
        <v-card color="info" variant="elevated" class="text-white">
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon size="40" class="mr-4">mdi-priority-high</v-icon>
              <div>
                <div class="text-h4 font-weight-bold">{{ taskStore.stats.byPriority.high }}</div>
                <div class="text-body1">Alta Prioridad</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Quick Actions -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-lightning-bolt</v-icon>
            Acciones Rápidas
          </v-card-title>
          <v-card-text>
            <div class="d-flex flex-wrap gap-4">
              <v-btn
                color="primary"
                variant="elevated"
                prepend-icon="mdi-plus"
                @click="showTaskForm = true"
              >
                Nueva Tarea
              </v-btn>
              
              <v-btn
                color="success"
                variant="outlined"
                prepend-icon="mdi-eye"
                @click="$router.push('/tasks')"
              >
                Ver Todas las Tareas
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
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent Tasks -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-history</v-icon>
            Tareas Recientes
          </v-card-title>
          <v-card-text>
            <div v-if="recentTasks.length === 0" class="text-center py-8">
              <v-icon size="64" color="grey-lighten-1">mdi-clipboard-text-outline</v-icon>
              <div class="text-h6 mt-4 text-medium-emphasis">No hay tareas</div>
              <div class="text-body2 text-medium-emphasis">¡Crea tu primera tarea!</div>
            </div>
            
            <div v-else>
              <task-card
                v-for="task in recentTasks"
                :key="task.id"
                :task="task"
                @toggle="handleToggleTask"
                @edit="handleEditTask"
                @delete="handleDeleteTask"
                class="mb-3"
              />
              
              <div v-if="taskStore.tasks.length > 5" class="text-center mt-4">
                <v-btn
                  variant="outlined"
                  @click="$router.push('/tasks')"
                >
                  Ver todas las tareas ({{ taskStore.tasks.length }})
                </v-btn>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Task Form Dialog -->
    <v-dialog v-model="showTaskForm" max-width="600">
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
          ¿Estás seguro de que quieres eliminar todas las tareas completadas? Esta acción no se puede deshacer.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showDeleteDialog = false">Cancelar</v-btn>
          <v-btn
            color="error"
            @click="handleDeleteCompleted"
            :loading="taskStore.loading"
          >
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useTaskStore } from '@/stores/task.store';
import type { Task } from '@/types';
import TaskCard from '@/components/taskCard.vue';
import TaskForm from '@/components/taskForm.vue';

const taskStore = useTaskStore();

// Local state
const showTaskForm = ref(false);
const showDeleteDialog = ref(false);
const editingTask = ref<Task | undefined>();

// Computed
const recentTasks = computed(() => {
  return taskStore.tasks
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
});

// Methods
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
</script>

<style scoped>
.gap-4 {
  gap: 1rem;
}
</style>