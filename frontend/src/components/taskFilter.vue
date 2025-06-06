<template>
  <v-card variant="outlined">
    <v-card-title>
      <v-icon class="mr-2">mdi-filter</v-icon>
      Filtros
    </v-card-title>

    <v-card-text>
      <v-row>
        <!-- Search -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="localFilters.search"
            label="Buscar tareas..."
            variant="outlined"
            prepend-inner-icon="mdi-magnify"
            clearable
            @input="debouncedEmitFilters"
          ></v-text-field>
        </v-col>

        <!-- Status Filter -->
        <v-col cols="12" md="3">
          <v-select
            v-model="localFilters.completed"
            :items="statusOptions"
            label="Estado"
            variant="outlined"
            prepend-inner-icon="mdi-check-circle"
            clearable
            @update:model-value="emitFilters"
          ></v-select>
        </v-col>

        <!-- Priority Filter -->
        <v-col cols="12" md="3">
          <v-select
            v-model="localFilters.priority"
            :items="priorityOptions"
            label="Prioridad"
            variant="outlined"
            prepend-inner-icon="mdi-flag"
            clearable
            @update:model-value="emitFilters"
          ></v-select>
        </v-col>

        <!-- Date Range Filters -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="localFilters.dueDateFrom"
            label="Fecha de vencimiento desde"
            type="date"
            variant="outlined"
            prepend-inner-icon="mdi-calendar"
            clearable
            @update:model-value="emitFilters"
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="localFilters.dueDateTo"
            label="Fecha de vencimiento hasta"
            type="date"
            variant="outlined"
            prepend-inner-icon="mdi-calendar"
            clearable
            @update:model-value="emitFilters"
          ></v-text-field>
        </v-col>
      </v-row>

      <!-- Active Filters Summary -->
      <div v-if="hasActiveFilters" class="mt-4">
        <v-divider class="mb-3"></v-divider>
        
        <div class="d-flex align-center flex-wrap gap-2">
          <span class="text-body2 font-weight-medium">Filtros activos:</span>
          
          <v-chip
            v-if="localFilters.search"
            closable
            size="small"
            color="primary"
            @click:close="clearSearch"
          >
            <v-icon start>mdi-magnify</v-icon>
            "{{ localFilters.search }}"
          </v-chip>

          <v-chip
            v-if="localFilters.completed !== undefined"
            closable
            size="small"
            :color="getStatusColor(localFilters.completed)"
            @click:close="clearStatus"
          >
            <v-icon start>mdi-check-circle</v-icon>
            {{ getStatusText(localFilters.completed) }}
          </v-chip>

          <v-chip
            v-if="localFilters.priority"
            closable
            size="small"
            :color="getPriorityColor(localFilters.priority)"
            @click:close="clearPriority"
          >
            <v-icon start>{{ getPriorityIcon(localFilters.priority) }}</v-icon>
            {{ getPriorityText(localFilters.priority) }}
          </v-chip>

          <v-chip
            v-if="localFilters.dueDateFrom"
            closable
            size="small"
            color="info"
            @click:close="clearDateFrom"
          >
            <v-icon start>mdi-calendar</v-icon>
            Desde: {{ formatDate(localFilters.dueDateFrom) }}
          </v-chip>

          <v-chip
            v-if="localFilters.dueDateTo"
            closable
            size="small"
            color="info"
            @click:close="clearDateTo"
          >
            <v-icon start>mdi-calendar</v-icon>
            Hasta: {{ formatDate(localFilters.dueDateTo) }}
          </v-chip>

          <v-btn
            size="small"
            variant="text"
            color="error"
            @click="clearAllFilters"
          >
            <v-icon start>mdi-close-circle</v-icon>
            Limpiar todo
          </v-btn>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { debounce } from 'lodash-es';
import type { TaskFilters } from '@/types';

interface Props {
  filters: TaskFilters;
}

interface Emits {
  'update:filters': [filters: TaskFilters];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Local state
const localFilters = ref<TaskFilters>({ ...props.filters });

// Options
const statusOptions = [
  { title: 'Completadas', value: true, props: { prependIcon: 'mdi-check-circle' } },
  { title: 'Pendientes', value: false, props: { prependIcon: 'mdi-clock-outline' } }
];

const priorityOptions = [
  { title: 'Baja', value: 'low', props: { prependIcon: 'mdi-priority-low' } },
  { title: 'Media', value: 'medium', props: { prependIcon: 'mdi-equal' } },
  { title: 'Alta', value: 'high', props: { prependIcon: 'mdi-priority-high' } }
];

// Computed
const hasActiveFilters = computed(() => {
  return Object.values(localFilters.value).some(value => 
    value !== undefined && value !== null && value !== ''
  );
});

// Methods
const emitFilters = () => {
  // Clean up empty values
  const cleanFilters: TaskFilters = {};
    Object.entries(localFilters.value).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      (cleanFilters as any)[key] = value;
    }
  });
  
  emit('update:filters', cleanFilters);
};

const debouncedEmitFilters = debounce(emitFilters, 300);

const clearSearch = () => {
  localFilters.value.search = undefined;
  emitFilters();
};

const clearStatus = () => {
  localFilters.value.completed = undefined;
  emitFilters();
};

const clearPriority = () => {
  localFilters.value.priority = undefined;
  emitFilters();
};

const clearDateFrom = () => {
  localFilters.value.dueDateFrom = undefined;
  emitFilters();
};

const clearDateTo = () => {
  localFilters.value.dueDateTo = undefined;
  emitFilters();
};

const clearAllFilters = () => {
  localFilters.value = {};
  emitFilters();
};

// Helper methods
const getStatusColor = (completed: boolean) => {
  return completed ? 'success' : 'warning';
};

const getStatusText = (completed: boolean) => {
  return completed ? 'Completadas' : 'Pendientes';
};

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
    day: 'numeric'
  });
};

// Watchers
watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters };
}, { deep: true });
</script>

<style scoped>
.gap-2 {
  gap: 0.5rem;
}
</style>