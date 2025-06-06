<template>
  <v-card>
    <v-card-title>
      <v-icon class="mr-2">{{ isEditing ? 'mdi-pencil' : 'mdi-plus' }}</v-icon>
      {{ isEditing ? 'Editar Tarea' : 'Nueva Tarea' }}
    </v-card-title>

    <v-card-text>
      <v-form ref="formRef" v-model="isFormValid" @submit.prevent="handleSubmit">
        <!-- Title -->
        <v-text-field
          v-model="form.title"
          label="Título"
          :rules="titleRules"
          required
          variant="outlined"
          prepend-inner-icon="mdi-format-title"
          class="mb-4"
        ></v-text-field>

        <!-- Description -->
        <v-textarea
          v-model="form.description"
          label="Descripción (opcional)"
          variant="outlined"
          prepend-inner-icon="mdi-text"
          rows="3"
          class="mb-4"
        ></v-textarea>

        <!-- Priority -->
        <v-select
          v-model="form.priority"
          :items="priorityOptions"
          label="Prioridad"
          variant="outlined"
          prepend-inner-icon="mdi-flag"
          class="mb-4"
        ></v-select>

        <!-- Due Date -->
        <v-text-field
          v-model="form.dueDate"
          label="Fecha de vencimiento (opcional)"
          type="datetime-local"
          variant="outlined"
          prepend-inner-icon="mdi-calendar"
          class="mb-4"
        ></v-text-field>

        <!-- Completed (only when editing) -->
        <v-checkbox
          v-if="isEditing"
          v-model="form.completed"
          label="Marcar como completada"
          color="success"
          class="mb-4"
        ></v-checkbox>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      
      <v-btn
        @click="$emit('cancel')"
        variant="outlined"
      >
        Cancelar
      </v-btn>
      
      <v-btn
        :disabled="!isFormValid"
        :loading="loading"
        color="primary"
        @click="handleSubmit"
      >
        {{ isEditing ? 'Actualizar' : 'Crear' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import type { Task, CreateTaskRequest, UpdateTaskRequest } from '@/types';

interface Props {
  task?: Task;
}

interface Emits {
  save: [taskData: CreateTaskRequest | UpdateTaskRequest];
  cancel: [];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Refs
const formRef = ref();
const isFormValid = ref(false);
const loading = ref(false);

// Form data
const form = ref({
  title: '',
  description: '',
  priority: 'medium' as 'low' | 'medium' | 'high',
  dueDate: '',
  completed: false
});

// Computed
const isEditing = computed(() => !!props.task);

// Form validation rules
const titleRules = [
  (v: string) => !!v || 'El título es requerido',
  (v: string) => (v && v.length >= 3) || 'El título debe tener al menos 3 caracteres',
  (v: string) => (v && v.length <= 100) || 'El título no puede tener más de 100 caracteres'
];

// Priority options
const priorityOptions = [
  { title: 'Baja', value: 'low', props: { prependIcon: 'mdi-priority-low' } },
  { title: 'Media', value: 'medium', props: { prependIcon: 'mdi-equal' } },
  { title: 'Alta', value: 'high', props: { prependIcon: 'mdi-priority-high' } }
];

// Methods
const resetForm = () => {
  form.value = {
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    completed: false
  };
  
  if (formRef.value) {
    formRef.value.resetValidation();
  }
};

const loadTaskData = () => {
  if (props.task) {
    form.value = {
      title: props.task.title,
      description: props.task.description || '',
      priority: props.task.priority,
      dueDate: props.task.dueDate ? formatDateForInput(props.task.dueDate) : '',
      completed: props.task.completed
    };
  }
};

const formatDateForInput = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const handleSubmit = async () => {
  if (!formRef.value || !isFormValid.value) return;

  loading.value = true;
  
  try {
    const taskData: CreateTaskRequest | UpdateTaskRequest = {
      title: form.value.title.trim(),
      ...(form.value.description && { description: form.value.description.trim() }),
      priority: form.value.priority,
      ...(form.value.dueDate && { dueDate: new Date(form.value.dueDate).toISOString() })
    };

    if (isEditing.value) {
      (taskData as UpdateTaskRequest).completed = form.value.completed;
    }

    emit('save', taskData);
  } catch (error) {
    console.error('Error submitting form:', error);
  } finally {
    loading.value = false;
  }
};

// Watchers
watch(() => props.task, () => {
  if (props.task) {
    loadTaskData();
  } else {
    resetForm();
  }
}, { immediate: true });

// Lifecycle
onMounted(() => {
  if (props.task) {
    loadTaskData();
  }
});
</script>

<style scoped>
.v-card {
  min-width: 500px;
}
</style>