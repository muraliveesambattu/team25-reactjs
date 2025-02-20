class Task {
    constructor(id, title, description, dueDate, priority, completed = false) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = completed;
    }
}

class TaskManager {
    constructor() {
        this.tasks = [];
        this.loadTasks();
    }

    addTask(task) {
        this.tasks.push(task);
        this.saveTasks();
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.saveTasks();
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.tasks = storedTasks.map(t => new Task(
            t.id,
            t.title,
            t.description,
            t.dueDate,
            t.priority,
            t.completed
        ));
    }
}

// Initialize Task Manager
const taskManager = new TaskManager();

// DOM Elements
const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const themeToggle = document.getElementById('themeToggle');

// Theme Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
});

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') document.body.classList.add('dark-theme');

// Render Tasks
function renderTasks() {
    taskList.innerHTML = '';
    taskManager.tasks.forEach(task => {
        const taskEl = document.createElement('div');
        taskEl.className = 'task';
        taskEl.draggable = true;
        taskEl.dataset.id = task.id;
        taskEl.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <p>Due: ${new Date(task.dueDate).toLocaleDateString()}</p>
            <p>Priority: ${task.priority}</p>
            <button onclick="deleteTask('${task.id}')">Delete</button>
        `;
        taskList.appendChild(taskEl);
    });
}

// Form Submission
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newTask = new Task(
        Date.now().toString(),
        document.getElementById('taskTitle').value,
        document.getElementById('taskDesc').value,
        document.getElementById('taskDueDate').value,
        document.getElementById('taskPriority').value
    );
    taskManager.addTask(newTask);
    renderTasks();
    taskForm.reset();
});

// Delete Task (global function for inline onclick)
window.deleteTask = (taskId) => {
    taskManager.deleteTask(taskId);
    renderTasks();
};

// Initial Render
renderTasks();