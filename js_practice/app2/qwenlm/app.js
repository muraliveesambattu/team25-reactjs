// Select DOM elements
const taskForm = document.getElementById('add-task-form');
const taskList = document.getElementById('tasks');
const themeToggle = document.getElementById('theme-toggle');

// Task Class
class Task {
  constructor(title, description, dueDate, priority) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.completed = false;
  }

  toggleComplete() {
    this.completed = !this.completed;
  }
}

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render tasks to the DOM
function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const taskItem = document.createElement('li');
    taskItem.classList.add('task-item');
    if (task.completed) taskItem.classList.add('completed');

    taskItem.innerHTML = `
      <div>
        <strong>${task.title}</strong>
        <p>${task.description}</p>
        <small>Due: ${task.dueDate} | Priority: ${task.priority}</small>
      </div>
      <div class="task-actions">
        <button onclick="toggleTaskCompletion(${index})">Toggle</button>
        <button onclick="deleteTask(${index})">Delete</button>
      </div>
    `;

    taskList.appendChild(taskItem);
  });
}

// Add a new task
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.getElementById('task-title').value;
  const description = document.getElementById('task-description').value;
  const dueDate = document.getElementById('task-due-date').value;
  const priority = document.getElementById('task-priority').value;

  const newTask = new Task(title, description, dueDate, priority);
  tasks.push(newTask);

  saveTasks();
  renderTasks();
  taskForm.reset();
});

// Toggle task completion
function toggleTaskCompletion(index) {
  tasks[index].toggleComplete();
  saveTasks();
  renderTasks();
}

// Delete a task
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

// Theme Toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
  document.body.classList.toggle('light-theme');
  localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
});

// Load theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark-theme');
} else {
  document.body.classList.add('light-theme');
}

// Initial render
renderTasks();