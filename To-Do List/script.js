/* =========================================
   1. SELECTING HTML ELEMENTS
   ========================================= */

// Input field where the user enters a task
let taskInp = document.querySelector("#taskInput");

// Button used to add a new task
let addBtn = document.querySelector("#addTaskBtn");

// Container where all tasks will be displayed
let taskList = document.querySelector("#taskList");

// Empty state section shown when no tasks are available
let emptyState = document.querySelector("#emptyState");

// Element displaying the total number of tasks
let totalTasks = document.querySelector("#taskCount");

// Element displaying the completion percentage
let progressPercentage = document.querySelector("#progressPercent");

// Progress bar element
let progressBar = document.querySelector("#progressFill");

// Element displaying the remaining task count
let remainingTasks = document.querySelector("#remainingCount");

// All filter buttons: All, Active, and Completed
let filterBtns = document.querySelectorAll(".filter");

// Heading and paragraph inside the empty state
let heading = document.querySelector(".empty-state h2");
let paragraph = document.querySelector(".empty-state p");

/* =========================================
   2. APPLICATION STATE
   ========================================= */

// Array that stores every task object
let allTasks = [];

// Unique ID counter for each task
let count = 0;

// Stores the currently selected filter
// Possible values: "all", "active", "completed"
let currentFilter = "all";

/* =========================================
   3. UPDATE PROGRESS
   ========================================= */

function updateProgress() {
  // Create an array containing only completed tasks
  let completedArray = allTasks.filter(function (val) {
    return val.completed === true;
  });

  // Create an array containing only incomplete tasks
  let newArray = allTasks.filter(function (val) {
    return val.completed === false;
  });

  // Update the total task counter
  totalTasks.textContent = allTasks.length;

  // Update the remaining task counter
  remainingTasks.textContent = newArray.length;

  // Calculate the progress percentage
  // If there are no tasks, progress should remain at 0%
  if (allTasks.length === 0) {
    progressPercentage.textContent = "0%";
    progressBar.style.width = "0%";
  } else {
    // Number of completed tasks
    let ct = completedArray.length;

    // Total number of tasks
    let at = allTasks.length;

    // Formula:
    // Completed tasks / Total tasks × 100
    let percentage = (ct / at) * 100;

    // Display the calculated percentage
    progressPercentage.textContent = percentage + "%";

    // Change the width of the progress bar
    progressBar.style.width = percentage + "%";
  }
}

/* =========================================
   4. DISPLAY TASKS ON THE SCREEN
   ========================================= */

function renderTasks() {
  // Clear the existing task list before rendering again
  // This prevents duplicate tasks from appearing
  taskList.innerHTML = "";

  // Get tasks according to the selected filter
  // For example: all, active, or completed
  let displayTasks = filterTasks(allTasks, currentFilter);

  // Show the empty state when there are no filtered tasks
  if (displayTasks.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
  }

  // Change the empty state heading according to the filter
  if (currentFilter === "all") {
    heading.textContent = "Add tasks here !";
  } else if (currentFilter === "active") {
    heading.textContent = "No active task available !";
  } else {
    heading.textContent = "No task is completed yet !";
  }

  // Loop through every task that should be displayed
  displayTasks.forEach(function (task) {
    // Create a new list item for the task
    let list = document.createElement("li");

    // Add styling class to the list item
    list.classList.add("task-item");

    // If the task is completed, add the completed class
    // This class can apply styles such as line-through
    if (task.completed === true) {
      list.classList.add("completed");
    }

    // Create a container for the checkbox and task text
    let div = document.createElement("div");
    div.classList.add("task-left");

    // Create a checkbox for completing the task
    let checkbox = document.createElement("input");

    // Set the input type to checkbox
    checkbox.setAttribute("type", "checkbox");

    // Match the checkbox state with the task's completed value
    checkbox.checked = task.completed;

    // Create a span to display the task text
    let span = document.createElement("span");

    // Add the task's text inside the span
    span.textContent = task.task;

    // Apply text styling if the task is completed
    if (task.completed === true) {
      span.classList.add("task-text");
    }

    // Create the delete button
    let deleteBtn = document.createElement("button");

    // Add the delete button's CSS class
    deleteBtn.classList.add("delete-task");

    // Display the multiplication symbol as the delete icon
    deleteBtn.textContent = "×";

    // Set the delete button text color to red
    deleteBtn.style.color = "red";

    // Add checkbox and text to the left-side container
    div.appendChild(checkbox);
    div.appendChild(span);

    // Add the left-side container to the list item
    list.appendChild(div);

    // Add the delete button to the list item
    list.appendChild(deleteBtn);

    // Add the complete list item to the task list
    taskList.appendChild(list);

    /* =========================================
       CHECKBOX EVENT
       ========================================= */

    // Run this function whenever the checkbox changes
    checkbox.addEventListener("change", function () {
      // Update the task's completed value
      // checkbox.checked returns true or false
      task.completed = checkbox.checked;

      // Re-render the tasks and update progress
      refreshUI();
    });

    /* =========================================
       DELETE BUTTON EVENT
       ========================================= */

    // Run this function when the delete button is clicked
    deleteBtn.addEventListener("click", function () {
      // Find the position of the selected task in allTasks
      // findIndex() returns the index of the matching task
      let taskIndex = allTasks.findIndex(function (item) {
        // Match tasks using their unique ID
        return item.id === task.id;
      });

      // If a matching task was found
      // -1 means that no matching task was found
      if (taskIndex !== -1) {
        // Remove one task from the array
        // taskIndex tells splice() where to remove it
        allTasks.splice(taskIndex, 1);
      }

      // Update the screen after deleting the task
      refreshUI();
    });
  });
}

/* =========================================
   5. REFRESH THE USER INTERFACE
   ========================================= */

function refreshUI() {
  // Display the latest tasks according to the filter
  renderTasks();

  // Update total tasks, remaining tasks, and progress
  updateProgress();
}

/* =========================================
   6. ADD A NEW TASK
   ========================================= */

function addTask() {
  // Get the input value and remove extra spaces
  let displayInp = taskInp.value.trim();

  // Prevent empty tasks from being added
  if (displayInp === "") {
    // Show a helpful placeholder message
    taskInp.setAttribute("placeholder", "Enter Valid Input");

    // Stop the function here
    return;
  }

  // Increase the counter to create a unique ID
  count++;

  // Create an object representing the new task
  let taskObj = {
    // Unique task ID
    id: count,

    // Text entered by the user
    task: displayInp,

    // Every new task starts as incomplete
    completed: false,
  };

  // Add the new task object to the allTasks array
  allTasks.push(taskObj);

  // Clear the input field after adding the task
  taskInp.value = "";

  // Reset the input placeholder
  taskInp.placeholder = "Enter Valid Input !";

  // Display the new task and update progress
  refreshUI();
}

/* =========================================
   7. ADD TASK USING THE BUTTON
   ========================================= */

// Run addTask() when the Add button is clicked
addBtn.addEventListener("click", function () {
  addTask();
});

/* =========================================
   8. ADD TASK USING THE ENTER KEY
   ========================================= */

// Listen for keyboard input inside the task field
taskInp.addEventListener("keydown", function (event) {
  // Check whether the pressed key is Enter
  if (event.key === "Enter") {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Add the task
    addTask();
  }
});

/* =========================================
   9. FILTER TASKS
   ========================================= */

function filterTasks(taskArray, filterType) {
  // When the filter is "all",
  // return every task without filtering
  if (filterType === "all") {
    return taskArray;
  }

  // When the filter is "active",
  // return only incomplete tasks
  else if (filterType === "active") {
    return taskArray.filter((val) => val.completed === false);
  }

  // When the filter is "completed",
  // return only completed tasks
  else if (filterType === "completed") {
    return taskArray.filter((val) => val.completed === true);
  }

  // If the filter value is invalid,
  // return an empty array
  else {
    return [];
  }
}

/* =========================================
   10. FILTER BUTTON EVENTS
   ========================================= */

// Add a click event to every filter button
filterBtns.forEach(function (btn) {
  btn.addEventListener("click", function (event) {
    // Remove the active class from all filter buttons
    // This resets the previous selected button
    filterBtns.forEach(function (btn) {
      btn.classList.remove("active");
    });

    // Get the selected filter from the data-filter attribute
    // Example: data-filter="active"
    currentFilter = event.target.dataset.filter;

    // Re-render the task list using the selected filter
    refreshUI();

    // Highlight the currently selected filter button
    btn.classList.add("active");
  });
});
