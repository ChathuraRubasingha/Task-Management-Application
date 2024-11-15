import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Assignee {
  name: string;
  image: string;
}

interface Task {
  id: string;
  title: string;
  assignee?: Assignee;
  dueDate?: string;
  priority?: 'Low' | 'Medium' | 'High';
  status: 'todo' | 'inProgress' | 'completed';
  description: string;
}

interface TasksState {
  tasks: Task[];
}

const initialState: TasksState = {
  tasks: [],
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    createEmptyTask: (state, action: PayloadAction<{ status: 'todo' | 'inProgress' | 'completed' }>) => {
      const emptyTask: Task = {
        id: Date.now().toString(),
        title: '',
        status: action.payload.status,
      };
      state.tasks.push(emptyTask);
    },
    updateTask: (state, action: PayloadAction<{ id: string; field: keyof Task; value: any }>) => {
      const task = state.tasks.find((task) => task.id === action.payload.id);
      if (task) {
        if (action.payload.field === "assignee" && typeof action.payload.value === "object") {
          task.assignee = action.payload.value as Assignee;
        } else {
          task[action.payload.field] = action.payload.value;
        }
      }
    },
    removeTask: (state, action: PayloadAction<{ id: string }>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload.id);
  },
  },
});

export const { addTask, createEmptyTask, updateTask, removeTask } = tasksSlice.actions;
export default tasksSlice.reducer;