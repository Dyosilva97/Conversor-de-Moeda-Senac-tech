$.ajax({
  type: "GET",
  dataType: "JSON",
  url: "https://api.frankfurter.app/currencies",
  success: function (data) {
    const origem = document.querySelector("#moeda-origem");
    const destino = document.querySelector("#moeda-destino");

    for (const codigo in data) {
      const nome = data[codigo];
      const opt1 = document.createElement("option");
      const opt2 = document.createElement("option");
      opt1.value = opt2.value = codigo;
      opt1.textContent = `${codigo} - ${nome}`;
      opt2.textContent = `${codigo} - ${nome}`;
      origem.appendChild(opt1);
      destino.appendChild(opt2);
    }

    
    origem.value = "USD";
    destino.value = "BRL";
  },
  error: function () {
    alert("Erro ao carregar lista de moedas.");
  }
});


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

function converter() {
  const moedaOrigem = document.querySelector("#moeda-origem").value;
  const moedaDestino = document.querySelector("#moeda-destino").value;
  const entrada = document.querySelector("#entrada").value;

  const valor = parseFloat(entrada.replace(/\./g, '').replace(',', '.'));
  if (isNaN(valor) || valor <= 0) {
    alert("Digite um valor válido!");
    return;
  }

  if (moedaOrigem === moedaDestino) {
    alert("Escolha moedas diferentes para conversão!");
    return;
  }

  const url = `https://api.frankfurter.app/latest?amount=${valor}&from=${moedaOrigem}&to=${moedaDestino}`;

  $.getJSON(url, function(data) {
    const valorConvertido = data.rates[moedaDestino];
    const dataAtualizacao = data.date;

    const saida = document.querySelector("#saida");
    const valorOrigemFmt = valor.toLocaleString('pt-BR', { style: 'currency', currency: moedaOrigem });
    const valorDestinoFmt = valorConvertido.toLocaleString('pt-BR', { style: 'currency', currency: moedaDestino });

    saida.innerHTML = `Resultado: ${valorOrigemFmt} = <strong>${valorDestinoFmt}</strong>`;
    getHorarioAtualizacao(dataAtualizacao);
  }).fail(() => {
    alert("Erro ao obter a cotação. Tente novamente.");
  });
}


function getHorarioAtualizacao(data) {
  const atualizacao = document.querySelector("#atualizacao");
  const [ano, mes, dia] = data.split('-');
  atualizacao.innerHTML = `Cotação atualizada em ${dia}/${mes}/${ano}`;
}


function maskinput(i) {
  let onlyNumbers = i.value.replace(/\D/g, '');
  if (onlyNumbers === '') {
    i.value = '';
    return;
  }
  let number = parseFloat(onlyNumbers) / 100;
  i.value = number.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}


document.addEventListener('paste', (e) => {
  if (e.target.id !== 'entrada') return;
  e.preventDefault();
  let texto = (e.clipboardData || window.clipboardData).getData('text');
  texto = texto.replace(/[^\d]/g, '');
  let numero = parseFloat(texto) / 100;
  if (isNaN(numero)) return;
  e.target.value = numero.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
});