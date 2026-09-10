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
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&display=swap');
        html:has(.yami-sync-card) { background-color: #000000 !important; --background: #000000 !important; }
        body:has(.yami-sync-card), ion-app:has(.yami-sync-card), ion-router-outlet:has(.yami-sync-card), .ion-page:has(.yami-sync-card) { background-color: transparent !important; --background: transparent !important; background-image: none !important; }
        html:has(.yami-sync-card) { background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.95)), url('https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=1000') !important; background-size: cover !important; background-position: center !important; background-attachment: fixed !important; }
        ion-content:has(.yami-sync-card) { --background: transparent !important; background: transparent !important; background-image: none !important; }
        ion-content:has(.yami-sync-card)::part(background) { background: transparent !important; background-image: none !important; }
        
        #yami-watermarks { position: fixed; inset: 0; z-index: -1; pointer-events: none; overflow: hidden; display: none; }
        html:has(.yami-sync-card) #yami-watermarks { display: block; }
        .yami-wm-row { position: absolute; white-space: nowrap; font-size: 20vw; font-weight: 900; font-family: -apple-system, sans-serif; color: rgba(255,255,255,0.06); }
        .yami-wm-left { left: 0; animation: ym-left linear infinite; }
        .yami-wm-right { left: -50%; animation: ym-right linear infinite; }
        
        @keyframes ym-left { 0% { transform: translateY(-50%) translateX(0); } 100% { transform: translateY(-50%) translateX(-30%); } }
        @keyframes ym-right { 0% { transform: translateY(-50%) translateX(0); } 100% { transform: translateY(-50%) translateX(30%); } }
        
        ion-card.yami-sync-card{position:relative!important;z-index:10!important;--background:#fff!important;margin:18px 16px 0!important;border-radius:20px!important;background:linear-gradient(145deg,#fff,#f8fafc)!important;box-shadow:0 8px 22px rgba(5,31,48,.16)!important;overflow:hidden!important}ion-card.yami-sync-card ion-card-header,ion-card.yami-sync-card ion-card-content{background:transparent!important}ion-card.yami-sync-card ion-card-header{padding:18px 18px 6px!important}ion-card.yami-sync-card ion-card-subtitle,.yami-quick-title{color:#fff!important;text-shadow:none!important;font:800 18px -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif!important;text-transform:none!important;letter-spacing:0!important}.yami-quick-title{padding:18px 18px 11px}.top-card-content.yami-sync-card{min-height:0!important;padding:0!important;background:transparent!important;box-shadow:none!important;margin-bottom:10px!important}.top-card-content.yami-sync-card ion-grid{padding:0!important}.top-card-content.yami-sync-card ion-col{padding:7px 2px!important}.top-card-content.yami-sync-card ion-label{min-height:24px!important}ion-card.yami-sync-card ion-card-content{padding:6px 10px 13px!important}
        
        /* Quick Actions Grid layout */
        ion-card.top-card-content ion-grid{padding:5px 2px!important}ion-card.top-card-content ion-col{padding:7px 2px!important}
        
        /* Top-up/Bills list layout (1 column list) */
        ion-card.bills-wrapper.yami-sync-card { background: transparent!important; box-shadow: none!important; margin-top: 10px!important; }
        ion-card.bills-wrapper ion-card-header { padding: 10px 4px 6px!important; }
        ion-card.bills-wrapper ion-row { display: flex!important; flex-direction: column!important; gap: 14px!important; padding: 4px!important; }
        ion-card.bills-wrapper ion-col { flex: 0 0 100%!important; max-width: 100%!important; width: 100%!important; padding: 0!important; min-height: 140px!important; border-radius: 24px!important; overflow: hidden!important; position: relative!important; display: flex!important; flex-direction: column!important; box-shadow: 0 10px 24px rgba(0,0,0,0.18)!important; transition: transform 0.2s; background-color: #1a252f!important; }
        ion-card.bills-wrapper ion-col:active { transform: scale(0.96); }
        
        ion-card.bills-wrapper button { flex: 1!important; display:flex; flex-direction:column; justify-content: flex-end; align-items: flex-start; padding: 20px!important; margin:0!important; width:100%; min-width:0!important; background-color:transparent!important; color:#fff!important; box-shadow:none!important; text-transform:none!important; background-size: cover!important; background-position: right center!important; }
        ion-card.bills-wrapper button[data-yami-service="Recharge"], ion-card.bills-wrapper button[data-yami-service="Vodacom"] { background-size: contain !important; background-position: center !important; background-repeat: no-repeat !important; background-color: #111 !important; }
        
        ion-card.bills-wrapper ion-label { padding: 0!important; margin: 0!important; font: 800 18px/1.2 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif!important; text-align: left!important; width: 100%!important; color: #fff!important; text-shadow: 0 2px 5px rgba(0,0,0,0.8); z-index: 2; position: relative; }
        
        .yami-water-icon{display:none} 
        .yami-money-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;padding:0 14px}.yami-money-action{display:flex!important;min-height:100px!important;align-items:flex-start;justify-content:flex-end;flex-direction:column;border:0!important;border-radius:20px!important;padding:12px!important;color:#fff!important;cursor:pointer;transition:transform .18s ease!important;background-size:cover!important;background-position:center!important;box-shadow:0 8px 16px rgba(0,0,0,0.2)!important}.yami-money-action:active{transform:scale(.96)}.yami-money-icon{display:grid;place-items:center;width:34px;height:34px;margin-bottom:auto;border-radius:50%;background:#fff;color:#ff671d;box-shadow:0 4px 10px rgba(0,0,0,0.3);position:relative;z-index:2;}.yami-money-icon svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}.yami-money-action span:last-child{font:800 13px/1.15 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;text-align:left;white-space:normal;position:relative;z-index:2;text-shadow:0 2px 4px rgba(0,0,0,0.8)}.card-wrapper.yami-sync-card{padding:12px 0!important;background:linear-gradient(145deg,#1c1c1e 0%,#000000 100%)!important;border:1px solid rgba(255,103,29,0.4)!important;border-radius:24px!important;box-shadow:0 12px 30px rgba(255,103,29,0.15),inset 0 1px 1px rgba(255,255,255,0.1)!important;color:#fff!important}.card-wrapper.yami-sync-card .account-balance{--background:transparent!important;--padding-start:16px!important;--inner-padding-end:0!important;--padding-end:16px!important;background:transparent!important}.card-wrapper.yami-sync-card .balance-grid{display:grid!important;grid-template-columns:60px auto 1fr!important;align-items:center!important;width:100%!important}.card-wrapper.yami-sync-card .grid-col h5{margin:0!important;color:rgba(255,255,255,0.6)!important;font:600 14px -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif!important;text-transform:uppercase;letter-spacing:1px}.card-wrapper.yami-sync-card .grid-col.last{display:block!important;visibility:visible!important;white-space:nowrap!important;color:#fff!important;font:700 24px 'Space Grotesk',-apple-system,BlinkMacSystemFont,sans-serif!important;text-align:right!important;text-shadow:0 2px 4px rgba(0,0,0,0.4);letter-spacing: 1px}.yami-logo-mark{display:flex;flex-direction:column;align-items:center;justify-content:center;width:54px;height:54px;color:#fff;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;font-weight:900;line-height:1}.yami-logo-mark span{display:grid;place-items:center;width:48px;height:48px;border-radius:16px;background:linear-gradient(135deg,#ff671d 0%,#ff3d00 100%);color:#fff;font-size:14px;font-style:italic;letter-spacing:1px;box-shadow:0 4px 10px rgba(255,103,29,0.3)}.yami-logo-mark small{display:none}.adverts-wrapper.yami-sync-card{display:none!important}
      `;
      style.textContent += '.yami-money-icon{background:#263340!important;color:#f5cc38!important;border:1px solid #364554!important;box-shadow:0 5px 12px rgba(7,18,28,.18)!important}.yami-money-icon svg{width:24px!important;height:24px!important;stroke-width:1.9!important}';
      style.textContent += '.yami-service-icon{position:relative!important; margin-bottom:10px!important; display:grid!important;place-items:center!important;width:42px!important;height:42px!important;border-radius:50%!important;background:#fff!important;color:#ff671d!important;box-shadow:0 4px 14px rgba(0,0,0,.3)!important; z-index:2;}.yami-service-icon svg{width:22px!important;height:22px!important;fill:none!important;stroke:currentColor!important;stroke-width:2!important;stroke-linecap:round!important;stroke-linejoin:round!important}';
      document.head.appendChild(style);
      if (!document.getElementById('yami-watermarks')) {
        const wm = document.createElement('div');
        wm.id = 'yami-watermarks';
        wm.innerHTML = `
          <div class="yami-wm-row yami-wm-left" style="top: 15%; animation-duration: 30s;">Y A M I &nbsp;&nbsp;&nbsp; Y A M I &nbsp;&nbsp;&nbsp; Y A M I &nbsp;&nbsp;&nbsp; Y A M I &nbsp;&nbsp;&nbsp; Y A M I</div>
          <div class="yami-wm-row yami-wm-right" style="top: 35%; animation-duration: 35s;">Y A M I &nbsp;&nbsp;&nbsp; Y A M I &nbsp;&nbsp;&nbsp; Y A M I &nbsp;&nbsp;&nbsp; Y A M I &nbsp;&nbsp;&nbsp; Y A M I</div>
          <div class="yami-wm-row yami-wm-left" style="top: 55%; animation-duration: 25s;">Y A M I &nbsp;&nbsp;&nbsp; Y A M I &nbsp;&nbsp;&nbsp; Y A M I &nbsp;&nbsp;&nbsp; Y A M I &nbsp;&nbsp;&nbsp; Y A M I</div>
          <div class="yami-wm-row yami-wm-right" style="top: 75%; animation-duration: 28s;">Y A M I &nbsp;&nbsp;&nbsp; Y A M I &nbsp;&nbsp;&nbsp; Y A M I &nbsp;&nbsp;&nbsp; Y A M I &nbsp;&nbsp;&nbsp; Y A M I</div>
          <div class="yami-wm-row yami-wm-left" style="top: 95%; animation-duration: 32s;">Y A M I &nbsp;&nbsp;&nbsp; Y A M I &nbsp;&nbsp;&nbsp; Y A M I &nbsp;&nbsp;&nbsp; Y A M I &nbsp;&nbsp;&nbsp; Y A M I</div>
        `;
        document.body.appendChild(wm);
      }
    }
    document.querySelectorAll('ion-card.card-wrapper,ion-card.top-card-content,ion-card.bills-wrapper,ion-card.adverts-wrapper').forEach(card => card.classList.add('yami-sync-card'));
    const balanceCard = document.querySelector('ion-card.card-wrapper');
    const logo = balanceCard?.querySelector('ion-img');
    if (logo && !balanceCard.querySelector('.yami-logo-mark')) logo.replaceWith(Object.assign(document.createElement('div'), { className: 'yami-logo-mark', innerHTML: '<span>YAMI</span><small>Yami</small>' }));
    const balanceLabel = balanceCard?.querySelector('h5');
    if (balanceLabel && balanceLabel.textContent.trim().toUpperCase() === 'YAMI BALANCE') balanceLabel.textContent = 'BALANCE';
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
      const bgMap = {
        send: 'send_bg_user.png',
        request: 'request_bg.jpg',
        withdraw: 'withdraw_bg_user.png',
        deposit: 'deposit_bg_user.png'
      };
      quickActions.dataset.yamiMoneyReady = 'true';
      quickActions.innerHTML = `<div class="yami-quick-title">Quick actions</div><div class="yami-money-actions">${actions.map(([flow, label, paths]) => `<button class="yami-money-action" type="button" data-yami-money="${flow}" aria-label="${label}" style="background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url('/assets/${bgMap[flow] || 'request_bg.jpg'}?v=${Date.now()}')"><span class="yami-money-icon"><svg viewBox="0 0 24 24" aria-hidden="true">${paths}</svg></span><span>${label}</span></button>`).join('')}</div>`;
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
    
    const bgImages = {
      Train: 'train_bg.png',
      Flights: 'flight_bg.png',
      Bus: 'bus_bg_user.png',
      Water: 'water_bg.png',
      Electricity: 'electricity_bg.png',
      DSTV: 'dstv_bg.png',
      Recharge: 'recharge_bg_v3.png',
      More: 'more_bg_v4.png',
      Food: 'more_bg_v4.png',
      Vodacom: 'recharge_bg_v3.png'
    };
    if(bgImages[key]) tile.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/assets/${bgImages[key]}?v=${Date.now()}')`;

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
      if (title === 'Bus') linkTile(label, `/ktvr.html?v=${Date.now()}`, 'KTVR Bus Service');
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
