import { Router } from 'express';
import { taskController } from '../controllers/TaskController';
import { validateBody, validateParams, validateQuery } from '../middleware/validation';
import { 
  CreateTaskSchema, 
  UpdateTaskSchema, 
  TaskFiltersSchema, 
  TaskIdSchema 
} from '../utils/validation';

const router = Router();

/**
 * @route GET /api/tasks
 * @desc Get all tasks with optional filtering and pagination
 * @access Public
 */
router.get('/', 
  validateQuery(TaskFiltersSchema),
  taskController.getTasks.bind(taskController)
);

/**
 * @route GET /api/tasks/stats
 * @desc Get task statistics
 * @access Public
 */
router.get('/stats', 
  taskController.getTaskStats.bind(taskController)
);

/**
 * @route GET /api/tasks/:id
 * @desc Get task by ID
 * @access Public
 */
router.get('/:id', 
  validateParams(TaskIdSchema),
  taskController.getTaskById.bind(taskController)
);

/**
 * @route POST /api/tasks
 * @desc Create a new task
 * @access Public
 */
router.post('/', 
  validateBody(CreateTaskSchema),
  taskController.createTask.bind(taskController)
);

/**
 * @route PUT /api/tasks/:id
 * @desc Update a task
 * @access Public
 */
router.put('/:id', 
  validateParams(TaskIdSchema),
  validateBody(UpdateTaskSchema),
  taskController.updateTask.bind(taskController)
);

/**
 * @route DELETE /api/tasks/:id
 * @desc Delete a task
 * @access Public
 */
router.delete('/:id', 
  validateParams(TaskIdSchema),
  taskController.deleteTask.bind(taskController)
);

/**
 * @route DELETE /api/tasks
 * @desc Delete all completed tasks
 * @access Public
 */
router.delete('/', 
  taskController.deleteCompletedTasks.bind(taskController)
);

export default router;
