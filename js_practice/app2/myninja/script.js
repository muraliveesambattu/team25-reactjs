// Get elements
const taskList = document.getElementById('tasks');
const taskForm = document.getElementById('task-form');
const addTaskBtn = document.getElementById('add-task-btn');
const themeToggle = document.getElementById('theme-toggle');

// Initialize tasks array
let tasks = [];

// Function to add task to list
function addTask(task) {
    const taskHTML = `
        <li>
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <p>Due Date: ${task.dueDate}</p>
            <p>Priority: ${task.priority}</p>
            <button class="edit-task-btn">Edit</button>
            <button class="remove-task-btn">Remove</button>
        </li>
    `;
    taskList.innerHTML += taskHTML;
}

// Function to handle task form submission
function handleTaskFormSubmission(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const dueDate = document.getElementById('due-date').value;
    const priority = document.getElementById('priority').value;
    const task = { title, description, dueDate, priority };
    tasks.push(task);
    addTask(task);
    taskForm.reset();
}

// Function to handle theme toggle
function handleThemeToggle() {
    document.body.classList.toggle('dark-mode');
}

// Add event listeners
taskForm.addEventListener('submit', handleTaskFormSubmission);
themeToggle.addEventListener('click', handleThemeToggle);

// Initialize tasks from local storage
if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach(addTask);
}

// Save tasks to local storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Call saveTasks function whenever tasks array changes
tasks.forEach((task, index) => {
    taskList.children[index].addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-task-btn')) {
            tasks.splice(index, 1);
            saveTasks();
            taskList.innerHTML = '';
            tasks.forEach(addTask);
        }
    });
});
