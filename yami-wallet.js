(() => {
  if (window.YamiWallet) return;
  const autoCapture = document.currentScript?.dataset.autoCapture === 'true';
  const BALANCE_KEY = 'yami.demo.wallet.balance.v1';
  const HISTORY_KEY = 'yami.demo.wallet.history.v1';
  const STARTING_BALANCE = 10057;
  const cleanAmount = (value) => Math.max(0, Math.round((Number(value) || 0) * 100) / 100);
  const readNumber = () => {
    try {
      const stored = Number(localStorage.getItem(BALANCE_KEY));
      return Number.isFinite(stored) && stored >= 0 ? stored : STARTING_BALANCE;
    } catch (_) {
      return STARTING_BALANCE;
    }
  };
  const writeNumber = (value) => {
    try { localStorage.setItem(BALANCE_KEY, String(value)); } catch (_) {}
  };
  const getHistory = () => {
    try {
      const stored = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
      return Array.isArray(stored) ? stored : [];
    } catch (_) {
      return [];
    }
  };
  const saveHistory = (entries) => {
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, 50))); } catch (_) {}
  };
  const format = (value) => `R${cleanAmount(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const notify = (detail) => {
    window.dispatchEvent(new CustomEvent('yami:wallet-changed', { detail }));
    if (window.parent !== window) window.parent.postMessage({ type: 'yami:wallet-changed', ...detail }, '*');
  };
  const record = ({ amount, direction, label, category = 'Payments', detail = '' }) => {
    const entry = { id: `YMI-${Date.now().toString(36).toUpperCase()}`, amount: cleanAmount(amount), direction, label, category, detail, createdAt: new Date().toISOString() };
    saveHistory([entry, ...getHistory()]);
    return entry;
  };
  const set = (value, meta = {}) => {
    const balance = cleanAmount(value);
    writeNumber(balance);
    notify({ balance, formatted: format(balance), ...meta });
    return balance;
  };
  const debit = (amount, meta = {}) => {
    const charge = cleanAmount(amount);
    const current = readNumber();
    if (!charge || charge > current) return { ok: false, balance: current, formatted: format(current), reason: charge > current ? 'insufficient' : 'invalid' };
    const transaction = record({ amount: charge, direction: 'debit', ...meta });
    const balance = set(current - charge, { transaction });
    return { ok: true, balance, formatted: format(balance), transaction };
  };
  const credit = (amount, meta = {}) => {
    const addition = cleanAmount(amount);
    if (!addition) return { ok: false, balance: readNumber(), reason: 'invalid' };
    const transaction = record({ amount: addition, direction: 'credit', ...meta });
    const balance = set(readNumber() + addition, { transaction });
    return { ok: true, balance, formatted: format(balance), transaction };
  };
  window.YamiWallet = { get: readNumber, set, debit, credit, format, history: getHistory, startingBalance: STARTING_BALANCE };
  try { if (localStorage.getItem(BALANCE_KEY) === null) writeNumber(STARTING_BALANCE); } catch (_) {}
  if (autoCapture) document.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    const labels = { place: ['Yami Food order', 'Services'], pay: ['DStv subscription', 'Services'], confirm: ['Yami Flights booking', 'Travel'] };
    const config = labels[button.id];
    if (!config || (button.id === 'confirm' && !/flight/i.test(document.title))) return;
    const scope = button.closest('.modal,.sheet') || document;
    const matches = [...scope.textContent.matchAll(/R\s*([\d\s,.]+)/g)];
    const raw = matches.at(-1)?.[1]?.trim() || '';
    const normalized = raw.includes('.') ? raw.replace(/[\s,]/g, '') : raw.replace(/\s/g, '').replace(',', '.');
    const amount = Number(normalized);
    if (!Number.isFinite(amount) || amount <= 0) return;
    const result = debit(amount, { label: config[0], category: config[1], detail: document.title });
    if (!result.ok) {
      event.preventDefault();
      event.stopImmediatePropagation();
      button.textContent = 'Insufficient Yami balance';
      return;
    }
  }, true);
  window.dispatchEvent(new Event('yami:wallet-ready'));
})();
