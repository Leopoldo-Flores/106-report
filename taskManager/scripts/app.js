var important = false;
var serverUrl = "http://fsdiapi.azurewebsites.net/";
var myTasks = [];
var defaultTaskStatus = 1;

function toggleImportant() {
  if (!important) {
    important = true;
    $("#iImportant").removeClass("far").addClass("fas");
  } else {
    important = false;
    $("#iImportant").removeClass("fas").addClass("far");
  }
}

function saveTask() {
  let title = $("#txtTitle").val();
  let description = $("#txtDescription").val();
  let category = $("#selCategory").val();
  let location = $("#txtLocation").val();
  let dueDate = $("#seldueDate").val();
  let color = $("#selColor").val();

  let task = new Task(
    title,
    important,
    category,
    description,
    location,
    dueDate,
    color,
    1
  );
  console.log(task);
  console.log(JSON.stringify(task));

  //send object to a backend server
  $.ajax({
    url: serverUrl + "api/tasks/",
    type: "POST",
    data: JSON.stringify(task),
    contentType: "application/json",
    success: function (res) {
      let task = JSON.parse(res);
      myTasks.push(task);
      displayTask(task);
    },
    error: function (eDetails) {
      console.error("ERROR Saving", eDetails);
    },
  });
}

function displayTask(task) {
  let syntax = `<div id="${task._id}" class="task">
          <i class='important fas fa-star'></i> 
          <div class="description">
              <h5>${task.title}</h5>
              <p>${task.description}</p>
          </div>
          <label class="due-Date">${task.dueDate}</label>
          <label class="location">${task.location}</label>`;
  if (task.status == 1) {
    syntax += `<button onclick="doneTask('${task._id}');" class="btn btn-sm">✅</button></div>`;
    $("#pendingList").append(syntax);
  } else if (task.status == 2) {
    syntax += `<button onclick="removeTask('${task._id}');" class="btn btn-sm btn-danger">🗑️</button> </div>`;
    $("#doneList").append(syntax);
  }
}

function removeTask(id) {
  // Get the object
  for (let i = 0; i < myTasks.length; i++) {
    let task = myTasks[i];
    if (task._id == id) {
      console.log(task.title);
      task.status = 3;

      $.ajax({
        url: serverUrl + "api/tasks",
        type: "PUT",
        data: JSON.stringify(task),
        contentType: "application/json",
        success: function (res) {
          console.log("Response: " + res);

          // remove the task from the pending list
          $(`#${id}`).remove();
        },
        error: function (eDetails) {
          console.log("Error: " + eDetails);
        },
      });
    }
  }
}

function doneTask(id) {
  console.log("Click on card id: " + id);
  // Get the object
  for (let i = 0; i < myTasks.length; i++) {
    let task = myTasks[i];
    if (task._id == id) {
      console.log(task.title);
      task.status = 2;

      $.ajax({
        url: serverUrl + "api/tasks",
        type: "PUT",
        data: JSON.stringify(task),
        contentType: "application/json",
        success: function (res) {
          console.log("Response: " + res);

          // remove the task from the pending list
          $(`#${id}`).remove();

          // display the task on the done list
          displayTask(task);
        },
        error: function (eDetails) {
          console.log("Error: " + eDetails);
        },
      });
    }
  }
  // update the status
  // send if on a PUT request

  //AJAX PUT
  //url: serverUrl + "api/task"
}

function fetchTasks() {
  /**
   * Get request
   * url: sercerUrl + "api/tasks/",
   * parse string -> array wih objects
   * travel the array send each objet to display
   */

  $.ajax({
    type: "GET",
    url: serverUrl + "api/tasks",
    success: function (res) {
      let data = JSON.parse(res);
      for (let i = 0; i < data.length; i++) {
        let task = data[i];
        //filter array to only get my tasks
        if (task.name == "Leo") {
          myTasks.push(task);
          displayTask(task);
        }
      }
    },
    error: function (err) {
      console.error("Error getting data", err);
    },
  });
}

function init() {
  console.log("My Task Manager");

  //load data
  fetchTasks();
  //hook events
  $("#iImportant").click(toggleImportant);
  $("#btnSave").click(saveTask);
}

window.onload = init;
