(() => {
  const returnToYami = () => {
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'yami:closeMiniApp' }, '*');
      return;
    }
    window.location.assign('/tabs/home/home/');
  };

  const applyYamiBack = () => {
    document.querySelectorAll('.back, .mini-back, [data-yami-back]').forEach((button) => {
      if (button.dataset.yamiBackReady) return;
      button.dataset.yamiBackReady = 'true';
      button.setAttribute('aria-label', 'Back to Yami');
      // Use an inline SVG instead of a text glyph. Some mobile browsers
      // render the old ‹ character as an emoji/double-chevron.
      button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m15 4-8 8 8 8"></path></svg>';
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        returnToYami();
      }, true);
    });
  };

  const syncWalletDisplay = () => {
    if (!window.YamiWallet) return;
    const accountBalance = document.querySelector('.wallet b');
    if (accountBalance && /^R[\d\s,.]+$/.test(accountBalance.textContent.trim())) accountBalance.textContent = window.YamiWallet.format(window.YamiWallet.get());
  };

  const style = document.createElement('style');
  style.textContent = `
    .back,.mini-back,[data-yami-back]{display:grid!important;place-items:center!important;width:42px!important;height:42px!important;min-width:42px!important;padding:0!important;border:0!important;border-radius:50%!important;background:#17394d!important;color:#fff!important;box-shadow:0 5px 14px rgba(8,33,48,.24)!important;text-decoration:none!important;cursor:pointer!important;transition:transform .18s ease,background .18s ease!important}.back svg,.mini-back svg,[data-yami-back] svg{display:block!important;width:23px!important;height:23px!important;fill:none!important;stroke:currentColor!important;stroke-width:2.3!important;stroke-linecap:round!important;stroke-linejoin:round!important}.back:hover,.mini-back:hover,[data-yami-back]:hover{background:#ff671d!important;transform:translateY(-1px)}.back:active,.mini-back:active,[data-yami-back]:active{transform:scale(.95)}
  `;
  document.head.appendChild(style);
  const boot = () => { applyYamiBack(); syncWalletDisplay(); };
  window.addEventListener('yami:wallet-ready', syncWalletDisplay);
  window.addEventListener('yami:wallet-changed', syncWalletDisplay);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
