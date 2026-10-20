const amount = document.querySelector('#amount');
const percentage = document.querySelector('#percentage');
const percentageLabel = document.querySelector('#percentage-label');
const result = document.querySelector('#result');
const formula = document.querySelector('#formula');
const storageMessage = document.querySelector('#storage-message');
const format = new Intl.NumberFormat('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const percentFormat = new Intl.NumberFormat('ro-RO', { maximumFractionDigits: 1 });
const amountKey = 'trading-desk-calculator-amount';
const percentageKey = 'trading-desk-calculator-percentage';
const amountFormat = new Intl.NumberFormat('ro-RO', { maximumFractionDigits: 2 });

function formatAmountInput() {
  const raw = amount.value.replaceAll('.', '');
  if (!/^\d+(?:,\d{0,2})?$/.test(raw)) return;
  const cursor = amount.selectionStart;
  const beforeCursor = cursor === null ? null : amount.value.slice(0, cursor).replaceAll('.', '').length;
  const [integer, decimals] = raw.split(',');
  amount.value = integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + (decimals === undefined ? '' : `,${decimals}`);
  if (beforeCursor !== null) {
    let position = 0;
    let characters = 0;
    while (position < amount.value.length && characters < beforeCursor) {
      if (amount.value[position] !== '.') characters++;
      position++;
    }
    amount.setSelectionRange(position, position);
  }
}

try {
  const savedAmount = localStorage.getItem(amountKey);
  const savedPercentage = localStorage.getItem(percentageKey);
  if (savedAmount !== null && savedAmount !== '' && Number.isFinite(Number(savedAmount))) {
    amount.value = amountFormat.format(Number(savedAmount));
  }
  if (savedPercentage !== null && Number.isFinite(Number(savedPercentage)) && Number(savedPercentage) >= 0 && Number(savedPercentage) <= 100) {
    percentage.value = savedPercentage;
  }
} catch {
  storageMessage.textContent = 'Stocarea în browser nu este disponibilă. Modificările nu vor fi păstrate.';
}

function update(save = false) {
  const raw = amount.value.replaceAll('.', '');
  const value = Number(raw.replace(',', '.'));
  const percent = Number(percentage.value);
  percentageLabel.textContent = `${percentFormat.format(percent)}%`;
  const valid = /^\d+(?:,\d{0,2})?$/.test(raw) && Number.isFinite(value) && value <= 1e12;
  amount.setCustomValidity(valid || amount.value === '' ? '' : 'Introdu o sumă validă, de exemplu 10.000,50.');
  result.textContent = valid ? format.format(value * percent / 100) : '—';
  formula.textContent = valid
    ? `${format.format(value)} × ${percentFormat.format(percent)}%`
    : 'Introdu o sumă validă, între 0 și 1.000.000.000.000, cu maximum două zecimale.';
  if (save) {
    try {
      // Preserve the last valid amount while the user is editing an invalid value.
      if (valid || amount.value === '') localStorage.setItem(amountKey, valid ? String(value) : '');
      localStorage.setItem(percentageKey, percentage.value);
      storageMessage.textContent = valid || amount.value === ''
        ? 'Salvat automat în acest browser.'
        : 'Suma nu este validă. Ultima sumă validă rămâne salvată.';
    } catch {
      storageMessage.textContent = 'Nu s-a putut salva. Calculele funcționează, dar modificările nu vor fi păstrate.';
    }
  }
}

amount.addEventListener('input', () => { formatAmountInput(); update(true); });
percentage.addEventListener('input', () => update(true));
document.querySelector('#calculator-form').addEventListener('submit', event => event.preventDefault());
update();
