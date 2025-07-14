
let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');


const taskForm      = document.getElementById('task-form');
const taskInput     = document.getElementById('task-input');
const dueDateInput  = document.getElementById('due-date-input');
const taskList      = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('.filter-btn');


taskForm.addEventListener('submit', e => {
  e.preventDefault();
  addTask(taskInput.value.trim(), dueDateInput.value);
  taskForm.reset();
});


filterButtons.forEach(btn =>
  btn.addEventListener('click', () => {
    document.querySelector('.filter-btn.bg-blue-600')?.classList.remove('bg-blue-600', 'text-white');
    btn.classList.add('bg-blue-600', 'text-white');
    renderTasks(btn.dataset.filter);
  })
);


setInterval(renderTasks, 60_000);


function addTask(title, dueISO) {
  const newTask = {
    id: Date.now(),
    title,
    due: dueISO,
    completed: false
  };
  tasks.push(newTask);
  saveAndRender();
}

function toggleComplete(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  saveAndRender();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveAndRender();
}

function editTask(id) {

  window.location.href = `edit.html?id=${id}`;
}

function saveAndRender() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks(document.querySelector('.filter-btn.bg-blue-600')?.dataset.filter || 'all');
}

function renderTasks(filter = 'all') {
  taskList.innerHTML = '';

  const now = new Date();
  const list = tasks.filter(t => {
    if (filter === 'completed') return t.completed;
    if (filter === 'overdue')   return !t.completed && new Date(t.due) < now;
    if (filter === 'upcoming')  return !t.completed && new Date(t.due) >= now;
    return true; 
  });

  list.forEach(task => taskList.appendChild(buildTaskItem(task)));
}


function buildTaskItem(task) {
  const li = document.createElement('li');
li.className = `bg-white rounded-2xl shadow-lg shadow-[#c9b4ff]/50 border border-[#e3d7ff]
                p-6 flex items-start justify-between gap-4`;


  const left = document.createElement('div');
  left.className = 'flex items-start gap-3 flex-1';
  const checkbox = document.createElement('input');
  checkbox.type  = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.addEventListener('change', () => toggleComplete(task.id));
  const title = document.createElement('span');
  title.textContent = task.title;
  left.append(checkbox, title);


  const meta = document.createElement('div');
  meta.className = 'text-sm flex flex-col items-end sm:items-start';
  const due = new Date(task.due);
  meta.innerHTML = `
      <span>Due: ${due.toLocaleString()}</span>
      <span class="text-xs ${task.completed ? '' : (due < new Date() ? 'text-red-600' : 'text-blue-600')}">
        ${humanCountdown(due)}
      </span>`;

  
  const actions = document.createElement('div');
  actions.className = 'flex gap-2';

  
  const editBtn = document.createElement('button');
  editBtn.innerHTML = '<i class="fas fa-edit"></i>';
  editBtn.className = 'text-blue-600 hover:text-blue-800';
  editBtn.title = 'Edit';
  editBtn.addEventListener('click', () => editTask(task.id));

 
  const delBtn = document.createElement('button');
  delBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
  delBtn.className = 'text-red-600 hover:text-red-800';
  delBtn.title = 'Delete';
  delBtn.addEventListener('click', () => deleteTask(task.id));

  actions.append(editBtn, delBtn);


  li.append(left, meta, actions);
  return li;
}



function humanCountdown(dateObj) {
  const diff = dateObj - new Date();
  if (isNaN(diff)) return 'Invalid date';

  if (diff <= 0) return 'Past due!';

  const mins = Math.floor(diff / 60000);
  const days = Math.floor(mins / 1440);
  const hours = Math.floor((mins % 1440) / 60);
  const minutes = mins % 60;

  return `${days}d ${hours}h ${minutes}m`;
}


renderTasks();
