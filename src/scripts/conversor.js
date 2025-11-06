const CURRENCY_API = 'https://api.frankfurter.app';

async function fetchCurrencies() {
  const response = await fetch(`${CURRENCY_API}/currencies`);
  if (!response.ok) {
    throw new Error('Não foi possível carregar a lista de moedas.');
  }
  return response.json();
}

async function fetchConversion(amount, from, to) {
  const response = await fetch(
    `${CURRENCY_API}/latest?amount=${encodeURIComponent(amount)}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
  );
  if (!response.ok) {
    throw new Error('Não foi possível obter a cotação.');
  }
  return response.json();
}

function formatNumber(input) {
  const onlyDigits = input.replace(/\D/g, '');
  if (!onlyDigits) {
    return { formatted: '', numeric: NaN };
  }

  const numeric = parseFloat(onlyDigits) / 100;
  return {
    formatted: numeric.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    numeric,
  };
}

function formatCurrency(value, currency) {
  try {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency,
    });
  } catch (error) {
    return value.toFixed(2);
  }
}

function setupInputMask(input) {
  if (!input) return;

  input.addEventListener('input', () => {
    const { formatted } = formatNumber(input.value);
    input.value = formatted;
  });

  input.addEventListener('paste', (event) => {
    event.preventDefault();
    const pasted = (event.clipboardData || window.clipboardData).getData('text');
    const { formatted } = formatNumber(pasted);
    input.value = formatted;
  });
}

async function populateCurrencies(originSelect, targetSelect) {
  try {
    const currencies = await fetchCurrencies();
    const codes = Object.keys(currencies).sort();

    const fragmentOrigin = document.createDocumentFragment();
    const fragmentTarget = document.createDocumentFragment();

    codes.forEach((code) => {
      const name = currencies[code];

      const optionOrigin = document.createElement('option');
      optionOrigin.value = code;
      optionOrigin.textContent = `${code} - ${name}`;
      fragmentOrigin.appendChild(optionOrigin);

      const optionTarget = document.createElement('option');
      optionTarget.value = code;
      optionTarget.textContent = `${code} - ${name}`;
      fragmentTarget.appendChild(optionTarget);
    });

    originSelect.innerHTML = '';
    targetSelect.innerHTML = '';
    originSelect.appendChild(fragmentOrigin);
    targetSelect.appendChild(fragmentTarget);

    originSelect.value = 'USD';
    targetSelect.value = 'BRL';
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

function setupSwapButton(button, originSelect, targetSelect) {
  if (!button || !originSelect || !targetSelect) return;
  button.addEventListener('click', () => {
    const originValue = originSelect.value;
    originSelect.value = targetSelect.value;
    targetSelect.value = originValue;
  });
}

function setupConverter(button, originSelect, targetSelect) {
  if (!button || !originSelect || !targetSelect) return;

  const output = document.querySelector('#saida');
  const updatedAt = document.querySelector('#atualizacao');
  const input = document.querySelector('#entrada');

  button.addEventListener('click', async () => {
    const { numeric: amount } = formatNumber(input?.value ?? '');

    if (!amount || Number.isNaN(amount) || amount <= 0) {
      alert('Digite um valor válido!');
      return;
    }

    if (originSelect.value === targetSelect.value) {
      alert('Escolha moedas diferentes para conversão!');
      return;
    }

    try {
      const data = await fetchConversion(amount, originSelect.value, targetSelect.value);
      const value = data.rates[targetSelect.value];

      if (!output || value === undefined) {
        alert('Erro ao processar a resposta da API.');
        return;
      }

      const originFormatted = formatCurrency(amount, originSelect.value);
      const targetFormatted = formatCurrency(value, targetSelect.value);
      output.innerHTML = `Resultado: ${originFormatted} = <strong>${targetFormatted}</strong>`;

      if (updatedAt) {
        const [year, month, day] = (data.date ?? '').split('-');
        if (year && month && day) {
          updatedAt.textContent = `Cotação atualizada em ${day}/${month}/${year}`;
        } else {
          updatedAt.textContent = '';
        }
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  });
}

export function initConversorPage() {
  const originSelect = document.querySelector('#moeda-origem');
  const targetSelect = document.querySelector('#moeda-destino');

  if (!originSelect || !targetSelect) {
    return;
  }

  const swapButton = document.querySelector('#inverter');
  const convertButton = document.querySelector('#converter');
  const input = document.querySelector('#entrada');

  setupInputMask(input);
  populateCurrencies(originSelect, targetSelect);
  setupSwapButton(swapButton, originSelect, targetSelect);
  setupConverter(convertButton, originSelect, targetSelect);
}
