var fs = require('fs');
var token = '8dfec9d920eb15363c5ec1ca071c5a93';
var botList;


//Fill botList with data form botList.json
fs.readFile('botList.json', (err, data)=>{
  if(err){
    throw err;
  }             
  botList = JSON.parse(data);
});


//Assign expression to the exports object, so it is available in other files
module.exports = function(router){
  
  //Return list of bots    
	router.get('/Status', (req, res)=>{
    res.json(botList);
	});
  
  //Toggle status of bot
  router.post('/Status', (req, res)=>{   
    var containsBot = false;
    var i = 0;
    
    if(req.headers.token == token){
      
      //Search for bot in botList
      while(i < botList.length && !containsBot){

        if(botList[i].id == req.body.id){ 
          
          if(req.body.status == true){          
            botList[i].workload = 1.0;
          }else{
            botList[i].workload = 0.0;
          }
          
          containsBot = true;
          
          //Save botList changes to file
          fs.writeFile('botList.json', JSON.stringify(botList), (err)=>{
            if(err){
              throw err;
            }
          });        
        }
        i++;
      }  
    }else{   
      res.status(403);     
    }
    
    if(containsBot == true){
      res.json({message: 'OK'});
    }else{
      res.json({message: 'NOT OK'});
    }
	});
  
  //Return bot object specified by bot-id
  router.get('/Status/:id', (req, res)=>{   
    var containsBot = false;
    var i = 0;
    
    //Search for bot in botList
    while(i < botList.length && !containsBot){
      if(botList[i].id == req.params.id){
        res.json(botList[i]);
        containsBot = true;
      }
      i++;
    }
    
    if(!containsBot){
      res.json({message: 'NOT OK'});
    }
	});
  
  //Change parameters of a specific bot (if exists) by bot-id
  router.post('/Status/:id', (req, res)=>{            
    var containsBot = false;
    var i = 0;
    
    if(req.headers.token == token){
      
      //Search for bot in botList
      while(i < botList.length && !containsBot){       
        if(botList[i].id == req.params.id){
        
          if(req.body.ip != undefined){
            botList[i].ip = req.body.ip;
          }
          if(req.body.task != undefined){
            botList[i].task = req.body.task;
          }
          if(req.body.workload != undefined){
            botList[i].workload = req.body.workload;
          }
          
          containsBot = true;
          
          //Save botList changes to file
          fs.writeFile('botList.json', JSON.stringify(botList), (err)=>{
            if(err){
              throw err;
            }
          }); 
        }
        i++;
      }    
    }else{   
      res.status(403);               
    }
    
    if(containsBot == true){
      res.json({message: 'OK'});
    }else{
      res.json({message: 'NOT OK'});
    }
	}); 
}