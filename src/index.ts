import "core-js/stable";
import "regenerator-runtime/runtime";

import { ref, effect } from "./ref";
import "./styles/main.scss";

interface Todo {
  completed: boolean;
  id: string;
  title: string;
}

interface State {
  loading: boolean;
  todos: Todo[];
}

const $root = document.querySelector("#root")!;

const $heading = generateHeading();
$root.insertAdjacentElement("afterbegin", $heading);

const $form = generateForm();
$root.insertAdjacentElement("beforeend", $form);

const $todosContainer = generateTodosContainer();
$root.insertAdjacentElement("beforeend", $todosContainer);

const stateRef = ref<State>({
  loading: true,
  todos: [],
});

effect(() => {
  const newState = stateRef.value;
  if (newState.loading) {
    $todosContainer.innerHTML = "Loading...";
  } else {
    appendTodoItemsToContainer(newState.todos);
    localStorage.setItem("__todos__", JSON.stringify(newState.todos));
  }
});

// helpers
function generateId() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

// Actions
function toggleTodo(id: string) {
  stateRef.value = {
    ...stateRef.value,
    todos: stateRef.value.todos.map((td) =>
      td.id === id ? { ...td, completed: !td.completed } : td,
    ),
  };
}

function removeTodo(id: string) {
  stateRef.value = {
    ...stateRef.value,
    todos: stateRef.value.todos.filter((td) => td.id !== id),
  };
}

function addTodo(todo: Todo) {
  stateRef.value = {
    ...stateRef.value,
    todos: [todo, ...stateRef.value.todos],
  };
}

async function fetchTodos() {
  if (localStorage.getItem("__todos__")) {
    console.log("Loading todo items from local storage...");
    const todos: Todo[] = JSON.parse(localStorage.getItem("__todos__")!);
    stateRef.value = { ...stateRef.value, todos, loading: false };
    return;
  }

  console.log("Loading todo items from API...");
  await fetch("https://jsonplaceholder.typicode.com/todos")
    .then((response) => response.json())
    .then((data: Todo[]) => {
      stateRef.value = {
        ...stateRef.value,
        todos: data.slice(0, 25).map((td) => ({ ...td, id: generateId() })),
        loading: false,
      };
    });
  return;
}

// Element helpers
function generateHeading() {
  const heading = document.createElement("h1");
  heading.innerHTML = "TODOS";
  return heading;
}

function generateForm() {
  const form = document.createElement("form");
  form.classList.add("form");

  const input = document.createElement("input");
  input.placeholder = "Todo...";
  input.type = "text";

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.innerHTML = "Add Todo";
  if (localStorage.getItem("__todo_input__")) {
    input.value = localStorage.getItem("__todo_input__") as string;
  }
  input.addEventListener("input", function () {
    localStorage.setItem("__todo_input__", input.value);
  });

  form.addEventListener("submit", function (evt) {
    evt.preventDefault();
    if (!input.value) return;
    addTodo({
      title: input.value,
      completed: false,
      id: generateId(),
    });
    input.value = "";
    localStorage.removeItem("__todo_input__");
  });

  form.appendChild(input);
  form.appendChild(submitButton);

  return form;
}

function generateTodosContainer() {
  const todosContainer = document.createElement("ul");
  todosContainer.classList.add("todos");
  return todosContainer;
}

function generateTodoItem(todo: Todo) {
  const todoEl = document.createElement("li");
  todoEl.classList.add("todo");
  if (todo.completed) todoEl.classList.add("completed");
  todoEl.dataset.todoId = todo.id.toString();
  todoEl.dataset.completed = String(todo.completed);
  todoEl.addEventListener("click", () => toggleTodo(todo.id));

  const checkboxEl = document.createElement("input");
  checkboxEl.type = "checkbox";
  checkboxEl.checked = todo.completed;
  checkboxEl.id = `todo-checkbox${todo.id}`;

  const labelEl = document.createElement("label");
  labelEl.htmlFor = `todo-checkbox${todo.id}`;
  labelEl.innerHTML = todo.title;

  const removeButton = document.createElement("button");
  removeButton.innerHTML = "x";
  removeButton.addEventListener("click", (evt) => {
    evt.stopPropagation();
    removeTodo(todo.id);
  });

  todoEl.appendChild(checkboxEl);
  todoEl.appendChild(labelEl);
  todoEl.appendChild(removeButton);
  return todoEl;
}

function appendTodoItemsToContainer(todos: Todo[]) {
  $todosContainer.innerHTML = "";
  todos.forEach((todo) => $todosContainer.appendChild(generateTodoItem(todo)));
}

window.addEventListener("load", fetchTodos);
