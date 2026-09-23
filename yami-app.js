(() => {
  const modal = document.getElementById('mini-app');
  const frame = document.getElementById('mini-frame');
  const title = document.getElementById('mini-title');
  const balance = document.getElementById('wallet-balance');
  const refreshBalance = () => { if (window.YamiWallet?.get) balance.textContent = window.YamiWallet.format(window.YamiWallet.get()); };
  const closeMiniApp = () => { frame.removeAttribute('src'); modal.classList.remove('is-open'); modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; refreshBalance(); };
  const configureFrame = () => {
    const doc = frame.contentDocument;
    if (!doc?.body) return;
    if (!doc.querySelector('script[src*="yami-wallet.js"]')) { const wallet = doc.createElement('script'); wallet.src = '/yami-wallet.js?v=1'; doc.body.appendChild(wallet); }
    if (!doc.querySelector('script[src*="yami-shell.js"]')) { const shell = doc.createElement('script'); shell.src = '/yami-shell.js?v=1'; doc.body.appendChild(shell); }
  };
  const openMiniApp = (destination, name) => { title.textContent = name || 'Service'; frame.title = `Yami ${name || 'service'}`; frame.src = destination; modal.classList.add('is-open'); modal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; };
  document.querySelectorAll('[data-open]').forEach((button) => button.addEventListener('click', () => openMiniApp(button.dataset.open, button.dataset.name)));
  document.getElementById('close-mini-app').addEventListener('click', closeMiniApp);
  frame.addEventListener('load', () => window.setTimeout(configureFrame, 30));
  window.addEventListener('message', (event) => { if (event.data?.type === 'yami:closeMiniApp') closeMiniApp(); });
  window.addEventListener('yami:wallet-changed', refreshBalance);
  window.addEventListener('storage', (event) => { if (event.key === 'yami.demo.wallet.balance.v1') refreshBalance(); });
  document.querySelector('[data-home]').addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));
  refreshBalance();
})();
