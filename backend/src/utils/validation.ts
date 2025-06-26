import { z } from 'zod';

export const CreateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  dueDate: z.string().datetime().optional()
});

export const UpdateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters').optional(),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  completed: z.boolean().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  dueDate: z.string().datetime().optional()
});

export const TaskFiltersSchema = z.object({
  completed: z.string().transform(val => val === 'true').optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  search: z.string().optional(),
  dueDateFrom: z.string().datetime().optional(),
  dueDateTo: z.string().datetime().optional(),
  page: z.string().transform(val => parseInt(val, 10) || 1).optional(),
  limit: z.string().transform(val => parseInt(val, 10) || 10).optional()
}).optional();

export const TaskIdSchema = z.object({
  id: z.string().uuid('Invalid task ID format')
});

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type TaskFiltersInput = z.infer<typeof TaskFiltersSchema>;
export type TaskIdInput = z.infer<typeof TaskIdSchema>;
