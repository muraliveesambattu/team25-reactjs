class Task {
    constructor(title, description, dueDate, priority) {
        this.title = title;
        this.description = description;
        this.dueDate = new Date(dueDate);
        this.priority = priority;
        this.completed = false;
    }
}

const taskList = JSON.parse(localStorage.getItem('tasks')) || [];
const taskForm = document.getElementById('taskForm');
const taskListElement = document.getElementById('taskList');
const themeToggleButton = document.getElementById('themeToggle');

function displayTasks() {
    taskListElement.innerHTML = '';
    taskList.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `
            <strong>${task.title}</strong> - ${task.description} (Due: ${task.dueDate.toLocaleDateString()})
            <button onclick="toggleComplete(${index})">${task.completed ? 'Undo' : 'Complete'}</button>
            <button onclick="deleteTask(${index})">Delete</button>`;
        taskListElement.appendChild(li);
    });
}

function addTask(event) {
    event.preventDefault();
    
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const dueDate = document.getElementById('taskDueDate').value;
    const priority = document.getElementById('taskPriority').value;

    const newTask = new Task(title, description, dueDate, priority);
    taskList.push(newTask);
    
    localStorage.setItem('tasks', JSON.stringify(taskList));
    
    taskForm.reset();
    
    displayTasks();
}

function deleteTask(index) {
    taskList.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(taskList));
    
    displayTasks();
}

function toggleComplete(index) {
    taskList[index].completed = !taskList[index].completed;
    
    localStorage.setItem('tasks', JSON.stringify(taskList));
    
    displayTasks();
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
}

themeToggleButton.addEventListener('click', toggleTheme);
taskForm.addEventListener('submit', addTask);
document.addEventListener('DOMContentLoaded', displayTasks);
