var fs = require('fs');
var token = '8dfec9d920eb15363c5ec1ca071c5a93';
var taskTypes = ['hash-md5', 'hash-sha256', 'crack-md5'];
var taskList;


//Fill tasklist with data form taskList.json
fs.readFile('taskList.json', (err, data)=>{
  if(err){
    throw err;
  }             
  taskList = JSON.parse(data);
});


//Assign expression to the exports object, so it is available in other files
module.exports = function(router){
  
  //Return list of tasks in /Tasks
  router.get('/Tasks', (req, res)=>{
    res.json(taskList);
	});
  
  //Add a new task to taskList
  router.post('/Tasks', (req, res)=>{
    var validType = false;
    var i = 0;
  
    if(req.headers.token == token){
      
      //Test if type of new task is valid 
      while(i < taskTypes.length && !validType){
        if(taskTypes[i] == req.body.type){
          validType = true;
        }
        i++;
      }
            
      if(req.body.data.input != "" && validType){
        //Create new task-object with data from req.body
        var newTask = new Object();
        newTask = { 
                    id: taskList.length, 
                    type: req.body.type, 
                    data:
                    {
                      input: req.body.data.input, 
                      output: null
                    }
                  };
        
        //Add new task to taskList and save to file
        taskList.push(newTask);        
        fs.writeFile('taskList.json', JSON.stringify(taskList), (err)=>{
          if(err){
            throw err;
          }
        }); 
        
        res.json({message: 'OK'});
      }else{
        res.json({message: 'NOT OK'});
      }
    }else{
      res.status(403);
      res.json({message: 'NOT OK'});    
    }
	});
  
  //Return task object specified by task-id
  router.get('/Tasks/:id', (req, res)=>{    
    var containsTask = false;
    var i = 0;
    
    while(i < taskList.length && !containsTask){

      if (taskList[i].id == req.params.id){
        res.json(taskList[i]);
        containsTask = true;
      }
      i++;
    }
    
    if(!containsTask){
      res.json({message: 'NOT OK'});
    }
	});
  
  //Change parameters of a specific task (if exists) by task-id
  router.post('/Tasks/:id', (req, res)=>{
    var validType = false;
    var containsTask = false;
    var i = 0;
    
    if(req.headers.token == token){   
      //Test if type of new task is valid 
      while(i < taskTypes.length && !validType){
        if(taskTypes[i] == req.body.type){
          validType = true;
        }
        i++;
      }
      
      //Search for task in taskList
      i = 0;
      while(i < taskList.length && validType && !containsTask){
        if(taskList[i].id == req.params.id){
          containsTask = true;
          taskList[i].type = req.body.type;
          
          if(req.body.data != undefined){
            if(req.body.data.input != undefined){
              taskList[i].data.input = req.body.data.input;
            }
            if(req.body.data.output != undefined){
              taskList[i].data.output = req.body.data.output;
            }
          }
      
          //Update taskList.json        
          fs.writeFile('taskList.json', JSON.stringify(taskList), (err)=>{
            if(err){
              throw err;
            }
          });           
        }
        i++;
      }
      
      if(validType && containsTask){
        res.json({message: 'OK'});
      }else{
        res.json({message: 'NOT OK'});
      }  
    }else{   
      res.status(403);       
    }
  });
}