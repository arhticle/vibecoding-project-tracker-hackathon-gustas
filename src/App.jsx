import { useState, useEffect } from 'react';

/**
 * Vibecoding Project Tracker
 * Milestone 12 - Secret Sauce & Accessibility Control Center
 */

export const STAGES = [
  { id: 'todo',        label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review',      label: 'Review' },
  { id: 'done',        label: 'Done' },
];

export const AI_TOOLS = ['Claude', 'ChatGPT', 'Cursor', 'Lovable', 'Replit', 'Other'];

const INITIAL_TEAM = [
  { id: '1', name: 'Gustas', email: 'gustas@team.com', role: 'Lead Developer', active: true },
  { id: '2', name: 'Teammate B', email: 'teammateb@team.com', role: 'Frontend Engineer', active: true },
  { id: '3', name: 'Teammate C', email: 'teammatec@team.com', role: 'AI Architect', active: true },
];

const INITIAL_ANCHORS = [
  { id: 'presentation', label: 'Presentation', icon: '📊', url: 'https://slides.new/demo', status: 'Ready', altText: 'Bar chart icon representing slide deck presentation' },
  { id: 'demo', label: 'Demo Link', icon: '🚀', url: 'https://vibetracker.vercel.app', status: 'Live', altText: 'Rocket ship icon indicating deployed live application' },
  { id: 'report', label: 'Report', icon: '📄', url: 'https://github.com/arhticle/vibecoding-project-tracker/blob/main/PRD.md', status: 'Draft', altText: 'Document page icon for project requirements report' },
  { id: 'documentation', label: 'Documentation', icon: '📚', url: 'https://github.com/arhticle/vibecoding-project-tracker/blob/main/DESIGN.md', status: 'Complete', altText: 'Books icon for technical architecture documentation' },
];

export function getDueStatus(dueDate, isColorblind) {
  if (!dueDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      label: 'OVERDUE',
      cardStyle: isColorblind ? 'bg-amber-950/80 border-amber-400 border-2' : 'bg-rose-950/30 border-rose-800/80',
      badgeStyle: isColorblind ? 'bg-amber-400 text-black border-black font-black' : 'bg-rose-950 text-rose-300 border-rose-800',
      icon: '🚨',
    };
  } else if (diffDays <= 2) {
    return {
      label: 'DUE SOON',
      cardStyle: isColorblind ? 'bg-sky-950/80 border-sky-400 border-2' : 'bg-amber-950/30 border-amber-800/80',
      badgeStyle: isColorblind ? 'bg-sky-400 text-black border-black font-black' : 'bg-amber-950 text-amber-300 border-amber-800',
      icon: '⏳',
    };
  } else {
    return {
      label: `${diffDays}d left`,
      cardStyle: 'bg-slate-800 border-slate-700',
      badgeStyle: 'bg-slate-900/90 text-slate-400 border-slate-700',
      icon: '📅',
    };
  }
}

export function formatPromptContext(task) {
  return `[TASK BRIEFING]
Title: ${task.title}
Type: ${task.type.toUpperCase()} | Status: ${task.status} | Assignee: ${task.assignee}${task.dueDate ? ` | Due: ${task.dueDate}` : ''}

Description:
${task.description || 'N/A'}

AI Context / Instructions (${task.contextTool || 'AI'}):
${task.context || 'N/A'}`;
}

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
      /* quota or private mode ignore */
    }
  }, [key, value]);

  return [value, setValue];
}

const INITIAL_TASKS = [
  {
    id: 'task-101',
    title: 'Initialize Vite + Tailwind Scaffold',
    description: 'Fork repo and initialize local environment with Tailwind CSS.',
    type: 'feature',
    status: 'done',
    assignee: 'Gustas',
    dueDate: '2026-10-18',
    createdDate: '2026-10-15',
    context: 'SYSTEM: You are an expert React developer. TASK: Scaffold a Vite React app with Tailwind CSS config.',
    contextTool: 'Claude',
    contextUpdatedAt: '2026-10-15T10:00:00Z',
  },
  {
    id: 'task-102',
    title: 'Render 4-Column Board View',
    description: 'Display columns for To Do, In Progress, Review, and Done.',
    type: 'feature',
    status: 'in-progress',
    assignee: 'Gustas',
    dueDate: '2026-10-21',
    createdDate: '2026-10-20',
    context: 'CONTEXT: Mapping STAGES array to responsive grid columns.',
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
    context: 'DEBUGGING context: GitHub webhook delivered ping with 500 status.',
    contextTool: 'Cursor',
    contextUpdatedAt: '2026-10-20T11:30:00Z',
  },
];

export default function App() {
  const [tasks, setTasks] = useLocalStorage('vibetracker.tasks', INITIAL_TASKS);
  const [anchors, setAnchors] = useLocalStorage('vibetracker.anchors', INITIAL_ANCHORS);
  const [team, setTeam] = useLocalStorage('vibetracker.team', INITIAL_TEAM);
  
  // M12 Accessibility States
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isColorblind, setIsColorblind] = useState(false);
  const [isLargeText, setIsLargeText] = useState(false);
  const [showAltText, setShowAltText] = useState(false);

  // Team portal modal state
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState('Gustas');
  const [newInviteEmail, setNewInviteEmail] = useState('');
  const [newInviteName, setNewInviteName] = useState('');

  // Anchors editing
  const [editingAnchor, setEditingAnchor] = useState(null);
  const [anchorUrlInput, setAnchorUrlInput] = useState('');

  // CRUD Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Copy states
  const [copiedTaskId, setCopiedTaskId] = useState(null);
  const [isModalCopied, setIsModalCopied] = useState(false);

  // Form input state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'feature',
    status: 'todo',
    assignee: team[0]?.name || 'Gustas',
    dueDate: '',
    context: '',
    contextTool: 'Claude',
  });

  const teamNames = team.map((member) => member.name);

  const handleInviteMember = (e) => {
    e.preventDefault();
    if (!newInviteName.trim() || !newInviteEmail.trim()) return;

    const newMember = {
      id: 'user-' + Date.now(),
      name: newInviteName,
      email: newInviteEmail,
      role: 'Contributor',
      active: true,
    };

    setTeam((prev) => [...prev, newMember]);
    setNewInviteName('');
    setNewInviteEmail('');
    alert(`Invitation sent to ${newInviteEmail}! Added to workspace.`);
  };

  const handleSaveAnchorUrl = (id) => {
    setAnchors((prev) =>
      prev.map((a) => (a.id === id ? { ...a, url: anchorUrlInput } : a))
    );
    setEditingAnchor(null);
  };

  const handleCopyCardContext = (e, task) => {
    e.stopPropagation();
    const promptText = formatPromptContext(task);
    navigator.clipboard.writeText(promptText);
    setCopiedTaskId(task.id);
    setTimeout(() => setCopiedTaskId(null), 2000);
  };

  const handleCopyModalContext = () => {
    const promptText = formatPromptContext({
      ...formData,
      title: formData.title || 'Untitled Task',
    });
    navigator.clipboard.writeText(promptText);
    setIsModalCopied(true);
    setTimeout(() => setIsModalCopied(false), 2000);
  };

  const handleHandoff = (taskId, newAssignee) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, assignee: newAssignee } : t))
    );
  };

  const handleOpenCreate = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      type: 'feature',
      status: 'todo',
      assignee: currentUser,
      dueDate: '',
      context: '',
      contextTool: 'Claude',
    });
    setIsModalOpen(true);
  };

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

  const handleDeleteTask = (id) => {
    if (window.confirm('Delete this task? This action cannot be undone.')) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setIsModalOpen(false);
    }
  };

  return (
    <div
      style={{ zoom: isLargeText ? '125%' : '100%' }}
      className={`min-h-screen p-6 transition-colors duration-200 ${
        isColorblind
          ? 'bg-black text-yellow-300 font-sans'
          : isDarkMode
          ? 'bg-slate-900 text-slate-100'
          : 'bg-slate-100 text-slate-900'
      }`}
    >
      {/* Top Header */}
      <header className="mb-6 flex flex-wrap items-center justify-between border-b border-slate-700/60 pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <span>⚡ Vibecoding Project Tracker</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-600 text-white font-normal">
              M12 Accessibility Suite
            </span>
          </h1>
          <p className={isColorblind ? 'text-yellow-200 text-xs' : isDarkMode ? 'text-slate-400 text-xs' : 'text-slate-600 text-xs'}>
            Team Workspace & POUR-Compliant Accessibility Tools
          </p>
        </div>

        {/* Action Controls & Secret Sauce Bar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* User / Team Workspace Badge */}
          <button
            onClick={() => setIsTeamModalOpen(true)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium border flex items-center gap-2 transition ${
              isColorblind
                ? 'bg-black text-yellow-300 border-yellow-300 hover:bg-yellow-900/40'
                : isDarkMode
                ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50'
            }`}
          >
            <span>👥 Team ({team.length})</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          {/* Full Accessibility Toolbar */}
          <div className={`flex items-center gap-1 p-1 rounded-md border ${
            isColorblind ? 'border-yellow-300 bg-black' : 'bg-indigo-950/40 border-indigo-800/60'
          }`}>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="px-2 py-1 text-xs rounded hover:bg-indigo-900/50 text-indigo-300 font-medium"
              title="Toggle Light/Dark Theme"
            >
              {isDarkMode ? '🌙 Dark' : '☀️ Light'}
            </button>
            
            <button
              onClick={() => setIsColorblind(!isColorblind)}
              className={`px-2 py-1 text-xs rounded transition font-bold ${
                isColorblind ? 'bg-yellow-300 text-black border border-black' : 'text-indigo-300 hover:bg-indigo-900/50'
              }`}
              title="High Contrast Colorblind View"
            >
              👁️ Colorblind Mode
            </button>

            <button
              onClick={() => setIsLargeText(!isLargeText)}
              className={`px-2 py-1 text-xs rounded transition font-mono ${
                isLargeText ? 'bg-indigo-600 text-white font-bold' : 'text-indigo-300 hover:bg-indigo-900/50'
              }`}
              title="Toggle Large Text / Screen Zoom"
            >
              🔍 {isLargeText ? 'Zoom 125%' : 'Zoom 100%'}
            </button>

            <button
              onClick={() => setShowAltText(!showAltText)}
              className={`px-2 py-1 text-xs rounded transition ${
                showAltText ? 'bg-emerald-600 text-white font-bold' : 'text-indigo-300 hover:bg-indigo-900/50'
              }`}
              title="Toggle Screen Reader / Alt Text Inspector"
            >
              🖼️ Alt Text
            </button>
          </div>

          <button
            onClick={handleOpenCreate}
            className={`${
              isColorblind ? 'bg-yellow-300 text-black border-2 border-black font-extrabold' : 'bg-indigo-600 text-white'
            } font-medium text-xs px-4 py-2 rounded-md transition shadow-sm flex items-center gap-1`}
          >
            + New Task
          </button>
        </div>
      </header>

      {/* Deliverable Anchor Board */}
      <section className={`mb-8 border rounded-lg p-4 shadow-md ${
        isColorblind
          ? 'bg-black border-yellow-300'
          : isDarkMode
          ? 'bg-slate-800/80 border-slate-700/80'
          : 'bg-white border-slate-300'
      }`}>
        <div className="flex items-center justify-between mb-3 border-b border-slate-700/40 pb-2">
          <h2 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
            isColorblind ? 'text-yellow-300' : 'text-indigo-400'
          }`}>
            <span>⚓</span> Deliverable Anchors
          </h2>
          <span className={isColorblind ? 'text-yellow-200 text-[11px]' : 'text-slate-400 text-[11px]'}>Pinned deliverables & live links</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {anchors.map((anchor) => (
            <div
              key={anchor.id}
              className={`border rounded-md p-3 flex flex-col justify-between ${
                isColorblind
                  ? 'bg-black border-yellow-300'
                  : isDarkMode
                  ? 'bg-slate-900 border-slate-700/70'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 font-medium text-xs">
                  <span aria-label={anchor.altText} role="img">{anchor.icon}</span>
                  <span>{anchor.label}</span>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                  isColorblind
                    ? 'bg-yellow-300 text-black border-black font-extrabold'
                    : 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                }`}>
                  {anchor.status}
                </span>
              </div>

              {showAltText && (
                <div className="my-1.5 p-1.5 bg-indigo-950/80 border border-indigo-500/50 rounded text-[10px] text-indigo-200 font-mono">
                  <strong>[ALT]:</strong> {anchor.altText}
                </div>
              )}

              {editingAnchor === anchor.id ? (
                <div className="mt-2 flex items-center gap-1">
                  <input
                    type="url"
                    value={anchorUrlInput}
                    onChange={(e) => setAnchorUrlInput(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-xs text-slate-100"
                  />
                  <button onClick={() => handleSaveAnchorUrl(anchor.id)} className="bg-indigo-600 text-white px-2 py-1 rounded text-xs">
                    Save
                  </button>
                </div>
              ) : (
                <div className="mt-2 flex items-center justify-between">
                  <a href={anchor.url} target="_blank" rel="noreferrer" className={`text-xs font-mono hover:underline truncate max-w-[170px] ${
                    isColorblind ? 'text-yellow-300 font-bold' : 'text-indigo-400'
                  }`}>
                    {anchor.url}
                  </a>
                  <button onClick={() => { setEditingAnchor(anchor.id); setAnchorUrlInput(anchor.url); }} className="text-xs px-1 rounded bg-slate-700/50">
                    ✏️
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 4-Column Kanban Board */}
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STAGES.map((stage) => {
          const stageTasks = tasks.filter((task) => task.status === stage.id);

          return (
            <div
              key={stage.id}
              className={`border rounded-lg p-4 flex flex-col ${
                isColorblind
                  ? 'bg-black border-yellow-300'
                  : isDarkMode
                  ? 'bg-slate-800/60 border-slate-700/60'
                  : 'bg-slate-200/60 border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-700/50">
                <h2 className={`font-semibold text-xs uppercase tracking-wider ${
                  isColorblind ? 'text-yellow-300 font-extrabold' : 'text-slate-400'
                }`}>
                  {stage.label}
                </h2>
                <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                  isColorblind ? 'bg-yellow-300 text-black font-bold' : 'bg-slate-700/50'
                }`}>
                  {stageTasks.length}
                </span>
              </div>

              <div className="flex-1 space-y-3">
                {stageTasks.length === 0 ? (
                  <div className={`border border-dashed rounded-md p-4 text-center text-xs ${
                    isColorblind ? 'border-yellow-300 text-yellow-300' : 'border-slate-700/70 text-slate-500'
                  }`}>
                    No tasks in {stage.label.toLowerCase()}
                  </div>
                ) : (
                  stageTasks.map((task) => {
                    const isFeature = task.type === 'feature';
                    const initial = task.assignee ? task.assignee.charAt(0).toUpperCase() : '?';
                    const dueStatus = getDueStatus(task.dueDate, isColorblind);
                    const hasContext = Boolean(task.context && task.context.trim().length > 0);
                    const isCopied = copiedTaskId === task.id;

                    return (
                      <div
                        key={task.id}
                        onClick={() => handleOpenEdit(task)}
                        className={`border rounded-md p-4 shadow-sm transition cursor-pointer ${
                          dueStatus
                            ? dueStatus.cardStyle
                            : isColorblind
                            ? 'bg-black border-2 border-yellow-300 text-yellow-300'
                            : isDarkMode
                            ? 'bg-slate-800 border-slate-700'
                            : 'bg-white border-slate-300'
                        } ${
                          isColorblind
                            ? isFeature
                              ? 'border-l-[10px] border-l-cyan-400'
                              : 'border-l-[10px] border-l-amber-400'
                            : isFeature
                            ? 'border-l-4 border-l-emerald-500'
                            : 'border-l-4 border-l-rose-500'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold ${
                              isColorblind
                                ? isFeature
                                  ? 'bg-cyan-400 text-black border border-black font-black'
                                  : 'bg-amber-400 text-black border border-black font-black'
                                : isFeature
                                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                                : 'bg-rose-950/80 text-rose-400 border border-rose-800'
                            }`}
                          >
                            {isFeature ? '✦ FEATURE' : '🪲 BUG'}
                          </span>

                          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${
                            isColorblind ? 'bg-black border-yellow-300 text-yellow-300' : 'bg-slate-900/90 border-slate-700'
                          }`}>
                            <span className="w-4 h-4 rounded-full bg-indigo-600 text-[10px] font-bold text-white flex items-center justify-center font-mono">
                              {initial}
                            </span>
                            <span className="text-[11px] font-medium">
                              {task.assignee}
                            </span>
                          </div>
                        </div>

                        <h3 className="font-medium text-sm mb-1">{task.title}</h3>
                        <p className={`text-xs line-clamp-2 mb-3 ${
                          isColorblind ? 'text-yellow-200' : 'text-slate-400'
                        }`}>{task.description}</p>

                        {hasContext && (
                          <div className={`mb-3 flex items-center justify-between rounded px-2 py-1 text-[11px] border ${
                            isColorblind
                              ? 'bg-black border-yellow-300 text-yellow-300'
                              : 'bg-indigo-950/60 border-indigo-800/80'
                          }`}>
                            <div className="flex items-center gap-1 font-mono truncate mr-1">
                              <span>🤖</span>
                              <span className="truncate">{task.contextTool || 'AI'} Briefing</span>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => handleCopyCardContext(e, task)}
                              className={`text-[10px] font-mono px-2 py-0.5 rounded transition font-semibold ${
                                isCopied
                                  ? 'bg-emerald-600 text-white'
                                  : isColorblind
                                  ? 'bg-yellow-300 text-black font-bold'
                                  : 'bg-indigo-600 text-white hover:bg-indigo-500'
                              }`}
                            >
                              {isCopied ? '✓ Copied!' : '📋 Copy Prompt'}
                            </button>
                          </div>
                        )}

                        {dueStatus && (
                          <div className="mb-3 flex items-center justify-between text-xs">
                            <span className="font-mono text-[11px]">Due: {task.dueDate}</span>
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${dueStatus.badgeStyle}`}>
                              {dueStatus.icon} {dueStatus.label}
                            </span>
                          </div>
                        )}

                        <div className={`pt-2 border-t flex items-center justify-between text-[11px] ${
                          isColorblind ? 'border-yellow-300' : 'border-slate-700/60'
                        }`} onClick={(e) => e.stopPropagation()}>
                          <span>Hand off to:</span>
                          <select
                            value={task.assignee}
                            onChange={(e) => handleHandoff(task.id, e.target.value)}
                            className={`text-[11px] rounded px-1.5 py-0.5 border ${
                              isColorblind
                                ? 'bg-black border-yellow-300 text-yellow-300'
                                : 'bg-slate-900 border-slate-700 text-slate-300'
                            }`}
                          >
                            {teamNames.map((member) => (
                              <option key={member} value={member}>{member}</option>
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

      {/* Team Portal Modal */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-md rounded-lg shadow-xl overflow-hidden p-6 text-slate-100">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-700">
              <h2 className="text-base font-bold flex items-center gap-2">
                <span>👥 Team Workspace & Portal</span>
              </h2>
              <button onClick={() => setIsTeamModalOpen(false)} className="text-slate-400">✕</button>
            </div>

            <div className="mb-4">
              <label className="block text-xs text-slate-400 mb-1">Logged in as:</label>
              <select
                value={currentUser}
                onChange={(e) => setCurrentUser(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-indigo-300 font-semibold"
              >
                {teamNames.map((name) => (
                  <option key={name} value={name}>{name} (Active Session)</option>
                ))}
              </select>
            </div>

            <form onSubmit={handleInviteMember} className="mb-6 bg-slate-900/60 p-3 rounded-md border border-slate-700/60 space-y-3">
              <h3 className="text-xs font-semibold text-indigo-400">Invite New Teammate</h3>
              <input
                type="text"
                required
                placeholder="Teammate Name..."
                value={newInviteName}
                onChange={(e) => setNewInviteName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-100"
              />
              <input
                type="email"
                required
                placeholder="email@domain.com..."
                value={newInviteEmail}
                onChange={(e) => setNewInviteEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-100"
              />
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium py-1.5 rounded transition">
                Send Workspace Invite
              </button>
            </form>

            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-slate-400">Current Members ({team.length})</h3>
              <div className="max-h-36 overflow-y-auto space-y-1.5">
                {team.map((m) => (
                  <div key={m.id} className="flex items-center justify-between text-xs bg-slate-900/40 p-2 rounded border border-slate-700/40">
                    <div>
                      <span className="font-medium text-slate-200">{m.name}</span>
                      <span className="text-[10px] text-slate-500 block">{m.email}</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-lg rounded-lg shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
              <h2 className="text-lg font-bold text-slate-100">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400">✕</button>
            </div>

            <form onSubmit={handleSaveTask} className="p-6 space-y-4 text-sm">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100"
                  >
                    <option value="feature">✦ Feature</option>
                    <option value="bug">🪲 Bug</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100"
                  >
                    {STAGES.map((s) => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Assignee</label>
                  <select
                    value={formData.assignee}
                    onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100"
                  >
                    {teamNames.map((member) => (
                      <option key={member} value={member}>{member}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100"
                  />
                </div>
              </div>

              <div className="border-t border-slate-700/80 pt-3 mt-3 bg-slate-900/40 p-3 rounded-md border border-slate-700/50">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-indigo-400">🤖 AI Prompt Context</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyModalContext}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-600 text-white font-semibold"
                    >
                      {isModalCopied ? '✓ Copied!' : '📋 Copy Prompt'}
                    </button>
                    <select
                      value={formData.contextTool}
                      onChange={(e) => setFormData({ ...formData, contextTool: e.target.value })}
                      className="bg-slate-900 border border-slate-700 text-xs rounded px-2 py-1 text-slate-200"
                    >
                      {AI_TOOLS.map((tool) => (
                        <option key={tool} value={tool}>{tool}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <textarea
                  rows={4}
                  value={formData.context}
                  onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                  placeholder="Paste context, briefings, or error logs here..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 text-xs font-mono"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                {editingTask ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteTask(editingTask.id)}
                    className="bg-rose-950 text-rose-400 border border-rose-800 px-3 py-1.5 rounded-md text-xs font-medium"
                  >
                    Delete Task
                  </button>
                ) : <div />}

                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-3 py-1.5 rounded-md text-xs text-slate-400">
                    Cancel
                  </button>
                  <button type="submit" className="bg-indigo-600 text-white px-4 py-1.5 rounded-md text-xs font-medium">
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