export type Category = "Academics" | "Personal" | "Work" | "Projects";
export type Priority = "High" | "Medium" | "Low";

export interface TodoTask {
  id: string;
  title: string;
  category: Category;
  priority: Priority;
  dueDate: string;
  completed: boolean;
  createdAt: number;
  order: number;
}

export const TODO_STORAGE_KEY = "academic_todo_tasks_v1";
export const THEME_STORAGE_KEY = "academic_todo_theme_v1";

export const categories: Category[] = ["Academics", "Personal", "Work", "Projects"];
export const priorities: Priority[] = ["High", "Medium", "Low"];

export function localDateOffset(days: number): string {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function createSampleTasks(): TodoTask[] {
  const createdAt = Date.now();
  return [
    {
      id: "sample-research-methods",
      title: "Review research methods lecture notes",
      category: "Academics",
      priority: "High",
      dueDate: localDateOffset(1),
      completed: false,
      createdAt,
      order: 0,
    },
    {
      id: "sample-grocery-run",
      title: "Pick up groceries for the week",
      category: "Personal",
      priority: "Medium",
      dueDate: localDateOffset(2),
      completed: false,
      createdAt,
      order: 1,
    },
    {
      id: "sample-portfolio",
      title: "Polish portfolio case study intro",
      category: "Projects",
      priority: "High",
      dueDate: localDateOffset(4),
      completed: false,
      createdAt,
      order: 2,
    },
    {
      id: "sample-study-group",
      title: "Send study group calendar invite",
      category: "Work",
      priority: "Low",
      dueDate: localDateOffset(6),
      completed: true,
      createdAt,
      order: 3,
    },
  ];
}

export function isTodoTask(value: unknown): value is TodoTask {
  if (!value || typeof value !== "object") return false;
  const task = value as Partial<TodoTask>;
  return (
    typeof task.id === "string" &&
    typeof task.title === "string" &&
    categories.includes(task.category as Category) &&
    priorities.includes(task.priority as Priority) &&
    typeof task.dueDate === "string" &&
    typeof task.completed === "boolean" &&
    typeof task.createdAt === "number" &&
    typeof task.order === "number"
  );
}

export function readStoredTasks(): TodoTask[] {
  try {
    const raw = window.localStorage.getItem(TODO_STORAGE_KEY);
    if (!raw) return createSampleTasks();
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.every(isTodoTask)
      ? parsed.sort((a, b) => a.order - b.order)
      : createSampleTasks();
  } catch {
    return createSampleTasks();
  }
}

export function formatDueDate(dateString: string): string {
  if (!dateString) return "No due date";
  const date = new Date(`${dateString}T12:00:00`);
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}

export function isOverdue(task: TodoTask): boolean {
  return !task.completed && task.dueDate < new Date().toISOString().slice(0, 10);
}
