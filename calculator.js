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

try {
  const savedAmount = localStorage.getItem(amountKey);
  const savedPercentage = localStorage.getItem(percentageKey);
  if (savedAmount !== null) amount.value = savedAmount;
  if (savedPercentage !== null && Number.isFinite(Number(savedPercentage)) && Number(savedPercentage) >= 0 && Number(savedPercentage) <= 100) {
    percentage.value = savedPercentage;
  }
} catch {
  storageMessage.textContent = 'Stocarea în browser nu este disponibilă. Modificările nu vor fi păstrate.';
}

function update(save = false) {
  const value = Number(amount.value);
  const percent = Number(percentage.value);
  percentageLabel.textContent = `${percentFormat.format(percent)}%`;
  const valid = amount.value.trim() !== '' && Number.isFinite(value) && amount.validity.valid;
  result.textContent = valid ? format.format(value * percent / 100) : '—';
  formula.textContent = valid
    ? `${format.format(value)} × ${percentFormat.format(percent)}%`
    : 'Introdu o sumă validă, între 0 și 1.000.000.000.000, cu maximum două zecimale.';
  if (save) {
    try {
      // Preserve the last valid amount while the user is editing an invalid value.
      if (valid || amount.value === '') localStorage.setItem(amountKey, amount.value);
      localStorage.setItem(percentageKey, percentage.value);
      storageMessage.textContent = valid || amount.value === ''
        ? 'Salvat automat în acest browser.'
        : 'Suma nu este validă. Ultima sumă validă rămâne salvată.';
    } catch {
      storageMessage.textContent = 'Nu s-a putut salva. Calculele funcționează, dar modificările nu vor fi păstrate.';
    }
  }
}

amount.addEventListener('input', () => update(true));
percentage.addEventListener('input', () => update(true));
document.querySelector('#calculator-form').addEventListener('submit', event => event.preventDefault());
update();
