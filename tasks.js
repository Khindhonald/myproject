// Example tasks data and button behavior for the Tasks page
document.addEventListener("DOMContentLoaded", function() {
    const taskList = document.getElementById('task-list');

    const tasks = [
        { id: 1, description: "Tap the coin 5 times", status: "inactive" },
        { id: 2, description: "Click on the 'Boost' button", status: "inactive" },
    ];

    // Render task list
    function renderTasks() {
        taskList.innerHTML = ""; // Clear existing tasks
        tasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.classList.add('task-item');
            taskItem.innerHTML = `
                <p>${task.description}</p>
                <button onclick="performTask(${task.id})">${task.status === 'inactive' ? 'Perform' : 'Claim'}</button>
            `;
            taskList.appendChild(taskItem);
        });
    }

    // Handle task action (perform or claim)
    function performTask(taskId) {
        const task = tasks.find(t => t.id === taskId);
        const taskItem = document.querySelector(`#task-${taskId}`);
        const button = taskItem.querySelector('button');

        if (task.status === 'inactive') {
            task.status = 'in-progress';
            button.textContent = 'Performing...';
            setTimeout(() => {
                task.status = 'completed';
                button.textContent = 'Claim';
            }, 5000);
        } else if (task.status === 'completed') {
            task.status = 'inactive';
            button.textContent = 'Perform';
        }

        renderTasks();
    }

    renderTasks();
});
