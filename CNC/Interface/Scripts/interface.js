getStatus();
getTasks();
var myStatus = setInterval(getStatus, 10000);
var myTasks = setInterval(getTasks, 60000);



/*----- Status -----*/

//Gets data for #statusTable
function getStatus() {
  var xhr = new XMLHttpRequest();
  
  xhr.open('GET', 'http://botnet.artificial.engineering:8080/api/Status');
  xhr.responseType = 'json';

  xhr.onload = function() {

      var data = xhr.response;
      if (data !== null) {
          updateStatusTable(data); // Parsed JSON object
      }

  };

  xhr.send(null);
}

//Update #statusTable with aquired data
function updateStatusTable(data) {
  var output = "";

  for(var i = 0; i < data.length; i++) {
      output += "<tr><td>" +
      data[i].id + "</td><td>" +
      data[i].ip + "</td><td>" +
      data[i].task + "</td><td>" +
      data[i].workload + "</td><td>";
      var buttonId = data[i].id + " button";
      if(data[i].workload === 0){ 
        output += '<button onclick="sendStatusButtonToggle(this.id, true)" type="button" class="tableButtonGreen" id="' + buttonId + '">start</button>' + "</td>" +
        "</td></tr>";
      }else{
        output += '<button onclick="sendStatusButtonToggle(this.id, false)" type="button" class="tableButtonRed" id="' + buttonId + '">stop</button>' + "</td>" +
        "</td></tr>";
      }

      document.getElementById("statusBody").innerHTML = output;    
  }
  
  //Adjust height of #Status section 
  var tableHeight = document.getElementById("statusTable").scrollHeight;
  document.getElementById("Status").style.height = (tableHeight + 100) + "px";
}

//StatusButton /api/Status POST integration (send START/STOP)
function sendStatusButtonToggle(buttonId, buttonStatus){
  var xhr = new XMLHttpRequest();

  xhr.open('POST', 'http://botnet.artificial.engineering:8080/api/Status/');
  xhr.responseType = 'json';
  xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
  xhr.setRequestHeader('Token', 'WAW-RohBots');
  
  var data = {
    "id": parseInt(buttonId.substr(0,buttonId.indexOf(' '))),
    "status": buttonStatus
    };
   
  xhr.send(JSON.stringify(data));
  setTimeout(getStatus, 1000);
}



/*----- Tasks -----*/

//POST task formular
function submitTaskForm(form) {    
  var xhr = new XMLHttpRequest();

  xhr.open('POST', 'http://botnet.artificial.engineering:8080/api/Tasks/');
  xhr.responseType = 'json';
  xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
  xhr.setRequestHeader('Token', 'WAW-RohBots');
  
  var data = {
    type: form.type.value,
    data: {
      input: form.data.value,
    }
  };
  
  xhr.send(JSON.stringify(data));
  setTimeout(getTasks, 1000);
}

//Gets data for #taskTable
function getTasks() {
  var xhr = new XMLHttpRequest();
  
  xhr.open('GET', 'http://botnet.artificial.engineering:8080/api/Tasks');
  xhr.responseType = 'json';

  xhr.onload = function() {

      var data = xhr.response;
      if (data !== null) {
          updateTaskTable(data); // Parsed JSON object
      }

  };

  xhr.send(null);
}

//Update #taskTable with aquired data
function updateTaskTable(data){
  var output = "";

  for(var i = 0; i < data.length; i++) {
    output += "<tr><td>" +
    data[i].id +
    "</td><td>" +
    data[i].type +
    "</td><td>" +
    data[i].data.input +
    "</td><td>" + 
    data[i].data.output +
    "</td></tr>";

    document.getElementById("tasksBody").innerHTML = output; 
  }

  //Adjust height of #Task section 
  var tableHeight = document.getElementById("tasksTable").scrollHeight;
  document.getElementById("Tasks").style.height = (tableHeight + 100) +"px";
}