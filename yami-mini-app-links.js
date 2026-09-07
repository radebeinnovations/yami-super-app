(() => {
  const openMiniApp = (destination, name) => {
    document.querySelector('.yami-mini-overlay')?.remove();
    const overlay = document.createElement('section');
    overlay.className = 'yami-mini-overlay';
    overlay.setAttribute('aria-label', `${name} mini app`);
    overlay.innerHTML = `<style>.yami-mini-overlay{position:fixed;z-index:2147483646;inset:0;background:#111}.yami-mini-overlay iframe{display:block;width:100%;height:100%;border:0;background:#fff}.yami-mini-overlay .yami-close{position:absolute;z-index:2;top:12px;right:12px;width:34px;height:34px;border:0;border-radius:50%;background:#102d43d9;color:#fff;font-size:23px;line-height:1;cursor:pointer}</style><button class="yami-close" aria-label="Close ${name}">×</button><iframe title="${name}" src="${destination}"></iframe>`;
    overlay.querySelector('.yami-close').onclick = () => overlay.remove();
    const frame = overlay.querySelector('iframe');
    frame.addEventListener('load', () => {
      const frameDocument = frame.contentDocument;
      if (!frameDocument) return;
      if (!frameDocument.getElementById('yami-wallet-script') && !frameDocument.querySelector('script[src*="yami-wallet.js"]')) {
        const wallet = frameDocument.createElement('script');
        wallet.id = 'yami-wallet-script';
        wallet.src = '/yami-wallet.js?v=2';
        wallet.dataset.autoCapture = 'true';
        frameDocument.body.appendChild(wallet);
      }
      if (frameDocument.getElementById('yami-shell-script')) return;
      const shell = frameDocument.createElement('script');
      shell.id = 'yami-shell-script';
      shell.src = '/yami-shell.js?v=2';
      frameDocument.body.appendChild(shell);
    });
    document.body.appendChild(overlay);
  };
  window.addEventListener('message', (event) => {
    if (event.data?.type === 'yami:closeMiniApp') document.querySelector('.yami-mini-overlay')?.remove();
    if (event.data?.type === 'yami:openMiniApp' && event.data.destination) openMiniApp(event.data.destination, event.data.name || 'Yami service');
    if (event.data?.type === 'yami:wallet-changed') window.setTimeout(() => syncDashboardCards(), 0);
  });
  window.addEventListener('storage', (event) => { if (event.key === 'yami.demo.wallet.balance.v1') syncDashboardCards(); });
  window.addEventListener('yami:wallet-changed', () => syncDashboardCards());
  window.addEventListener('yami-wallet-ready', () => window.setTimeout(() => syncDashboardCards(), 0));
  window.addEventListener('pageshow', () => window.setTimeout(() => syncDashboardCards(), 0));
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') syncDashboardCards(); });
  const tileFor = (label) => label.closest('ion-col, ion-item, ion-tab-button, button, [routerlink]');
  const linkTile = (label, destination, name) => {
    const tile = tileFor(label);
    if (!tile || tile.dataset.yamiMiniApp) return null;
    tile.dataset.yamiMiniApp = name;
    tile.style.cursor = 'pointer';
    tile.setAttribute('aria-label', `Open ${name}`);
    tile.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      openMiniApp(destination, name);
    }, true);
    return tile;
  };
  const linkTelecom = (label) => {
    const tile = tileFor(label);
    if (!tile || tile.dataset.yamiTelecom) return;
    tile.dataset.yamiTelecom = 'true';
    tile.style.cursor = 'pointer';
    tile.setAttribute('aria-label', 'Open Yami telecom services');
    tile.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      window.openVodacomDemo?.();
    }, true);
  };

  const addPasswordToggle = () => {
    const host = document.querySelector('ion-input[formcontrolname="password"]');
    const input = host?.querySelector('input');
    const item = host?.closest('ion-item');
    if (!input || !item || item.querySelector('.yami-password-toggle')) return;

    if (!document.getElementById('yami-password-toggle-style')) {
      const style = document.createElement('style');
      style.id = 'yami-password-toggle-style';
      style.textContent = '.yami-password-toggle{position:absolute;z-index:3;right:13px;top:50%;display:grid;place-items:center;width:38px;height:38px;border:0;border-radius:50%;background:transparent;color:#536772;transform:translateY(-50%);cursor:pointer}.yami-password-toggle:active{background:#eaf0f3}.yami-password-toggle svg{width:21px;height:21px;fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2}';
      document.head.appendChild(style);
    }

    const icon = (visible) => visible
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 3 18 18"></path><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"></path><path d="M9.9 4.2A10.6 10.6 0 0 1 12 4c5.2 0 8.8 5.2 8.8 8s-1.5 4.7-3.8 6.2"></path><path d="M6.6 6.6C4.4 8.1 3.2 10.2 3.2 12c0 2.8 3.6 8 8.8 8 1.1 0 2.1-.2 3.1-.7"></path></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.8 12s3.4-6 9.2-6 9.2 6 9.2 6-3.4 6-9.2 6-9.2-6-9.2-6Z"></path><circle cx="12" cy="12" r="2.6"></circle></svg>';

    item.style.position = 'relative';
    input.style.paddingRight = '52px';
    const button = document.createElement('button');
    button.className = 'yami-password-toggle';
    button.type = 'button';
    button.title = 'Show password';
    button.setAttribute('aria-label', 'Show password');
    button.innerHTML = icon(false);
    button.addEventListener('click', () => {
      const visible = input.type === 'password';
      input.type = visible ? 'text' : 'password';
      button.title = visible ? 'Hide password' : 'Show password';
      button.setAttribute('aria-label', button.title);
      button.innerHTML = icon(visible);
    });
    item.appendChild(button);
  };

  const syncLoginBranding = () => {
    if (!document.querySelector('ion-input[formcontrolname="password"]')) return;
    document.title = 'Yami';
    const logo = document.querySelector('.logo-wrapper');
    if (!logo || logo.classList.contains('yami-login-brand')) return;
    if (!document.getElementById('yami-login-brand-style')) {
      const style = document.createElement('style');
      style.id = 'yami-login-brand-style';
      style.textContent = '.logo-wrapper.yami-login-brand{position:relative!important;background-image:none!important}.logo-wrapper.yami-login-brand>*{visibility:hidden!important}.logo-wrapper.yami-login-brand::before{position:absolute;z-index:1;top:calc(50% - 37px);left:50%;width:60px;height:60px;background:url("/ic_logo_splash.6ef2161fd56ca2c2.png") center top/60px auto no-repeat;content:"";transform:translateX(-50%)}.logo-wrapper.yami-login-brand::after{position:absolute;z-index:1;top:calc(50% + 27px);left:50%;color:#fff;content:"Yami";font:700 15px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;letter-spacing:.2px;text-shadow:0 1px 2px rgba(0,0,0,.35);transform:translateX(-50%)}';
      document.head.appendChild(style);
    }
    logo.classList.add('yami-login-brand');
  };

  const syncDashboardCards = () => {
    if (!document.getElementById('yami-dashboard-sync-style')) {
      const style = document.createElement('style');
      style.id = 'yami-dashboard-sync-style';
      style.textContent = `
        ion-card.yami-sync-card{--background:#fff!important;margin:18px 16px 0!important;border-radius:20px!important;background:linear-gradient(145deg,#fff,#f8fafc)!important;box-shadow:0 8px 22px rgba(5,31,48,.16)!important;overflow:hidden!important}ion-card.yami-sync-card ion-card-header,ion-card.yami-sync-card ion-card-content{background:transparent!important}ion-card.yami-sync-card ion-card-header{padding:18px 18px 6px!important}ion-card.yami-sync-card ion-card-subtitle,.yami-quick-title{color:#1b3040!important;font:800 18px -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif!important;text-transform:none!important;letter-spacing:0!important}.yami-quick-title{padding:18px 18px 11px}.top-card-content.yami-sync-card{min-height:0!important;padding:0 10px 14px!important}.top-card-content.yami-sync-card ion-grid{padding:0!important}.top-card-content.yami-sync-card ion-col{padding:7px 2px!important}.top-card-content.yami-sync-card ion-label{min-height:24px!important}ion-card.yami-sync-card ion-card-content{padding:6px 10px 13px!important}ion-card.yami-sync-card ion-grid{padding:5px 2px!important}ion-card.yami-sync-card ion-col{padding:7px 2px!important}ion-card.yami-sync-card button{width:100%;min-width:0!important;padding:2px 0!important;background:transparent!important;color:#1c2d37!important;box-shadow:none!important;text-transform:none!important}ion-card.yami-sync-card ion-icon{width:31px!important;height:31px!important;margin:0 auto 6px!important;color:#000!important;filter:brightness(0) saturate(100%)}ion-card.yami-sync-card ion-label{display:block!important;min-height:27px!important;white-space:normal!important;color:#263641!important;font:600 11px/1.15 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif!important}.yami-water-icon{display:grid;place-items:center;width:31px;height:31px;margin:0 auto 6px;color:#000}.yami-water-icon svg{width:31px;height:31px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}.yami-money-actions{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;padding:0 3px}.yami-money-action{display:flex!important;min-height:86px!important;align-items:center;justify-content:flex-start;flex-direction:column;border:0!important;border-radius:15px!important;padding:7px 2px 5px!important;background:transparent!important;color:#243743!important;cursor:pointer;transition:background .18s ease,transform .18s ease!important}.yami-money-action:hover{background:#edf3f6!important}.yami-money-action:active{background:#e6eef2!important;transform:scale(.96)}.yami-money-icon{display:grid;place-items:center;width:44px;height:44px;margin-bottom:7px;border-radius:14px;background:#edf3f6;color:#17394d}.yami-money-icon svg{width:23px;height:23px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}.yami-money-action span:last-child{font:700 11px/1.15 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;text-align:center;white-space:normal}.card-wrapper.yami-sync-card{padding:5px 0!important}.card-wrapper.yami-sync-card .account-balance{--background:transparent!important;--padding-start:14px!important;--inner-padding-end:14px!important;background:transparent!important}.card-wrapper.yami-sync-card .balance-grid{display:grid!important;grid-template-columns:58px minmax(0,1fr) auto!important;align-items:center!important;width:100%!important}.card-wrapper.yami-sync-card .grid-col h5{margin:0!important;color:#1b3040!important;font:800 18px -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif!important}.card-wrapper.yami-sync-card .grid-col.last{display:block!important;visibility:visible!important;white-space:nowrap!important;color:#1b3040!important;font:700 18px -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif!important;text-align:right!important}.yami-logo-mark{display:flex;flex-direction:column;align-items:center;justify-content:center;width:54px;height:54px;color:#ff671d;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;font-weight:900;line-height:1}.yami-logo-mark span{display:grid;place-items:center;width:42px;height:42px;border-radius:13px;background:#ff671d;color:#fff;font-size:23px;font-style:italic}.yami-logo-mark small{margin-top:2px;font-size:9px;font-weight:900;letter-spacing:.35px}.adverts-wrapper.yami-sync-card{display:none!important}
      `;
      style.textContent += '.yami-money-icon{background:#263340!important;color:#f5cc38!important;border:1px solid #364554!important;box-shadow:0 5px 12px rgba(7,18,28,.18)!important}.yami-money-icon svg{width:24px!important;height:24px!important;stroke-width:1.9!important}';
      style.textContent += '.yami-service-icon{display:grid!important;place-items:center!important;width:44px!important;height:44px!important;margin:0 auto 7px!important;border-radius:12px!important;background:#263340!important;color:#f5cc38!important;border:1px solid #364554!important;box-shadow:0 5px 12px rgba(7,18,28,.18)!important}.yami-service-icon svg{width:24px!important;height:24px!important;fill:none!important;stroke:currentColor!important;stroke-width:1.9!important;stroke-linecap:round!important;stroke-linejoin:round!important}.top-card-content.yami-sync-card ion-label{font-weight:700!important}';
      document.head.appendChild(style);
    }
    document.querySelectorAll('ion-card.card-wrapper,ion-card.top-card-content,ion-card.bills-wrapper,ion-card.adverts-wrapper').forEach(card => card.classList.add('yami-sync-card'));
    const balanceCard = document.querySelector('ion-card.card-wrapper');
    const logo = balanceCard?.querySelector('ion-img');
    if (logo && !balanceCard.querySelector('.yami-logo-mark')) logo.replaceWith(Object.assign(document.createElement('div'), { className: 'yami-logo-mark', innerHTML: '<span>Y</span><small>Yami</small>' }));
    const balanceValue = balanceCard?.querySelector('.grid-col.last');
    if (balanceValue) {
      const stored = Number.parseFloat(localStorage.getItem('yami.demo.wallet.balance.v1') || '');
      const amount = window.YamiWallet?.get?.() ?? stored;
      if (Number.isFinite(amount)) {
        balanceValue.textContent = window.YamiWallet?.format?.(amount) ?? `R${amount.toLocaleString('en-ZA', {minimumFractionDigits:2, maximumFractionDigits:2})}`;
      }
    }
    const quickActions = document.querySelector('ion-card.top-card-content');
    if (quickActions && !quickActions.dataset.yamiMoneyReady) {
      const actions = [
        ['send', 'Send Money', '<path d="m3 11 18-8-8 18-2-7-8-3Z"></path><path d="m11 14 4-4"></path>'],
        ['request', 'Request Money', '<path d="M12 3v12"></path><path d="m7 10 5 5 5-5"></path><path d="M5 20h14"></path>'],
        ['withdraw', 'Withdraw', '<rect x="3" y="6" width="14" height="12" rx="2"></rect><path d="M6 10h8"></path><path d="M19 4v12"></path><path d="m16 13 3 3 3-3"></path>'],
        ['deposit', 'Deposit', '<path d="M4 8h16v11H4z"></path><path d="M7 12h5"></path><path d="m14 5 3-3 3 3"></path><path d="M17 2v10"></path>'],
      ];
      quickActions.dataset.yamiMoneyReady = 'true';
      quickActions.innerHTML = `<div class="yami-quick-title">Quick actions</div><div class="yami-money-actions">${actions.map(([flow, label, paths]) => `<button class="yami-money-action" type="button" data-yami-money="${flow}" aria-label="${label}"><span class="yami-money-icon"><svg viewBox="0 0 24 24" aria-hidden="true">${paths}</svg></span><span>${label}</span></button>`).join('')}</div>`;
      quickActions.querySelectorAll('[data-yami-money]').forEach(button => button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        openMiniApp(`/yami-money.html?flow=${button.dataset.yamiMoney}&v=2`, button.textContent.trim());
      }, true));
    }
  };

  const upgradeServiceIcon = (label, key) => {
    const tile = tileFor(label);
    if (!tile || tile.querySelector('.yami-service-icon')) return;
    const paths = {
      Recharge: '<rect x="7" y="3" width="10" height="18" rx="2"></rect><path d="M10 18h4"></path>',
      Electricity: '<path d="m13 2-8 11h6l-1 9 8-12h-6l1-8Z"></path>',
      Train: '<rect x="5" y="3" width="14" height="16" rx="3"></rect><path d="M8 7h8M8 11h8M9 19l-2 3M15 19l2 3"></path>',
      Flights: '<path d="m3 12 18-7-7 18-3-8-8-3Z"></path><path d="m11 15 5-5"></path>',
      Bus: '<rect x="4" y="4" width="16" height="15" rx="3"></rect><path d="M4 12h16M8 19l-2 3M16 19l2 3M8 8h.01M16 8h.01"></path>',
      DSTV: '<path d="M4 12a8 8 0 0 1 16 0"></path><path d="M12 12v8M8 20h8"></path><circle cx="12" cy="12" r="2"></circle>',
      Water: '<path d="M12 3C8 8 5 11 5 15a7 7 0 0 0 14 0c0-4-3-7-7-12Z"></path><path d="M9 16c.5 1.5 1.5 2.3 3 2.6"></path>',
      More: '<circle cx="6" cy="12" r="1.5"></circle><circle cx="12" cy="12" r="1.5"></circle><circle cx="18" cy="12" r="1.5"></circle>',
      Food: '<path d="M4 4v8a4 4 0 0 0 8 0V4M8 4v16M16 4v16M13 4h6"></path>',
      Vodacom: '<path d="M4 18h2M4 14h6M4 10h10M4 6h14"></path>'
    }[key];
    if (!paths) return;
    const icon = document.createElement('span');
    icon.className = 'yami-service-icon';
    icon.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${paths}</svg>`;
    const oldIcon = tile.querySelector('ion-icon,ion-img,img,.yami-water-icon');
    if (oldIcon) oldIcon.replaceWith(icon);
    else tile.insertBefore(icon, label);
  };

  const attachMiniAppLinks = () => {
    addPasswordToggle();
    syncLoginBranding();
    document.querySelectorAll('[data-vodacom-tile],[data-yami-added-tile],.yami-explore-card').forEach(tile => tile.remove());
    document.querySelectorAll('ion-label').forEach((label) => {
      const title = label.textContent.trim();
      if (title === 'Train') linkTile(label, '/prasa.html?v=20260903c', 'PRASA trains');
      if (title === 'PRASA') linkTile(label, '/prasa.html?v=20260903c', 'PRASA trains');
      if (title === 'Flights') linkTile(label, '/flights.html', 'Yami Flights');
      if (title === 'Food') linkTile(label, '/food.html', 'Yami Food');
      if (title === 'Vodacom') linkTelecom(label);
      if (title === 'DSTV') linkTile(label, '/dstv.html', 'DStv');
      if (title === 'Bus') linkTile(label, '/quickbus.html', 'QuickBus');
      if (title === 'Recharge') linkTelecom(label);
      if (title === 'Electricity') linkTile(label, '/yami-electricity.html', 'Yami Electricity');
      if (title === 'Internet') {
        const tile = tileFor(label);
        const oldIcon = tile?.querySelector('ion-icon,ion-img,img');
        label.textContent = 'Water';
        if (oldIcon && !tile.querySelector('.yami-water-icon')) oldIcon.replaceWith(Object.assign(document.createElement('span'), { className: 'yami-water-icon', innerHTML: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3c-4 6-9 10.5-9 17a9 9 0 0 0 18 0c0-6.5-5-11-9-17Z"></path><path d="M11 21c.7 2.4 2.3 3.7 5 4"></path></svg>' }));
        linkTile(label, '/yami-water.html', 'Water and municipal bills');
      }
      const serviceAliases = { PRASA: 'Train', Food: 'Food', Vodacom: 'Vodacom', Internet: 'Water' };
      const serviceKey = serviceAliases[title] || title;
      if (['Recharge','Electricity','Train','Flights','Bus','DSTV','Water','More','Food','Vodacom'].includes(serviceKey)) upgradeServiceIcon(label, serviceKey);
      if (title === 'More') linkTile(label, '/yami-more.html', 'More Yami services');
      if (title === 'History') linkTile(label, '/yami-history.html', 'Yami activity');
      if (title === 'Account') linkTile(label, '/yami-account.html', 'Yami account');
    });
    syncDashboardCards();
  };

  // Watch for Ionic route rendering without running a 250ms polling loop.
  // The old interval repeatedly rewrote cards on mobile and caused visible
  // flicker/high CPU usage that looked like the page was refreshing.
  let dashboardTimer;
  let dashboardObserver;
  const scheduleDashboardSync = () => {
    window.clearTimeout(dashboardTimer);
    dashboardTimer = window.setTimeout(() => attachMiniAppLinks(), 80);
  };
  const observeDashboard = () => {
    scheduleDashboardSync();
    if (dashboardObserver || !document.body) return;
    dashboardObserver = new MutationObserver((mutations) => {
      if (mutations.some((mutation) => mutation.addedNodes.length || mutation.removedNodes.length)) scheduleDashboardSync();
    });
    dashboardObserver.observe(document.body, { childList: true, subtree: true });
  };
  const refreshAfterNavigation = () => scheduleDashboardSync();
  ['pushState', 'replaceState'].forEach((method) => {
    const original = history[method];
    history[method] = function (...args) {
      const result = original.apply(this, args);
      refreshAfterNavigation();
      return result;
    };
  });
  window.addEventListener('popstate', refreshAfterNavigation);
  document.addEventListener('DOMContentLoaded', observeDashboard, { once: true });
  window.addEventListener('load', observeDashboard, { once: true });
  if (document.readyState !== 'loading') observeDashboard();
})();
