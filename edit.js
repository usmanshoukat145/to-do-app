
const params    = new URLSearchParams(window.location.search);
const taskId    = Number(params.get('id'));
if (!taskId) window.location.href = 'index.html'; 

let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
let task  = tasks.find(t => t.id === taskId);
if (!task) window.location.href = 'index.html';

const titleInput   = document.getElementById('edit-title');
const dueInput     = document.getElementById('edit-due');
const completedChk = document.getElementById('edit-completed');

titleInput.value        = task.title;
dueInput.value          = task.due;
completedChk.checked    = task.completed;


document.getElementById('edit-form').addEventListener('submit', e => {
  e.preventDefault();


  task.title     = titleInput.value.trim();
  task.due       = dueInput.value;
  task.completed = completedChk.checked;

  localStorage.setItem('tasks', JSON.stringify(tasks));
  window.location.href = 'index.html';
});
