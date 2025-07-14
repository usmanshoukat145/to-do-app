/* ================================
   Edit‑page logic – edit.js
   ================================ */

/* 1.  Parse task ID from query‑string */
const params    = new URLSearchParams(window.location.search);
const taskId    = Number(params.get('id'));
if (!taskId) window.location.href = 'index.html'; // safety

/* 2.  Load tasks from localStorage & locate the one we’re editing */
let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
let task  = tasks.find(t => t.id === taskId);
if (!task) window.location.href = 'index.html';

/* 3.  Populate form fields */
const titleInput   = document.getElementById('edit-title');
const dueInput     = document.getElementById('edit-due');
const completedChk = document.getElementById('edit-completed');

titleInput.value        = task.title;
dueInput.value          = task.due;
completedChk.checked    = task.completed;

/* 4.  Save handler */
document.getElementById('edit-form').addEventListener('submit', e => {
  e.preventDefault();

  /* Update object */
  task.title     = titleInput.value.trim();
  task.due       = dueInput.value;
  task.completed = completedChk.checked;

  /* Persist & return */
  localStorage.setItem('tasks', JSON.stringify(tasks));
  window.location.href = 'index.html';
});
