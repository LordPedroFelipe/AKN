// Pedro Felipe - Controller index
module.exports.index = function(application, req, res){
	res.render("index", {validacao : {}, contato : {}, exibeModal : 0});

}


module.exports.enviar = function(application, req, res){
	var contato = req.body;

	req.assert('nome','Nome é obrigatório').notEmpty();
	req.assert('nome','Nome deve conter entre 10 e 100 caracteres').len(8, 100);
	req.assert('email','E-mail inválido').isEmail();
	req.assert('cpf','CPF é obrigatório').notEmpty();
	req.assert('motivo','Motivo é obrigatório').notEmpty();
	req.assert('mensagem','Mensagem é obrigatória').notEmpty();
	req.assert('mensagem','Mensagem deve conter entre 10 e 100 caracteres').len(8, 100);

	console.log(contato.dataBoleto)
	if (contato.motivo == 4) {
		req.assert('dataBoleto','Data do boleto é obrigatório').isDate({format: 'DD/MM/YYYY'});
	}

	var erros = req.validationErrors();

	if(erros){
		res.render("index", {validacao : erros, contato : contato, exibeModal : 0});
		return;
	}

	contato.titulo = "Você entrou em contato pelo motivo: " + contato.motivo;

	if (contato.motivo == "Re-emissão de boleto") {
		var data = new Date().getTime()

		var objDate = new Date();
		objDate.setYear(contato.dataBoleto.split("/")[2]);
		objDate.setMonth(contato.dataBoleto.split("/")[1]  - 1);
		objDate.setDate(contato.dataBoleto.split("/")[0]);
		
		//console.log(objDate.getTime() + " O " + data);

		if(objDate.getTime() >= data){
			//console.log("O dia passado é maior que a data atual..");

			var tempoDif = Math.abs(objDate.getTime() - data);
			var difDias = Math.ceil(tempoDif / (1000 * 3600 * 24)); 

			//console.log(" difDias " + difDias);

			var valorBoleto = 1000;
			var juro = 0;

			if (difDias > 3 ){

				if (difDias > 15 ){
					difDias = 15;
				}

				// Pedro Felipe - No caso compreendi que mesmo sendo 3 dias apos o vencimento, o juro comeca de 10 e acrecenta 2.5 a cada dia
				juro = 10;

				for (i = 0; i < difDias; i++){
					juro = juro + 2.5;
				}

			} else {
				juro = 10;
			}
			//console.log(" juro " + juro);
			 
			valorBoleto = valorBoleto + juro;
			valorBoleto = valorBoleto.toFixed(2).toString().replace("." , ",");
			
			//console.log("valorBoleto " + valorBoleto);

			contato.textoFinal = "Valor atualizado do boleto R$" + valorBoleto + " Para data: " + contato.dataBoleto;

		}
		
	} else {
		contato.textoFinal = "Contato realizado com sucesso! ";

	}

	res.render("index", {validacao : {}, contato : contato, exibeModal : 1});
}