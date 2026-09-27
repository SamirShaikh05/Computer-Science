const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");

async function loadTasks() {
    const response = await fetch("/api/tasks");

    const tasks = await response.json();

    taskList.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");

        li.textContent = task.title;

        taskList.appendChild(li);
    });
}

async function addTask() {
    const title = taskInput.value.trim();

    if (!title) {
        return;
    }

    await fetch("/api/tasks", {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            title: title
        })
    });

    taskInput.value = "";

    loadTasks();
}

addButton.addEventListener("click", addTask);

loadTasks();