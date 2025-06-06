<template>
  <v-card
    :class="[
      'task-card',
      { 'task-completed': task.completed }
    ]"
    variant="outlined"
    :color="task.completed ? 'success' : undefined"
  >
    <v-card-text class="d-flex align-center">
      <!-- Checkbox -->
      <v-checkbox
        :model-value="task.completed"
        @update:model-value="$emit('toggle', task)"
        color="success"
        hide-details
        class="mr-4"
      ></v-checkbox>

      <!-- Task Content -->
      <div class="flex-grow-1">
        <div class="d-flex align-center justify-space-between mb-2">
          <h4 
            :class="[
              'text-h6',
              { 'text-decoration-line-through text-medium-emphasis': task.completed }
            ]"
          >
            {{ task.title }}
          </h4>
          
          <!-- Priority Badge -->
          <v-chip
            :color="getPriorityColor(task.priority)"
            size="small"
            variant="flat"
          >
            <v-icon start :icon="getPriorityIcon(task.priority)"></v-icon>
            {{ getPriorityText(task.priority) }}
          </v-chip>
        </div>

        <!-- Description -->
        <p 
          v-if="task.description"
          :class="[
            'text-body2 mb-2',
            { 'text-decoration-line-through text-medium-emphasis': task.completed }
          ]"
        >
          {{ task.description }}
        </p>

        <!-- Due Date -->
        <div v-if="task.dueDate" class="d-flex align-center mb-2">
          <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
          <span 
            :class="[
              'text-caption',
              {
                'text-error': isOverdue && !task.completed,
                'text-warning': isDueSoon && !task.completed && !isOverdue,
                'text-medium-emphasis': task.completed
              }
            ]"
          >
            {{ formatDueDate(task.dueDate) }}
            <span v-if="isOverdue && !task.completed" class="ml-1">(Vencida)</span>
            <span v-else-if="isDueSoon && !task.completed && !isOverdue" class="ml-1">(Vence pronto)</span>
          </span>
        </div>

        <!-- Timestamps -->
        <div class="d-flex align-center text-caption text-medium-emphasis">
          <v-icon size="small" class="mr-1">mdi-clock-outline</v-icon>
          <span>Creada: {{ formatDate(task.createdAt) }}</span>
          <span v-if="task.updatedAt !== task.createdAt" class="ml-3">
            <v-icon size="small" class="mr-1">mdi-update</v-icon>
            Actualizada: {{ formatDate(task.updatedAt) }}
          </span>
        </div>
      </div>

      <!-- Actions -->
      <div class="ml-4">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn
              icon="mdi-dots-vertical"
              variant="text"
              size="small"
              v-bind="props"
            ></v-btn>
          </template>
          
          <v-list>
            <v-list-item
              prepend-icon="mdi-pencil"
              title="Editar"
              @click="$emit('edit', task)"
            ></v-list-item>
            
            <v-list-item
              prepend-icon="mdi-content-copy"
              title="Duplicar"
              @click="$emit('duplicate', task)"
            ></v-list-item>
            
            <v-divider></v-divider>
            
            <v-list-item
              prepend-icon="mdi-delete"
              title="Eliminar"
              @click="$emit('delete', task)"
              class="text-error"
            ></v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Task } from '@/types';

interface Props {
  task: Task;
}

interface Emits {
  toggle: [task: Task];
  edit: [task: Task];
  delete: [task: Task];
  duplicate: [task: Task];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Computed properties
const isOverdue = computed(() => {
  if (!props.task.dueDate) return false;
  const dueDate = new Date(props.task.dueDate);
  const now = new Date();
  return dueDate < now && !props.task.completed;
});

const isDueSoon = computed(() => {
  if (!props.task.dueDate) return false;
  const dueDate = new Date(props.task.dueDate);
  const now = new Date();
  const diffTime = dueDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 2 && diffDays >= 0 && !props.task.completed;
});

// Methods
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'error';
    case 'medium': return 'warning';
    case 'low': return 'success';
    default: return 'grey';
  }
};

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case 'high': return 'mdi-priority-high';
    case 'medium': return 'mdi-equal';
    case 'low': return 'mdi-priority-low';
    default: return 'mdi-minus';
  }
};

const getPriorityText = (priority: string) => {
  switch (priority) {
    case 'high': return 'Alta';
    case 'medium': return 'Media';
    case 'low': return 'Baja';
    default: return 'Sin prioridad';
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatDueDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Hoy';
  } else if (diffDays === 1) {
    return 'Mañana';
  } else if (diffDays === -1) {
    return 'Ayer';
  } else if (diffDays > 1 && diffDays <= 7) {
    return `En ${diffDays} días`;
  } else if (diffDays < -1 && diffDays >= -7) {
    return `Hace ${Math.abs(diffDays)} días`;
  } else {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
};
</script>

<style scoped>
.task-card {
  transition: all 0.3s ease;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.task-completed {
  opacity: 0.8;
}

.task-completed .v-card-text {
  background-color: rgba(76, 175, 80, 0.05);
}
</style>