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
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        returnToYami();
      }, true);
    });
  };

  const style = document.createElement('style');
  style.textContent = `
    .back,.mini-back,[data-yami-back]{display:grid!important;place-items:center!important;width:42px!important;height:42px!important;min-width:42px!important;padding:0!important;border:0!important;border-radius:50%!important;background:#17394d!important;color:#fff!important;font:400 29px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif!important;box-shadow:0 5px 14px rgba(8,33,48,.24)!important;text-decoration:none!important;cursor:pointer!important;transition:transform .18s ease,background .18s ease!important}.back:hover,.mini-back:hover,[data-yami-back]:hover{background:#ff671d!important;transform:translateY(-1px)}.back:active,.mini-back:active,[data-yami-back]:active{transform:scale(.95)}
  `;
  document.head.appendChild(style);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyYamiBack, { once: true });
  else applyYamiBack();
})();
