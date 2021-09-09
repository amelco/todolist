let http = require('http');
let fs = require('fs');
let url = require('url');
let path = require('path');

const port = 3000;

http.createServer( function (request, response) {  
   var pathname = url.parse(request.url).pathname;
   
   let recurso = pathname.substr(1);
   let method = request.method

   console.log("Requisição '" + method + "' para '" + pathname + "' recebida.");
   
   if (method === 'GET')
   {
        fs.readFile(recurso, function (err, data) {
           if (err) {
              console.log(err);      
              response.writeHead(404, {'Content-Type': 'text/html'});
           } else {	
              response.writeHead(200, {
                  'Content-Type': 'text/html',
                  'Access-Control-Allow-Origin':'*'
              });	
              response.write(data.toString());		
           }
           response.end();
        });   
   }
   else if (method === 'POST') {
       let caminho = path.resolve(__dirname, recurso);
       console.log(caminho);
       let taskList = JSON.parse(fs.readFileSync('tarefas.json'));
       request.on('data', function(chunk){
           taskList.push(JSON.parse(chunk));
           taskList = JSON.stringify(taskList);
           fs.writeFile(caminho, taskList, function (err, data) {
               if (err) {
                  console.log(err);      
                  response.writeHead(404, {'Content-Type': 'text/html'});
               }
               console.log(data);
           });
       });
   }
   else {
       console.log('Método HTTP não implementado')
       response.writeHead(500, {'Content-Type': 'text/html'});
   }
}).listen(port);
console.log('Servidor rodando em localhost:'+port+'/ ...');