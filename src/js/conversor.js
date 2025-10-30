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
  const entrada = document.querySelector("#entrada").value;

  // 🔹 Converte o valor formatado para número
  const valor = parseFloat(entrada.replace(/\./g, '').replace(',', '.'));

  if (isNaN(valor) || valor <= 0) {
    alert("Digite um valor válido!");
    return;
  }

  const cotacaoOrigem = moedaOrigem === "BRL" ? 1 : parseFloat(resultado[moedaOrigem]["bid"]);
  const cotacaoDestino = moedaDestino === "BRL" ? 1 : parseFloat(resultado[moedaDestino]["bid"]);

  const valorConvertido = (valor * cotacaoOrigem) / cotacaoDestino;

  const saida = document.querySelector("#saida");
  const valorOrigemFmt = valor.toLocaleString('pt-BR', { style: 'currency', currency: moedaOrigem });
  const valorDestinoFmt = valorConvertido.toLocaleString('pt-BR', { style: 'currency', currency: moedaDestino });

  saida.innerHTML = `Resultado: ${valorOrigemFmt} = <strong>${valorDestinoFmt}</strong>`;

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

// 🪄 Máscara de moeda fluida e segura (sem travar)
function maskinput(i) {
  let onlyNumbers = i.value.replace(/\D/g, ''); // remove tudo que não for número

  // impede travamento — se vazio, não faz nada
  if (onlyNumbers === '') {
    i.value = '';
    return;
  }

  // transforma em número com 2 casas decimais
  let number = parseFloat(onlyNumbers) / 100;

  // formata no padrão brasileiro
  i.value = number.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// 🔹 Permite colar valores como "R$ 1.000,50" ou "1000,50"
document.getElementById('entrada').addEventListener('paste', (e) => {
  e.preventDefault();
  let texto = (e.clipboardData || window.clipboardData).getData('text');

  // Remove tudo que não for número
  texto = texto.replace(/[^\d]/g, '');

  // Divide por 100 e formata
  let numero = parseFloat(texto) / 100;
  if (isNaN(numero)) return;

  e.target.value = numero.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
});