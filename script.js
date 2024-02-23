const todoForm = document.querySelector('[data-form]');
const newTaskInput = document.querySelector('[data-new-task-input]');
const tasksContainer = document.querySelector('[data-tasks-container]');
const taskTemplate = document.querySelector('[data-task-template]');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

todoForm.addEventListener('submit', ((e) => {
    e.preventDefault();
    let taskName = newTaskInput.value;
    if (taskName == null || taskName === '') return;
    const task = createTask(taskName);
    newTaskInput.value = null;
    tasks.push(task);
    saveAndRender();
}));

function createTask(name) {
    return {
        id: Date.now().toString(),
        name: name,
        isComplete: false
    }
}

tasksContainer.addEventListener('click', e => {
    const taskId = e.target.parentElement.id;
    if (e.target.tagName.toLowerCase() === 'input') {
        const selectedTask = tasks.find(task => task.id === taskId);
        selectedTask.isComplete = e.target.checked;
        saveAndRender();
    } else if (e.target.classList.contains('btn-delete')) {
        deleteTask(taskId);
        saveAndRender();
    } else if (e.target.classList.contains('btn-edit')) {
        editTextTask(taskId);
    } else if (e.target.classList.contains('btn-done')) {
        saveChanges(taskId);
        saveAndRender();
    }
});

function saveAndRender() {
    save();
    render(tasks);
}

function save() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function render(tasks) {
    clearElement(tasksContainer);
    tasks.forEach(task => {
        taskElem = document.importNode(taskTemplate.content, true);
        const checkbox = taskElem.querySelector('input');
        const label = taskElem.querySelector('label');
        const taskItem = taskElem.querySelector('.task');
        taskItem.id = task.id;
        checkbox.checked = task.isComplete;
        label.htmlFor = task.id;
        label.textContent = task.name;
        tasksContainer.appendChild(taskElem);
    });
}

function deleteTask(id) {
    tasks = tasks.filter((task => task.id !== id));
}

function editTextTask(id) {
    const textTask = document.querySelector("label[for ='" + id + "']");
    textTask.setAttribute('contenteditable', "true");
    textTask.focus();
    moveCursorToEnd(textTask);
}

const moveCursorToEnd = (element) => {
    const range = document.createRange();
    range.setStart(element.childNodes[0], element.textContent.length);
    const selection = window.getSelection();
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
}

function saveChanges(id) {
    const textTask = document.querySelector("label[for ='" + id + "']");
    const elem = tasks.find(task => task.id === id);
    if (elem.name === textTask.textContent) return;
    elem.name = textTask.textContent;
}

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

document.querySelector('[data-delete-all-tasks]').addEventListener('click', (() => {
    clearAllTasks()
}));

function clearAllTasks() {
    tasks = [];
    saveAndRender();
}

render(tasks);