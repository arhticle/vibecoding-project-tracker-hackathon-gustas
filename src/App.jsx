import { useState, useEffect } from 'react';

/**
 * Vibecoding Project Tracker — starter scaffold.
 *
 * This file is intentionally almost empty. The boilerplate (Vite, React,
 * Tailwind) is configured for you, plus a few shared constants and a
 * localStorage helper. Everything visible on screen, you build.
 *
 * Where to start (build sequence in Phase 3):
 *   - M4  data-model    : render the four columns and the task cards below.
 *   - M5  crud-modal    : add the "+" button modal and the edit-on-click modal.
 *   - M6  tag-style     : feature vs. bug color coding (uses DESIGN.md §2 colors).
 *   - M7  task-owner    : assignee badge + "Hand off to..." dropdown.
 *   - M8  due-tint      : color cards by due date (uses DESIGN.md §2 due-state colors).
 *   - M9  context       : a curated Context briefing field on the modal.
 *   - M10 copy-prompt   : a "Copy as Prompt Context" button that serializes the task + context.
 *   - M11 anchors       : the Anchor Board above the Kanban.
 *   - M12 secret-sauce  : the one open-ended thing that makes your tracker yours.
 *
 * Search the file for `TODO M<n>` to find the right hook for each milestone.
 */

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {'feature'|'bug'} type
 * @property {'todo'|'in-progress'|'review'|'done'} status
 * @property {string} assignee
 * @property {string|null} dueDate     ISO 'YYYY-MM-DD'
 * @property {string} createdDate      ISO 'YYYY-MM-DD'
 * @property {string} [context]
 * @property {string|null} [contextTool]
 * @property {string|null} [contextUpdatedAt]
 */

// The four columns of the board, in render order.
// Use these IDs everywhere — do not invent new ones.
export const STAGES = [
  { id: 'todo',        label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review',      label: 'Review' },
  { id: 'done',        label: 'Done' },
];

// Replace these placeholders with the three names from PRD §8 before M4.
// They become the only valid values for `Task.assignee`.
export const TEAM = ['Gustas', 'Teammate B', 'Teammate C'];

/**
 * A tiny localStorage hook — survives reloads, no library needed.
 *
 * Usage:
 *   const [tasks, setTasks] = useLocalStorage('vibetracker.tasks', []);
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw != null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota or private-mode error — silently ignore for hackathon */
    }
  }, [key, value]);

  return [value, setValue];
}

// 3-4 initial mock tasks for M4 initialization
const INITIAL_TASKS = [
  {
    id: 'task-101',
    title: 'Initialize Vite + Tailwind Scaffold',
    description: 'Fork repo and initialize local environment with Tailwind CSS.',
    type: 'feature',
    status: 'done',
    assignee: 'Gustas',
    dueDate: '2026-10-21',
    createdDate: '2026-10-20',
    context: 'Ran npm install and verified dev server at localhost:5173.',
    contextTool: 'Claude',
    contextUpdatedAt: '2026-10-20T10:00:00Z',
  },
  {
    id: 'task-102',
    title: 'Render 4-Column Board View',
    description: 'Display columns for To Do, In Progress, Review, and Done.',
    type: 'feature',
    status: 'in-progress',
    assignee: 'Gustas',
    dueDate: '2026-10-22',
    createdDate: '2026-10-20',
    context: 'Mapping STAGES array to responsive grid columns.',
    contextTool: 'ChatGPT',
    contextUpdatedAt: '2026-10-20T11:00:00Z',
  },
  {
    id: 'task-103',
    title: 'Configure Webhook Payload Format',
    description: 'Ensure content-type is set to application/json in GitHub webhook settings.',
    type: 'bug',
    status: 'review',
    assignee: 'Gustas',
    dueDate: '2026-10-20',
    createdDate: '2026-10-20',
    context: 'Resolved Vercel API 500 error on ping deliveries.',
    contextTool: 'Cursor',
    contextUpdatedAt: '2026-10-20T11:30:00Z',
  },
  {
    id: 'task-104',
    title: 'Build Task CRUD Modal',
    description: 'Add modal to create, edit, and delete board tasks with localStorage sync.',
    type: 'feature',
    status: 'todo',
    assignee: 'Gustas',
    dueDate: '2026-10-23',
    createdDate: '2026-10-20',
    context: 'Next up for M5 milestone.',
    contextTool: null,
    contextUpdatedAt: null,
  },
];

export default function App() {
  const [tasks] = useLocalStorage('vibetracker.tasks', INITIAL_TASKS);

  // TODO M5 crud-modal:
  //   const [editing, setEditing] = useState(null);

  // TODO M11 anchors:
  //   const [anchors, setAnchors] = useLocalStorage('vibetracker.anchors', [...]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <header className="mb-6 flex items-end justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            Vibecoding Project Tracker
          </h1>
          <p className="text-sm text-slate-400">
            Team Gustas
          </p>
        </div>
      </header>

      {/* TODO M11 anchors: render the Anchor Board above the board. */}

      {/* M4 data-model: Render Kanban board with 4 columns from STAGES */}
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STAGES.map((stage) => {
          const stageTasks = tasks.filter((task) => task.status === stage.id);

          return (
            <div
              key={stage.id}
              className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-4 flex flex-col"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-700/50">
                <h2 className="font-semibold text-sm uppercase tracking-wider text-slate-300">
                  {stage.label}
                </h2>
                <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                  {stageTasks.length}
                </span>
              </div>

              {/* Task Cards */}
              <div className="flex-1 space-y-3">
                {stageTasks.length === 0 ? (
                  <div className="border border-dashed border-slate-700/70 rounded-md p-4 text-center text-xs text-slate-500">
                    No tasks in {stage.label.toLowerCase()}
                  </div>
                ) : (
                  stageTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-slate-800 border border-slate-700 rounded-md p-4 shadow-sm hover:border-indigo-500/50 transition cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold ${
                            task.type === 'feature'
                              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                              : 'bg-rose-950/80 text-rose-400 border border-rose-800'
                          }`}
                        >
                          {task.type}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {task.assignee}
                        </span>
                      </div>
                      <h3 className="font-medium text-sm text-slate-100 mb-1">
                        {task.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2">
                        {task.description}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}