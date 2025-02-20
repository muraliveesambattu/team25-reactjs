// script.js
class Task {
    constructor(title, description, dueDate, priority) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = false;
    }

    markComplete() {
        this.completed = true;
    }

    updateTask(title, description, dueDate, priority) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
    }

    getTaskInfo() {
        return {
            title: this.title,
            description: this.description,
            dueDate: this.dueDate,
            priority: this.priority,
            completed: this.completed
        };
    }
}

class TaskManager {
    constructor() {
        this.tasks = [];
        this.loadTasksFromStorage();
    }

    addTask(task) {
        this.tasks.push(task);
        this.saveTasksToStorage();
    }

    removeTask(taskIndex) {
        this.tasks.splice(taskIndex, 1);
        this.saveTasksToStorage();
    }

    updateTask(taskIndex, task) {
        this.tasks[taskIndex] = task;
        this.saveTasksToStorage();
    }

    loadTasksFromStorage() {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            this.tasks = JSON.parse(storedTasks).map(task => new Task(task.title, task.description, task.dueDate, task.priority));
        }
    }

    saveTasksToStorage() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks.map(task => task.getTaskInfo())));
    }
}

const taskManager = new TaskManager();

document.getElementById('add-task-btn').addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Add Task button clicked');
    const taskTitle = document.getElementById('task-title').value;
    const taskDescription = document.getElementById('task-description').value;
    const taskDueDate = document.getElementById('task-due-date').value;
    const taskPriority = document.getElementById('task-priority').value;
    console.log('Task title:', taskTitle);
    console.log('Task description:', taskDescription);
    console.log('Task due date:', taskDueDate);
    console.log('Task priority:', taskPriority);
    const newTask = new Task(taskTitle, taskDescription, taskDueDate, taskPriority);
    console.log('New task created:', newTask);
    taskManager.addTask(newTask);
    console.log('Task added to task manager');
    // Add new task to the task list
    const taskListUl = document.getElementById('task-list-ul');
    const taskListItem = document.createElement('li');
    taskListItem.classList.add('task-item');
    taskListItem.innerHTML = `
        <h3 class="task-title">${newTask.title}</h3>
        <p class="task-description">${newTask.description}</p>
        <p class="task-due-date">Due: ${newTask.dueDate}</p>
        <p class="task-priority">Priority: ${newTask.priority}</p>
        <button class="remove-task-btn" data-task-index="${taskManager.tasks.length - 1}">Remove</button>
    `;
    taskListUl.appendChild(taskListItem);
});

// Add event listener to remove task button
document.getElementById('task-list-ul').addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-task-btn')) {
        const taskIndex = e.target.dataset.taskIndex;
        console.log('Removing task at index:', taskIndex);
        taskManager.removeTask(taskIndex);
        console.log('Task removed from task manager');
        // Remove task from task list
        const taskListUl = document.getElementById('task-list-ul');
        const taskListItem = taskListUl.children[taskIndex];
        taskListUl.removeChild(taskListItem);
    }
});