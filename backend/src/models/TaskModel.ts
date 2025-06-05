import { Task, TaskFilters } from '../types';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import logger from '../utils/logger';

export class TaskModel {
  private dataFile: string;

  constructor() {
    this.dataFile = path.join(__dirname, '../data/tasks.json');
    this.initializeDataFile();
  }

  private async initializeDataFile(): Promise<void> {
    try {
      await fs.access(this.dataFile);
    } catch {
      // File doesn't exist, create it with empty array
      await fs.mkdir(path.dirname(this.dataFile), { recursive: true });
      await fs.writeFile(this.dataFile, JSON.stringify([], null, 2));
      logger.info('Initialized tasks data file');
    }
  }

  private async readTasks(): Promise<Task[]> {
    try {
      const data = await fs.readFile(this.dataFile, 'utf-8');
      return JSON.parse(data) as Task[];
    } catch (error) {
      logger.error('Error reading tasks file:', error);
      return [];
    }
  }

  private async writeTasks(tasks: Task[]): Promise<void> {
    try {
      await fs.writeFile(this.dataFile, JSON.stringify(tasks, null, 2));
    } catch (error) {
      logger.error('Error writing tasks file:', error);
      throw new Error('Failed to save tasks');
    }
  }

  async findAll(filters?: TaskFilters, page: number = 1, limit: number = 10): Promise<{ tasks: Task[], total: number }> {
    const tasks = await this.readTasks();
    let filteredTasks = [...tasks];

    // Apply filters
    if (filters) {
      if (filters.completed !== undefined) {
        filteredTasks = filteredTasks.filter(task => task.completed === filters.completed);
      }
      
      if (filters.priority) {
        filteredTasks = filteredTasks.filter(task => task.priority === filters.priority);
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredTasks = filteredTasks.filter(task => 
          task.title.toLowerCase().includes(searchLower) ||
          task.description?.toLowerCase().includes(searchLower)
        );
      }
      
      if (filters.dueDateFrom) {
        filteredTasks = filteredTasks.filter(task => 
          task.dueDate && task.dueDate >= filters.dueDateFrom!
        );
      }
      
      if (filters.dueDateTo) {
        filteredTasks = filteredTasks.filter(task => 
          task.dueDate && task.dueDate <= filters.dueDateTo!
        );
      }
    }

    // Sort by creation date (newest first)
    filteredTasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

    return {
      tasks: paginatedTasks,
      total: filteredTasks.length
    };
  }

  async findById(id: string): Promise<Task | null> {
    const tasks = await this.readTasks();
    return tasks.find(task => task.id === id) || null;
  }

  async create(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const tasks = await this.readTasks();
    const now = new Date().toISOString();
    
    const newTask: Task = {
      id: uuidv4(),
      ...taskData,
      createdAt: now,
      updatedAt: now
    };

    tasks.push(newTask);
    await this.writeTasks(tasks);
    
    logger.info(`Created new task: ${newTask.id}`);
    return newTask;
  }

  async update(id: string, taskData: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Task | null> {
    const tasks = await this.readTasks();
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return null;
    }

    const updatedTask: Task = {
      ...tasks[taskIndex],
      ...taskData,
      updatedAt: new Date().toISOString()
    };

    tasks[taskIndex] = updatedTask;
    await this.writeTasks(tasks);
    
    logger.info(`Updated task: ${id}`);
    return updatedTask;
  }

  async delete(id: string): Promise<boolean> {
    const tasks = await this.readTasks();
    const initialLength = tasks.length;
    const filteredTasks = tasks.filter(task => task.id !== id);
    
    if (filteredTasks.length === initialLength) {
      return false; // Task not found
    }

    await this.writeTasks(filteredTasks);
    logger.info(`Deleted task: ${id}`);
    return true;
  }

  async deleteCompleted(): Promise<number> {
    const tasks = await this.readTasks();
    const incompleteTasks = tasks.filter(task => !task.completed);
    const deletedCount = tasks.length - incompleteTasks.length;
    
    if (deletedCount > 0) {
      await this.writeTasks(incompleteTasks);
      logger.info(`Deleted ${deletedCount} completed tasks`);
    }
    
    return deletedCount;
  }
}

export const taskModel = new TaskModel();
