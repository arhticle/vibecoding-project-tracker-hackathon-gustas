import { useState, useEffect } from 'react';

/**
 * Vibecoding Project Tracker — starter scaffold.
 *
 * Build sequence:
 *   - M4  data-model    : render the four columns and the task cards below.
 *   - M5  crud-modal    : add/edit/delete task modal.
 *   - M6  tag-style     : feature vs. bug color coding.
 *   - M7  task-owner    : assignee badge + handoff dropdown.
 *   - M8  due-tint      : due date color tinting.
 *   - M9  context       : context briefing field on modal.
 *   - M10 copy-prompt   : "Copy as Prompt Context" button.
 *   - M11 anchors       : Deliverable Anchor Board above Kanban.
 *   - M12 secret-sauce  : custom feature.
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
export const STAGES = [
  { id: 'todo',        label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review',      label: 'Review' },
  { id: 'done',        label: 'Done' },
];

// Team members list
export const TEAM = ['Gustas', 'Teammate B', 'Teammate C'];

// Supported AI Context tools
export const AI_TOOLS = ['Claude', 'ChatGPT', 'Cursor', 'Lovable', 'Replit', 'Other'];

/**
 * A tiny localStorage hook — survives reloads, no library needed.
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
    assignee: 'Teammate B',
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
    assignee: 'Teammate C',
    dueDate: '2026-10-23',
    createdDate: '2026-10-20',
    context: 'Next up for M5 milestone.',
    contextTool: null,
    contextUpdatedAt: null,
  },
];

export default function App() {
  const [tasks, setTasks] = useLocalStorage('vibetracker.tasks', INITIAL_TASKS);

  // M5 crud-modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Form input state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'feature',
    status: 'todo',
    assignee: TEAM[0],
    dueDate: '',
    context: '',
    contextTool: 'Claude',
  });

  // TODO M11 anchors:
  //   const [anchors, setAnchors] = useLocalStorage('vibetracker.anchors', [...]);

  // Quick handoff handler (M7 task-owner)
  const handleHandoff = (taskId, newAssignee) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, assignee: newAssignee } : t))
    );
  };

  // Open modal in Create Mode
  const handleOpenCreate = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      type: 'feature',
      status: 'todo',
      assignee: TEAM[0],
      dueDate: '',
      context: '',
      contextTool: 'Claude',
    });
    setIsModalOpen(true);
  };

  // Open modal in Edit Mode
  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      type: task.type,
      status: task.status,
      assignee: task.assignee,
      dueDate: task.dueDate || '',
      context: task.context || '',
      contextTool: task.contextTool || 'Claude',
    });
    setIsModalOpen(true);
  };

  // Create or update task on submit
  const handleSaveTask = (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    const nowIso = new Date().toISOString();

    if (editingTask) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingTask.id
            ? {
                ...t,
                ...formData,
                dueDate: formData.dueDate || null,
                contextUpdatedAt: formData.context ? nowIso : t.contextUpdatedAt,
              }
            : t
        )
      );
    } else {
      const newTask = {
        id: 'task-' + Date.now(),
        ...formData,
        dueDate: formData.dueDate || null,
        createdDate: today,
        contextUpdatedAt: formData.context ? nowIso : null,
      };
      setTasks((prev) => [...prev, newTask]);
    }

    setIsModalOpen(false);
  };

  // Delete task
  const handleDeleteTask = (id) => {
    if (window.confirm('Delete this task? This action cannot be undone.')) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setIsModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <header className="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Vibecoding Project Tracker
          </h1>
          <p className="text-sm text-slate-400">
            Team Gustas
          </p>
        </div>

        {/* "+" New Task Button */}
        <button
          onClick={handleOpenCreate}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm px-4 py-2 rounded-md transition shadow-sm flex items-center gap-1"
        >
          + New Task
        </button>
      </header>

      {/* TODO M11 anchors: render the Anchor Board above the board. */}

      {/* 4-Column Kanban Columns */}
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
                  stageTasks.map((task) => {
                    const isFeature = task.type === 'feature';
                    const initial = task.assignee ? task.assignee.charAt(0).toUpperCase() : '?';

                    return (
                      <div
                        key={task.id}
                        onClick={() => handleOpenEdit(task)}
                        className={`bg-slate-800 border-t border-r border-b border-slate-700 ${
                          isFeature ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-rose-500'
                        } rounded-md p-4 shadow-sm hover:border-slate-500 transition cursor-pointer`}
                      >
                        {/* Header Row: M6 Type Tag + M7 Assignee Avatar Badge */}
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                              isFeature
                                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                                : 'bg-rose-950/80 text-rose-400 border border-rose-800'
                            }`}
                          >
                            {isFeature ? '✦ FEATURE' : '🪲 BUG'}
                          </span>

                          {/* M7 task-owner: Assignee Avatar Badge */}
                          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700 px-2 py-0.5 rounded-full">
                            <span className="w-4 h-4 rounded-full bg-indigo-600 text-[10px] font-bold text-white flex items-center justify-center font-mono">
                              {initial}
                            </span>
                            <span className="text-[11px] font-medium text-slate-300">
                              {task.assignee}
                            </span>
                          </div>
                        </div>

                        <h3 className="font-medium text-sm text-slate-100 mb-1">
                          {task.title}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                          {task.description}
                        </p>

                        {/* M7 task-owner: Inline "Hand off to..." selector */}
                        <div
                          className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="text-slate-500">Hand off to:</span>
                          <select
                            value={task.assignee}
                            onChange={(e) => handleHandoff(task.id, e.target.value)}
                            className="bg-slate-900 border border-slate-700 text-slate-300 text-[11px] rounded px-1.5 py-0.5 focus:outline-none focus:border-indigo-500"
                          >
                            {TEAM.map((member) => (
                              <option key={member} value={member}>
                                {member}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </main>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-lg rounded-lg shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
              <h2 className="text-lg font-bold text-slate-100">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="p-6 space-y-4 text-sm">
              {/* Title Input */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Task title..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Task description..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Type & Status Selects */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="feature">✦ Feature</option>
                    <option value="bug">🪲 Bug</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    {STAGES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Assignee & Due Date Selects */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Assignee (Task Owner)
                  </label>
                  <select
                    value={formData.assignee}
                    onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    {TEAM.map((member) => (
                      <option key={member} value={member}>
                        {member}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Prompt Context & Tool Input */}
              <div className="border-t border-slate-700 pt-3 mt-3">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-indigo-400">
                    AI Prompt Context
                  </label>
                  <select
                    value={formData.contextTool}
                    onChange={(e) => setFormData({ ...formData, contextTool: e.target.value })}
                    className="bg-slate-900 border border-slate-700 text-xs rounded px-2 py-1 text-slate-300"
                  >
                    {AI_TOOLS.map((tool) => (
                      <option key={tool} value={tool}>
                        {tool}
                      </option>
                    ))}
                  </select>
                </div>
                <textarea
                  rows={3}
                  value={formData.context}
                  onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                  placeholder="Paste AI prompts or technical briefings here..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 text-xs font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                {editingTask ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteTask(editingTask.id)}
                    className="bg-rose-950 text-rose-400 border border-rose-800 hover:bg-rose-900 px-3 py-1.5 rounded-md text-xs font-medium transition"
                  >
                    Delete Task
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-3 py-1.5 rounded-md text-xs text-slate-400 hover:text-slate-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-md text-xs font-medium transition"
                  >
                    {editingTask ? 'Save Changes' : 'Create Task'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}