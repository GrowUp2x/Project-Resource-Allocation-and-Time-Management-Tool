// app.js
const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const taskSelect = document.getElementById('task-select');
const timeTrackingForm = document.getElementById('time-tracking-form');
const timeLeftDisplay = document.getElementById('time-left').querySelector('span');
const bottleneckDisplay = document.getElementById('bottleneck');
const progressBar = document.getElementById('progress-bar');

// Data stores
const tasks = [];
const resources = {
    John: 0,
    Alice: 0,
    Bob: 0,
};
let totalTime = 0;

// Task form submission
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const taskName = document.getElementById('task-name').value;
    const employee = document.getElementById('employee').value;
    const deadline = document.getElementById('deadline').value;
    const priority = document.getElementById('priority').value;

    const task = {
        name: taskName,
        assignedTo: employee,
        deadline: new Date(deadline),
        priority: priority,
        timeSpent: 0,
    };

    tasks.push(task);
    updateTaskList();
    updateTimeTrackingOptions();
    updateResourceChart();
    updateProgressBar();
});

// Update task list
function updateTaskList() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = `${task.name} (Assigned to: ${task.assignedTo}, Deadline: ${task.deadline.toDateString()}, Priority: ${task.priority})`;
        taskList.appendChild(li);
    });
}

// Update time tracking options
function updateTimeTrackingOptions() {
    taskSelect.innerHTML = '';
    tasks.forEach((task, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = task.name;
        taskSelect.appendChild(option);
    });
}

// Time tracking form submission
timeTrackingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const taskIndex = taskSelect.value;
    const timeSpent = parseFloat(document.getElementById('time-spent').value);

    if (taskIndex !== "" && timeSpent >= 0) {
        tasks[taskIndex].timeSpent += timeSpent;
        resources[tasks[taskIndex].assignedTo] += timeSpent;
        totalTime += timeSpent;
        updateResourceChart();
        updateTimeLeft();
        updateBottleneck();
        updateProgressBar();
    }
});

// Update the resource allocation chart using Chart.js
function updateResourceChart() {
    const ctx = document.getElementById('resource-chart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['John', 'Alice', 'Bob'],
            datasets: [{
                label: 'Time Spent (hours)',
                data: Object.values(resources),
                backgroundColor: 'rgba(76, 175, 80, 0.6)',
                borderColor: 'rgba(76, 175, 80, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                }
            }
        }
    });
}

// Update time left display
function updateTimeLeft() {
    const remainingTime = tasks.reduce((acc, task) => {
        return acc + (task.deadline.getTime() - Date.now()) / (1000 * 3600);
    }, 0);
    timeLeftDisplay.textContent = remainingTime.toFixed(2);
}

// Update bottleneck display
function updateBottleneck() {
    const bottleneck = tasks.reduce((acc, task) => {
        return task.timeSpent < acc.timeSpent ? task : acc;
    }, tasks[0]);

    bottleneckDisplay.textContent = bottleneck ? bottleneck.name : 'None';
}

// Update progress bar based on tasks' completion status
function updateProgressBar() {
    const totalEstimatedTime = tasks.reduce((acc, task) => acc + (task.deadline.getTime() - Date.now()) / (1000 * 3600), 0);
    const timeSpent = tasks.reduce((acc, task) => acc + task.timeSpent, 0);
    const progress = (timeSpent / totalEstimatedTime) * 100;
    progressBar.style.width = `${progress}%`;
}
