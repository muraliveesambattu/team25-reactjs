// Toggle between light/dark mode
const themeToggleBtn = document.getElementById("theme-toggle");
themeToggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
});

// Get stored theme on page load
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
}

// Task Manager Logic
const addTaskBtn = document.getElementById("add-task");
const taskTitleInput = document.getElementById("task-title");
const taskDescInput = document.getElementById("task-desc");
const taskDateInput = document.getElementById("task-date");
const taskPriorityInput = document.getElementById("task-priority");
const taskList = document.getElementById("task-list");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach(task => {
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task");
    taskDiv.innerHTML = `
      <h3>${task.title} <span>(${task.priority})</span></h3>
      <p>${task.description}</p>
      <p>Due: ${task.dueDate}</p>
      <button class="delete-task">Delete</button>
    `;
    taskList.appendChild(taskDiv);
  });
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

addTaskBtn.addEventListener("click", () => {
  const task = {
    title: taskTitleInput.value,
    description: taskDescInput.value,
    dueDate: taskDateInput.value,
    priority: taskPriorityInput.value
  };
  tasks.push(task);
  saveTasks();
  renderTasks();
  taskTitleInput.value = "";
  taskDescInput.value = "";
  taskDateInput.value = "";
  taskPriorityInput.value = "low";
});

// Initial render
renderTasks();
