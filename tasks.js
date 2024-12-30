document.addEventListener("DOMContentLoaded", function() {
    const taskList = document.getElementById('task-list');

    // Example tasks data with task id, description, and status
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
            taskItem.id = `task-${task.id}`; // Set task ID for easy referencing
            taskItem.innerHTML = `
                <p>${task.description}</p>
                <button onclick="performTask(${task.id})">${task.status === 'inactive' ? 'Perform' : 'Claim'}</button>
            `;
            taskList.appendChild(taskItem);
        });
    }

    // Handle task action (perform or claim)
    function performTask(taskId) {
        const task = tasks.find(t => t.id === taskId); // Get task by ID
        const taskItem = document.querySelector(`#task-${taskId}`); // Select the task item in the DOM
        const button = taskItem.querySelector('button'); // Get the button element for this task

        if (task.status === 'inactive') {
            // Start performing the task (e.g., set to in-progress)
            task.status = 'in-progress';
            button.textContent = 'Performing...'; // Change button text
            setTimeout(() => {
                // Task completed after 5 seconds (simulating task completion)
                task.status = 'completed';
                button.textContent = 'Claim'; // Change button text to Claim
                renderTasks(); // Re-render task list to update button text
            }, 5000); // Simulate task completion after 5 seconds
        } else if (task.status === 'completed') {
            // If task is completed, allow the user to claim it and reset it back to inactive
            task.status = 'inactive';
            button.textContent = 'Perform'; // Reset button text to "Perform"
            alert(`You have claimed your reward for task: "${task.description}"!`); // Notify user of claim
            renderTasks(); // Re-render task list to update button text
        }
    }

    // Initial render of tasks
    renderTasks();
});
