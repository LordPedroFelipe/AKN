var express = require('express');
var app = express();

app.use(function(req, res, next){

	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	res.setHeader("Access-Control-Allow-Headers", "content-type");
	res.setHeader("Access-Control-Allow-Credentials", true);

	next();
});

var port = 8080;

app.listen(port);

console.log('Servidor HTTP esta escutando na porta ' + port);

app.get('/', function(req, res){
	res.send({msg:'Olá'});
});


//GET Motivos
app.get('/api', function(req, res){
	
	results =  [ "Elogio", "Sugestão", "Solicitação" , "Reclamação", "Re-emissão de boleto" ];
	
	res.json(results);

});
