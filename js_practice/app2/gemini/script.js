// script.js
class Task {
    constructor(title, description, dueDate, priority, completed = false) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = completed;
    }
}

let tasks = [];

function loadTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks).map(task => new Task(task.title, task.description, task.dueDate, task.priority, task.completed));
    } else {
        // Add some sample tasks if local storage is empty
        tasks = [
            new Task("Grocery Shopping", "Buy milk, eggs, bread", "2024-03-15", "high"),
            new Task("Pay Bills", "Electricity, internet", "2024-03-20", "medium"),
        ];
        saveTasksToLocalStorage(); // Save the sample tasks
    }
    renderTasks();
}


function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = ''; // Clear existing tasks

    tasks.forEach((task, index) => {
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('task');

        const taskTitle = document.createElement('span');
        taskTitle.classList.add('task-title')
        taskTitle.textContent = task.title;

        const taskButtons = document.createElement('div');
        taskButtons.classList.add('task-buttons');

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => editTask(index)); // Add event listener
        taskButtons.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteTask(index)); // Add event listener
        taskButtons.appendChild(deleteButton);


        taskDiv.appendChild(taskTitle);
        taskDiv.appendChild(taskButtons);
        taskList.appendChild(taskDiv);
    });
}

function addTask(event) {
    event.preventDefault(); // Prevent form submission

    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const dueDate = document.getElementById('task-due-date').value;
    const priority = document.getElementById('task-priority').value;

    const newTask = new Task(title, description, dueDate, priority);
    tasks.push(newTask);
    saveTasksToLocalStorage();
    renderTasks();

    // Clear the form
    document.getElementById('task-form').reset();
}

function editTask(index) {
    // Implement edit functionality here (e.g., populate the form with task details)
    console.log("Editing task:", index);
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasksToLocalStorage();
    renderTasks();
}


document.addEventListener('DOMContentLoaded', () => {
    loadTasksFromLocalStorage();

    const taskForm = document.getElementById('task-form');
    taskForm.addEventListener('submit', addTask);

    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        // You can also save the theme preference to localStorage here.
    });
});