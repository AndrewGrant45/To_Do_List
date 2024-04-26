// Retrieve todo list from local storage or initialize an empty array
let todoList = JSON.parse(localStorage.getItem("todoList")) || [];
const todoInputElement = document.getElementById("todoInput");
const todoListElement = document.getElementById("todoList");
const todoCountElement = document.getElementById("todoCount");
const addTaskButton = document.querySelector(".btn");
const deleteAllTasksButton = document.getElementById("deleteButton");

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  addTaskButton.addEventListener("click", addTask);
  todoInputElement.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevents default Enter key behavior
      addTask();
    }
  });
  deleteAllTasksButton.addEventListener("click", deleteAllTasks);
  displayTasks();
});

function addTask() {
  const newTaskText = todoInputElement.value.trim();
  if (newTaskText !== "") {
    const dueDateInputElement = document.getElementById("dueDateInput");
    const dueDate = new Date(dueDateInputElement.value);
    const reminderInputElement = document.getElementById("reminderInput");
    const reminderTime = new Date(
      dueDate.getFullYear(),
      dueDate.getMonth(),
      dueDate.getDate(),
      reminderInputElement.value.split(":")[0],
      reminderInputElement.value.split(":")[1]
    );
    const now = new Date();
    const timeDifference = reminderTime - now;

    todoList.push({
      text: newTaskText,
      isCompleted: false,
      dueDate,
      reminderTime,
      timeDifference,
    });

    saveToLocalStorage();
    todoInputElement.value = "";
    displayTasks();

    if (timeDifference > 0) {
      setTimeout(function () {
        alert(`Reminder: Task "${newTaskText}" is due now.`);
      }, timeDifference);
    }
  }
}

function displayTasks() {
  todoListElement.innerHTML = "";
  todoList.forEach((item, index) => {
    const pElement = document.createElement("p");
    pElement.innerHTML = `
      <div class="todo-container">
        <input type="checkbox" class="todo-checkbox" id="input-${index}" ${
      item.isCompleted ? "checked" : ""
    }>
        <p id="todo-${index}" class="${
      item.isCompleted ? "disabled" : ""
    }" onclick="editTask(${index})">${item.text}</p>
      </div>
    `;
    pElement.querySelector(".todo-checkbox").addEventListener("change", () =>
      toggleTask(index)
    );
    todoListElement.appendChild(pElement);
  });
  todoCountElement.textContent = todoList.length;
}

function editTask(index) {
  const todoItemElement = document.getElementById(`todo-${index}`);
  const existingTaskText = todoList[index].text;
  const inputElement = document.createElement("input");

  inputElement.value = existingTaskText;
  todoItemElement.replaceWith(inputElement);
  inputElement.focus();

  inputElement.addEventListener("blur", function () {
    const updatedTaskText = inputElement.value.trim();
    if (updatedTaskText) {
      todoList[index].text = updatedTaskText;
      saveToLocalStorage();
    }
    displayTasks();
  });
}

function toggleTask(index) {
  todoList[index].isCompleted = !todoList[index].isCompleted;
  saveToLocalStorage();
  displayTasks();
}

function deleteAllTasks() {
  todoList = [];
  saveToLocalStorage();
  displayTasks();
}

function saveToLocalStorage() {
  localStorage.setItem("todoList", JSON.stringify(todoList));
}