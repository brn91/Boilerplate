getStatus();
var myVar = setInterval(getStatus, 60000);

//Gets data for #Statustable
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

//Update #Statustable with aquired data
function updateStatusTable(data) {
  var output = "";

  for(var i = 0; i < data.length; i++) {
      output += "<tr><td>" +
      data[i].workload +
      "</td><td>" +
      data[i].ip +
      "</td><td>" +
      data[i].task + " (" + data[i].id + ")" +
      "</td><td>" + 
      '<button onclick="toggleStatusButton(this.id)" type="button" class="Statusbutton" id="'+ data[i].id + 'stop" >Stop</button>' + "</td>" +
      "</td></tr>";

      document.getElementById("statusBody").innerHTML = output; 
  }
  
  //Adjust height of #Status section 
  var tableHeight = document.getElementById("Statustable").scrollHeight;
  document.getElementById("Status").style.height = tableHeight + "px";
}

//StatusButton toggle
function toggleStatusButton(id){
    if(document.getElementById(id).innerHTML == "Start"){
      document.getElementById(id).style.backgroundColor =  "#4CAF50";
      sendStatusButtonToggle(id);
      document.getElementById(id).innerHTML = "Stop";
    }else if(document.getElementById(id).innerHTML == "Stop"){
      document.getElementById(id).style.backgroundColor =  "#f44336";
      sendStatusButtonToggle(id);
      document.getElementById(id).innerHTML = "Start";
    }
}

//StatusButton /api/Status POST Integration
function sendStatusButtonToggle(buttonId){
  var xhr = new XMLHttpRequest();

  xhr.open('POST', 'http://botnet.artificial.engineering:8080/api/Status/');
  xhr.responseType = 'plain';
  xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
  
  var data = {
    id: buttonId.charAt(0),
    action: document.getElementById(buttonId).innerHTML
    };
  
  xhr.send(JSON.stringify(data));
}

//POST task formular
function submitTaskForm(form) {    
  var xhr = new XMLHttpRequest();

  xhr.open('POST', 'http://botnet.artificial.engineering:8080/api/Tasks/');
  xhr.responseType = 'json';
  xhr.setRequestHeader('Content-type', 'text/plain; charset=UTF-8');
  
  var data = {
    id: form.id.value,
    type: form.type.value,
    data: {
      input: form.data.value,
      output: null
    }
  };
  
  xhr.send(JSON.stringify(data));
}

