import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
//  TaskFlow — React To-Do App
//  Demonstrates: CRUD, state management, delegated events, storage persistence
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = "taskflow_v1_todos";
const RING_CIRC   = 2 * Math.PI * 26; // 2πr, r=26

function genId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ── SVG Progress Ring ─────────────────────────────────────────────────────────
function ProgressRing({ pct }) {
  const offset = RING_CIRC * (1 - pct / 100);
  return (
    <div style={{ position: "relative", width: 58, height: 58, flexShrink: 0 }}>
      <svg width="58" height="58" viewBox="0 0 58 58"
           style={{ display: "block", transform: "rotate(-90deg)" }}>
        <circle cx="29" cy="29" r="26" fill="none"
                stroke="rgba(255,255,255,0.07)" strokeWidth="4" />
        <circle cx="29" cy="29" r="26" fill="none"
                stroke="#F5A623" strokeWidth="4"
                strokeDasharray={RING_CIRC}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.5s cubic-bezier(.4,0,.2,1)" }} />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, fontWeight: 600, color: "#F5A623",
      }}>
        {pct}%
      </div>
    </div>
  );
}

// ── Checkbox ──────────────────────────────────────────────────────────────────
function Checkbox({ checked }) {
  return (
    <div data-action="toggle" style={{
      width: 22, height: 22, flexShrink: 0,
      borderRadius: 7,
      border: `2px solid ${checked ? "#F5A623" : "rgba(255,255,255,0.15)"}`,
      background: checked ? "rgba(245,166,35,0.13)" : "transparent",
      cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center",
      transition: "border-color 0.2s, background 0.2s",
    }}>
      {checked && (
        <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
          <path d="M1 3.8L3.9 6.8L10 1"
                stroke="#F5A623" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

// ── Icon buttons ──────────────────────────────────────────────────────────────
const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M9.5 1.5L11.5 3.5L4.5 10.5L1.5 11.5L2.5 8.5L9.5 1.5Z"
          stroke="currentColor" strokeWidth="1.4"
          strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TrashIcon = () => (
  <svg width="12" height="13" viewBox="0 0 12 13" fill="none">
    <path d="M1 3H11M4 3V2H8V3M2 3L2.5 11H9.5L10 3"
          stroke="currentColor" strokeWidth="1.4"
          strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PlusIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M6.5 1v11M1 6.5h11"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// ── Main App ──────────────────────────────────────────────────────────────────
export default function TaskFlow() {
  const [todos,     setTodos]     = useState([]);
  const [input,     setInput]     = useState("");
  const [filter,    setFilter]    = useState("all");   // "all" | "active" | "completed"
  const [editingId, setEditingId] = useState(null);
  const [editText,  setEditText]  = useState("");
  const [isLoaded,  setIsLoaded]  = useState(false);
  const [newIds,    setNewIds]    = useState(new Set()); // track for slide-in anim
  const [hovered,   setHovered]   = useState(null);    // track hovered todo id
  const inputRef = useRef(null);
  const editRef  = useRef(null);

  // ── PERSISTENCE ─────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get(STORAGE_KEY);
        if (r?.value) setTodos(JSON.parse(r.value));
      } catch (_) {}
      setIsLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    (async () => {
      try { await window.storage.set(STORAGE_KEY, JSON.stringify(todos)); }
      catch (_) {}
    })();
  }, [todos, isLoaded]);

  // ── FOCUS MANAGEMENT ────────────────────────────────────────────────────────
  useEffect(() => {
    if (editingId) editRef.current?.focus();
  }, [editingId]);

  // ── CRUD ────────────────────────────────────────────────────────────────────
  const addTodo = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    const id = genId();
    setTodos(prev => [{ id, text, completed: false, createdAt: Date.now() }, ...prev]);
    // Mark new id for animation, remove after animation completes
    setNewIds(prev => new Set(prev).add(id));
    setTimeout(() => setNewIds(prev => { const n = new Set(prev); n.delete(id); return n; }), 400);
    setInput("");
    inputRef.current?.focus();
  }, [input]);

  const toggleTodo = useCallback((id) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }, []);

  const deleteTodo = useCallback((id) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  }, []);

  const startEdit = useCallback((todo) => {
    if (todo.completed) return;
    setEditingId(todo.id);
    setEditText(todo.text);
  }, []);

  const confirmEdit = useCallback((id) => {
    const text = editText.trim();
    if (text) setTodos(prev => prev.map(t => t.id === id ? { ...t, text } : t));
    setEditingId(null);
    setEditText("");
  }, [editText]);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditText("");
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(t => !t.completed));
  }, []);

  const toggleAll = useCallback(() => {
    const anyActive = todos.some(t => !t.completed);
    setTodos(prev => prev.map(t => ({ ...t, completed: anyActive })));
  }, [todos]);

  // ── DELEGATED EVENT HANDLER ──────────────────────────────────────────────────
  // One onClick on the list container — resolves action from data attributes
  const handleDelegate = useCallback((e) => {
    const item = e.target.closest("[data-todo-id]");
    if (!item) return;
    const id     = item.dataset.todoId;
    const action = e.target.closest("[data-action]")?.dataset.action;
    const todo   = todos.find(t => t.id === id);
    if (!todo) return;

    if (action === "toggle") toggleTodo(id);
    if (action === "delete") deleteTodo(id);
    if (action === "edit")   startEdit(todo);
  }, [todos, toggleTodo, deleteTodo, startEdit]);

  // ── DERIVED STATE ────────────────────────────────────────────────────────────
  const filtered     = todos.filter(t =>
    filter === "active"    ? !t.completed :
    filter === "completed" ?  t.completed : true
  );
  const activeCount  = todos.filter(t => !t.completed).length;
  const doneCount    = todos.filter(t =>  t.completed).length;
  const pct          = todos.length > 0 ? Math.round((doneCount / todos.length) * 100) : 0;
  const allDone      = todos.length > 0 && todos.every(t => t.completed);

  // ── TOKENS ──────────────────────────────────────────────────────────────────
  const C = {
    bg:          "linear-gradient(135deg, #0E0C18 0%, #13111F 60%, #0A0914 100%)",
    surface:     "rgba(22,19,38,0.95)",
    border:      "rgba(255,255,255,0.06)",
    accent:      "#F5A623",
    accentDim:   "rgba(245,166,35,0.12)",
    accentGlow:  "rgba(245,166,35,0.28)",
    danger:      "#EF4444",
    dangerDim:   "rgba(239,68,68,0.12)",
    text:        "#F0EEF8",
    textSub:     "rgba(240,238,248,0.4)",
    textMuted:   "rgba(240,238,248,0.2)",
    rowHover:    "rgba(255,255,255,0.03)",
  };

  const inputActive = input.trim().length > 0;

  // ── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh",
      background: C.bg,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "40px 16px 80px",
      fontFamily: "'DM Sans', system-ui, sans-serif",
      color: C.text,
    }}>

      {/* ── Global Styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Space+Grotesk:wght@700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        ::placeholder { color: rgba(240,238,248,0.2); font-family:'DM Sans',system-ui; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(245,166,35,0.25); border-radius: 99px; }
        button { cursor: pointer; font-family: 'DM Sans', system-ui; }
        input  { font-family: 'DM Sans', system-ui; outline: none; }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .todo-new { animation: slideDown 0.28s cubic-bezier(.4,0,.2,1) forwards; }

        .todo-edit-input:focus {
          border-color: rgba(245,166,35,0.45) !important;
        }
        .main-input:focus {
          border-color: rgba(245,166,35,0.3) !important;
          background: rgba(255,255,255,0.04) !important;
        }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{
        width: "100%", maxWidth: 600,
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 28,
      }}>
        <div>
          <h1 style={{
            fontFamily: "'Space Grotesk', system-ui",
            fontWeight: 700, fontSize: 32,
            letterSpacing: "-0.5px", lineHeight: 1,
            marginBottom: 7,
          }}>
            TaskFlow
            <span style={{ color: C.accent }}>.</span>
          </h1>
          <p style={{ fontSize: 13, color: C.textSub, fontWeight: 400 }}>
            {!isLoaded
              ? "Loading…"
              : todos.length === 0
                ? "Add your first task to get started"
                : activeCount === 0
                  ? "All tasks complete — great work! 🎉"
                  : `${activeCount} remaining · ${doneCount} done`}
          </p>
        </div>
        <ProgressRing pct={pct} />
      </div>

      {/* ── MAIN CARD ── */}
      <div style={{
        width: "100%", maxWidth: 600,
        background: C.surface,
        borderRadius: 20,
        border: `1px solid ${C.border}`,
        overflow: "hidden",
        backdropFilter: "blur(20px)",
      }}>

        {/* ── INPUT ── */}
        <div style={{ display: "flex", gap: 10, padding: "20px 20px 0" }}>
          <input
            ref={inputRef}
            className="main-input"
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addTodo()}
            placeholder="Add a new task…"
            maxLength={200}
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.03)",
              border: `1.5px solid ${C.border}`,
              borderRadius: 12,
              padding: "12px 16px",
              color: C.text,
              fontSize: 14,
              transition: "border-color 0.2s, background 0.2s",
            }}
          />
          <button
            onClick={addTodo}
            disabled={!inputActive}
            style={{
              background: inputActive ? C.accentDim : "rgba(255,255,255,0.04)",
              border: `1.5px solid ${inputActive ? C.accentGlow : C.border}`,
              borderRadius: 12,
              padding: "0 18px", height: 46,
              display: "flex", alignItems: "center", gap: 6,
              color: inputActive ? C.accent : C.textMuted,
              fontSize: 14, fontWeight: 600,
              cursor: inputActive ? "pointer" : "not-allowed",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { if (inputActive) e.currentTarget.style.background = "rgba(245,166,35,0.2)"; }}
            onMouseLeave={e => { if (inputActive) e.currentTarget.style.background = C.accentDim; }}
          >
            <PlusIcon /> Add
          </button>
        </div>

        {/* ── FILTER TABS ── */}
        <div style={{
          display: "flex", alignItems: "center",
          gap: 4, padding: "16px 20px",
          borderBottom: `1px solid ${C.border}`,
        }}>
          {[["all", "All", todos.length], ["active", "Active", activeCount], ["completed", "Done", doneCount]]
            .map(([val, label, count]) => {
              const active = filter === val;
              return (
                <button key={val}
                  onClick={() => setFilter(val)}
                  style={{
                    background: active ? C.accentDim : "transparent",
                    border: `1px solid ${active ? C.accentGlow : "transparent"}`,
                    borderRadius: 8,
                    padding: "6px 13px",
                    color: active ? C.accent : C.textSub,
                    fontSize: 13, fontWeight: active ? 600 : 400,
                    display: "flex", alignItems: "center", gap: 6,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.color = C.accent; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.color = C.textSub; }}
                >
                  {label}
                  <span style={{
                    background: active ? "rgba(245,166,35,0.2)" : "rgba(255,255,255,0.07)",
                    borderRadius: 99, padding: "1px 7px",
                    fontSize: 11, fontWeight: 600,
                    color: active ? C.accent : C.textSub,
                    transition: "all 0.2s",
                  }}>
                    {count}
                  </span>
                </button>
              );
          })}

          {/* Toggle-all shortcut */}
          {todos.length > 0 && (
            <button
              onClick={toggleAll}
              style={{
                marginLeft: "auto",
                background: "none", border: "none",
                fontSize: 12, color: C.textMuted,
                padding: "4px 8px", borderRadius: 6,
                transition: "color 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = C.accent}
              onMouseLeave={e => e.currentTarget.style.color = C.textMuted}
            >
              {allDone ? "Mark all active" : "Mark all done"}
            </button>
          )}
        </div>

        {/* ── TASK LIST — delegated click handler ── */}
        <div
          onClick={handleDelegate}
          style={{ minHeight: 90, maxHeight: 440, overflowY: "auto" }}
        >
          {filtered.length === 0 ? (

            /* ── Empty State ── */
            <div style={{
              padding: "60px 20px",
              textAlign: "center",
              color: C.textMuted,
              display: "flex", flexDirection: "column", alignItems: "center",
            }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>
                {filter === "completed" ? "○" : filter === "active" ? "✓" : "⊕"}
              </div>
              <p style={{ fontSize: 14 }}>
                {filter === "completed" ? "No completed tasks yet" :
                 filter === "active"    ? "All tasks completed! 🎉" :
                                         "No tasks yet — add one above"}
              </p>
            </div>

          ) : filtered.map((todo, index) => {
            const isEditing = editingId === todo.id;
            const isHovered = hovered === todo.id;

            return (
              <div
                key={todo.id}
                data-todo-id={todo.id}
                className={newIds.has(todo.id) ? "todo-new" : ""}
                onMouseEnter={() => setHovered(todo.id)}
                onMouseLeave={() => setHovered(null)}
                onDoubleClick={() => startEdit(todo)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "14px 20px",
                  borderBottom: index < filtered.length - 1
                    ? "1px solid rgba(255,255,255,0.04)"
                    : "none",
                  background: isHovered ? C.rowHover : "transparent",
                  transition: "background 0.15s",
                }}
              >
                {/* Checkbox */}
                <Checkbox checked={todo.completed} />

                {/* Text / Edit input */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {isEditing ? (
                    <input
                      ref={editRef}
                      className="todo-edit-input"
                      type="text"
                      value={editText}
                      maxLength={200}
                      onChange={e => setEditText(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter")  { e.stopPropagation(); confirmEdit(todo.id); }
                        if (e.key === "Escape") { e.stopPropagation(); cancelEdit(); }
                      }}
                      onBlur={() => confirmEdit(todo.id)}
                      onClick={e => e.stopPropagation()}
                      style={{
                        width: "100%",
                        background: "rgba(245,166,35,0.06)",
                        border: "1.5px solid rgba(245,166,35,0.22)",
                        borderRadius: 8,
                        padding: "5px 10px",
                        color: C.text,
                        fontSize: 14,
                        transition: "border-color 0.2s",
                      }}
                    />
                  ) : (
                    <span
                      title={!todo.completed ? "Double-click to edit" : undefined}
                      style={{
                        display: "block",
                        fontSize: 14,
                        color: todo.completed ? C.textMuted : "rgba(240,238,248,0.9)",
                        textDecoration: todo.completed ? "line-through" : "none",
                        textDecorationColor: "rgba(245,166,35,0.45)",
                        wordBreak: "break-word",
                        cursor: todo.completed ? "default" : "text",
                        transition: "color 0.3s",
                        userSelect: "none",
                      }}
                    >
                      {todo.text}
                    </span>
                  )}
                </div>

                {/* Action buttons — visible on hover, hidden otherwise */}
                {!isEditing && (
                  <div style={{
                    display: "flex", gap: 3, flexShrink: 0,
                    opacity: isHovered ? 1 : 0,
                    transition: "opacity 0.2s",
                  }}>
                    {/* Edit — only on active tasks */}
                    {!todo.completed && (
                      <button
                        data-action="edit"
                        title="Edit"
                        onClick={e => { e.stopPropagation(); startEdit(todo); }}
                        style={{
                          width: 30, height: 30, padding: 0,
                          borderRadius: 7, border: "none",
                          background: "transparent",
                          color: "rgba(240,238,248,0.3)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "color 0.2s, background 0.2s",
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.color = C.accent;
                          e.currentTarget.style.background = C.accentDim;
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.color = "rgba(240,238,248,0.3)";
                          e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <EditIcon />
                      </button>
                    )}

                    {/* Delete */}
                    <button
                      data-action="delete"
                      title="Delete"
                      onClick={e => { e.stopPropagation(); deleteTodo(todo.id); }}
                      style={{
                        width: 30, height: 30, padding: 0,
                        borderRadius: 7, border: "none",
                        background: "transparent",
                        color: "rgba(240,238,248,0.3)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "color 0.2s, background 0.2s",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.color = C.danger;
                        e.currentTarget.style.background = C.dangerDim;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.color = "rgba(240,238,248,0.3)";
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── FOOTER ── */}
        {todos.length > 0 && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 20px",
            borderTop: `1px solid ${C.border}`,
          }}>
            <span style={{ fontSize: 12, color: C.textMuted }}>
              {activeCount} item{activeCount !== 1 ? "s" : ""} left
            </span>
            {doneCount > 0 && (
              <button
                onClick={clearCompleted}
                style={{
                  background: "none", border: "none",
                  fontSize: 12, color: C.textMuted,
                  padding: "4px 6px", borderRadius: 4,
                  transition: "color 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.color = C.danger}
                onMouseLeave={e => e.currentTarget.style.color = C.textMuted}
              >
                Clear completed
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── HINT ── */}
      <p style={{ marginTop: 18, fontSize: 12, color: C.textMuted, textAlign: "center" }}>
        Tasks saved automatically · Double-click a task to edit
      </p>
    </div>
  );
}
