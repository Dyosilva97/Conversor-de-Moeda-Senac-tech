var resultado;

// 🔹 Busca as cotações da API
$.ajax({
  type: "GET",
  dataType: "JSON",
  url: "https://economia.awesomeapi.com.br/json/all",
  success: function (data) {
    resultado = data;
  },
  error: function () {
    alert('Erro! Não foi possível carregar as cotações. Tente novamente mais tarde.');
  }
});

// 🔁 Botão para inverter as moedas selecionadas
document.addEventListener("DOMContentLoaded", function() {
  const btnInverter = document.querySelector("#inverter");
  btnInverter.addEventListener("click", function() {
    const origem = document.querySelector("#moeda-origem");
    const destino = document.querySelector("#moeda-destino");

    const temp = origem.value;
    origem.value = destino.value;
    destino.value = temp;
  });
});

// 🧮 Função principal de conversão
function converter() {
  if (!resultado) {
    alert("As cotações ainda estão carregando, aguarde um momento...");
    return;
  }

  const moedaOrigem = document.querySelector("#moeda-origem").value;
  const moedaDestino = document.querySelector("#moeda-destino").value;
  const entrada = document.querySelector("#entrada");
  const valor = parseFloat(entrada.value);

  if (isNaN(valor) || valor <= 0) {
    alert("Digite um valor válido!");
    return;
  }

  // Se a moeda for BRL, o valor base é 1
  const cotacaoOrigem = moedaOrigem === "BRL" ? 1 : parseFloat(resultado[moedaOrigem]["bid"]);
  const cotacaoDestino = moedaDestino === "BRL" ? 1 : parseFloat(resultado[moedaDestino]["bid"]);

  const valorConvertido = (valor * cotacaoOrigem) / cotacaoDestino;

  const saida = document.querySelector("#saida");
  const valorOrigemFmt = valor.toLocaleString('pt-BR', { style: 'currency', currency: moedaOrigem });
  const valorDestinoFmt = valorConvertido.toLocaleString('pt-BR', { style: 'currency', currency: moedaDestino });

  saida.innerHTML = `Resultado: ${valorOrigemFmt} = ${valorDestinoFmt}`;

  getHorarioAtualizacao(moedaDestino);
}

// 📅 Exibe a data da última atualização
function getHorarioAtualizacao(codigoMoeda) {
  const atualizacao = document.querySelector("#atualizacao");

  if (!resultado[codigoMoeda] || !resultado[codigoMoeda]["create_date"]) {
    atualizacao.innerHTML = "";
    return;
  }

  const data = resultado[codigoMoeda]["create_date"];
  const dia = data.substring(8, 10);
  const mes = data.substring(5, 7);
  const ano = data.substring(0, 4);
  const hora = data.substring(11, 16);
  const dataFormatada = `${dia}/${mes}/${ano} às ${hora}`;

  atualizacao.innerHTML = `Cotação atualizada em ${dataFormatada}`;
}