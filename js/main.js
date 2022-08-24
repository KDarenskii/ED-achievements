const form = document.querySelector("#form");
const taskList = document.querySelector("#tasksList");
const addTaskButton = document.querySelector("#addTaskBtn");
const taskInput = document.querySelector("#taskInput");
const emptyList = document.querySelector("#emptyList")
const removeDoneTasksBtn = document.querySelector("#removeDoneTasks");

let tasks = [];

if (localStorage.getItem("tasks")){
    tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks.forEach((task) => createTask(task));
}

showRemoveDoneTasksBtn();
checkEmptyList();

form.addEventListener("submit", addTask);

taskList.addEventListener("click", deleteTask);

taskList.addEventListener("click", markTask);

removeDoneTasksBtn.addEventListener("click", deleteDoneTasks);


function addTask(event){
    event.preventDefault();

    const inputText = taskInput.value;

    const newTask = {
        id: Date.now(),
        text: inputText,
        mark: false
    }

    createTask(newTask);

    tasks.push(newTask);
    saveToLocalStorage();

    taskInput.value = '';
    taskInput.focus();

    checkEmptyList();
}

function deleteTask(event){
    if (event.target.dataset.action !== "delete") return

    const taskItem = event.target.closest(".task-item");

    
    const itemId = +taskItem.id;
    tasks = tasks.filter((task) => task.id !== itemId);
    saveToLocalStorage();

    taskItem.remove();

    showRemoveDoneTasksBtn();
    checkEmptyList();
}

function markTask(event){
    if (event.target.dataset.action !== "done") return

    const taskItem = event.target.closest(".task-item");
    const taskTitle = taskItem.querySelector(".task-title");
    taskTitle.classList.toggle("task-title--done");

    const idItem = +taskItem.id;
    const task = tasks.find((task) => idItem === task.id);
    task.mark = !task.mark;
    saveToLocalStorage();

    showRemoveDoneTasksBtn();
}

function checkEmptyList(){
    taskList.querySelector(".task-item") ? emptyList.classList.add("none") : emptyList.classList.remove("none");
}

function showRemoveDoneTasksBtn(){
    taskList.querySelector(".task-title--done") ? removeDoneTasksBtn.classList.remove("none") : removeDoneTasksBtn.classList.add("none");
}

function deleteDoneTasks(){
    if (taskList.querySelector(".task-title--done")){
        const taskTitles = taskList.querySelectorAll(".task-title--done");

        tasks = tasks.filter((task) => task.mark === false);
        saveToLocalStorage();

        taskTitles.forEach((taskTitle) => {
            const taskItem = taskTitle.closest(".task-item");
            taskItem.remove();
        })

        showRemoveDoneTasksBtn();
        checkEmptyList();

    }
}

function saveToLocalStorage(){
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function createTask(task){

    const cssClass = task.mark ? 'task-title task-title--done' : 'task-title';
    
    const taskHTML = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
                        <span class="${cssClass}">${task.text}</span>
                        <div class="task-item__buttons">
                            <button type="button" data-action="done" class="btn-action">
                                <img src="./img/tick.svg" alt="Done" width="18" height="18">
                            </button>
                            <button type="button" data-action="delete" class="btn-action">
                                <img src="./img/cross.svg" alt="Done" width="18" height="18">
                            </button>
                        </div>
                    </li>`;

    taskList.insertAdjacentHTML("beforeend", taskHTML);
}