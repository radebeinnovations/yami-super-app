(() => {
  const carriers = {
    vodacom: { label: 'vodacom', name: 'Vodacom', brand: '#e60000', shade: '#a70000', tint: '#fff0f0', screen: '#fff6f6', onBrand: '#ffffff', number: '082 123 4567', data: '1.30 GB', airtime: 'R35.00', offer: 'Get 2GB data\nfor only R29' },
    mtn: { label: 'MTN', name: 'MTN', brand: '#ffcc00', shade: '#d7a900', tint: '#fff8cc', screen: '#fff9dd', onBrand: '#202020', number: '083 456 7890', data: '2.00 GB', airtime: 'R48.50', offer: 'Get 3GB data\nfor only R39' },
    telkom: { label: 'telkom', name: 'Telkom', brand: '#0066b3', shade: '#004e8a', tint: '#e4f2fc', screen: '#eff8ff', onBrand: '#ffffff', number: '081 987 6543', data: '1.75 GB', airtime: 'R42.00', offer: 'Double your data\nthis weekend' },
    cellc: { label: 'cell c', name: 'Cell C', brand: '#171717', shade: '#000000', tint: '#eeeeee', screen: '#f0f0f0', onBrand: '#ffffff', number: '084 222 3344', data: '950 MB', airtime: 'R27.00', offer: 'Weekend data deal\nfrom R19' },
  };

  const icons = { data: '⌁', airtime: '◉', recharge: '＋', bundles: '◫', send: '↗', bill: '▤', bell: '♧', back: '‹', home: '⌂', buy: '▱', rewards: '★', more: '⋮' };
  const toast = (text) => {
    const node = document.querySelector('.telecom-toast') || Object.assign(document.createElement('div'), { className: 'telecom-toast' });
    node.textContent = text;
    document.body.appendChild(node);
    requestAnimationFrame(() => node.classList.add('show'));
    clearTimeout(window.__telecomToast);
    window.__telecomToast = setTimeout(() => node.classList.remove('show'), 2200);
  };

  const close = () => document.querySelector('.telecom-demo')?.remove();
  const open = () => {
    if (document.querySelector('.telecom-demo')) return;
    const app = document.createElement('section');
    app.className = 'telecom-demo';
    app.innerHTML = `
      <style>
        .telecom-demo{--brand:#e60000;--shade:#a70000;--tint:#fff0f0;--screen:#fff6f6;--on-brand:#fff;position:fixed;z-index:2147483646;inset:0;overflow:auto;background:var(--screen);color:#1e1e1e;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;transition:background .28s ease}.telecom-demo *{box-sizing:border-box}.telecom-head{padding:calc(14px + env(safe-area-inset-top)) 16px 17px;background:linear-gradient(135deg,var(--brand),var(--shade));color:var(--on-brand);border-radius:0 0 28px 28px;transition:background .28s ease,color .28s ease}.telecom-top{display:flex;align-items:center}.telecom-logo{margin-left:9px;font-size:26px;letter-spacing:-1.3px;font-weight:800}.telecom-spacer{flex:1}.telecom-head-button{width:39px;height:39px;margin-left:7px;border:0;border-radius:50%;background:#ffffff29;color:inherit;font-size:21px}.telecom-avatar{display:inline-grid;place-items:center;width:36px;height:36px;margin-left:8px;border-radius:50%;background:#fff;color:var(--brand);font-size:12px;font-weight:800}.carrier-tabs{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-top:16px}.carrier-tab{height:35px;border:1px solid #ffffff70;border-radius:9px;background:#ffffff18;color:inherit;font-size:11px;font-weight:800}.carrier-tab.selected{border-color:#fff;background:#fff;color:var(--brand);box-shadow:0 3px 10px #0002}.telecom-greeting{margin-top:19px;font-size:21px;font-weight:800}.telecom-number{margin-top:4px;opacity:.8;font-size:13px}.telecom-body{padding:14px 16px 92px}.telecom-card{background:#fff;border-radius:20px;padding:18px;box-shadow:0 6px 16px #00000018}.telecom-card-title{display:flex;align-items:center;font-size:19px;font-weight:750}.telecom-wallet{display:block;margin-top:3px;color:#74828b;font-size:11px;font-weight:600}.telecom-eye{margin-left:auto;border:0;background:transparent;color:#555;font-size:20px}.telecom-balance-row{display:flex;align-items:center;margin-top:16px}.telecom-balance{width:50%;text-align:center}.telecom-divider{width:1px;height:105px;background:#e9e9e9}.telecom-ring{width:76px;height:76px;margin:auto;display:grid;place-items:center;border-radius:50%;position:relative;background:conic-gradient(var(--brand) calc(var(--p)*1turn),#00000012 0)}.telecom-ring:after{content:"";position:absolute;inset:6px;border-radius:50%;background:#fff}.telecom-ring span{z-index:1;color:var(--brand);font-size:26px}.telecom-label{margin-top:9px;color:#666;font-size:12px}.telecom-amount{margin-top:3px;font-size:16px;font-weight:800}.telecom-detail{color:#8a8a8a;font-size:11px}.telecom-link{width:100%;margin-top:14px;border:0;background:transparent;color:var(--brand);font-weight:750}.telecom-title-row{display:flex;align-items:center;margin:23px 0 12px;font-size:19px;font-weight:750}.telecom-title-row button{margin-left:auto;border:0;background:transparent;color:var(--brand);font-size:13px}.telecom-actions{display:flex;padding:15px 5px;background:#fff;border-radius:18px}.telecom-action{flex:1;border:0;background:transparent;color:#222;font-size:11px}.telecom-action-icon{width:47px;height:47px;margin:0 auto 8px;display:grid;place-items:center;border-radius:50%;background:var(--tint);color:var(--brand);font-size:25px}.telecom-banner{height:166px;padding:20px;overflow:hidden;position:relative;border-radius:20px;background:linear-gradient(135deg,var(--brand),var(--shade));color:var(--on-brand);transition:background .28s ease}.telecom-banner:after{content:"◌";position:absolute;right:-17px;bottom:-55px;color:#ffffff23;font-size:190px}.telecom-banner small{position:relative;z-index:1;letter-spacing:1.1px;opacity:.76;font-weight:800}.telecom-banner h2{position:relative;z-index:1;margin:8px 0;font-size:24px;line-height:1.1;white-space:pre-line}.telecom-claim{position:relative;z-index:1;border:0;margin-top:5px;padding:8px 14px;border-radius:20px;background:#fff;color:var(--brand);font-size:12px;font-weight:800}.telecom-services{overflow:hidden;background:#fff;border-radius:18px}.telecom-service{width:100%;padding:14px;border:0;border-bottom:1px solid #eee;background:#fff;display:flex;align-items:center;text-align:left;font-size:15px;font-weight:650}.telecom-service:last-child{border:0}.telecom-service-icon{width:42px;height:42px;margin-right:14px;display:grid;place-items:center;border-radius:12px;background:var(--tint);color:var(--brand);font-size:20px}.telecom-service-arrow{margin-left:auto;color:#777;font-size:24px}.telecom-bottom{position:fixed;z-index:2;bottom:0;left:0;right:0;display:flex;padding:8px 10px calc(8px + env(safe-area-inset-bottom));border-top:1px solid #eee;background:#fff}.telecom-nav{flex:1;border:0;background:transparent;color:#666;font-size:11px}.telecom-nav strong{display:block;margin-bottom:3px;font-size:23px;font-weight:500}.telecom-nav.active{color:var(--brand)}.telecom-modal{position:fixed;z-index:4;inset:0;display:none;align-items:end;background:#10242f88}.telecom-modal.open{display:flex}.telecom-sheet{width:100%;padding:13px 20px calc(26px + env(safe-area-inset-bottom));border-radius:24px 24px 0 0;background:#fff}.telecom-handle{width:34px;height:4px;margin:0 auto 16px;border-radius:3px;background:#dbe1e4}.telecom-sheet h2{margin:0;font-size:21px}.telecom-sheet p{color:#71808a;font-size:13px;line-height:1.4}.telecom-input{width:100%;margin-top:11px;padding:13px;border:1px solid #d9e2e7;border-radius:10px;font-size:15px}.telecom-choice-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:13px}.telecom-choice{padding:11px 5px;border:1px solid #dbe5e9;border-radius:10px;background:#fff;color:#29404c;font-size:12px;font-weight:800}.telecom-choice.selected{border-color:var(--brand);background:var(--tint);color:var(--brand)}.telecom-summary{margin-top:14px;padding:12px;border-radius:11px;background:#f4f7f8;font-size:13px}.telecom-summary div{display:flex;justify-content:space-between;margin:6px 0}.telecom-confirm{width:100%;margin-top:14px;padding:14px;border:0;border-radius:11px;background:var(--brand);color:#fff;font-weight:800}.telecom-cancel{width:100%;margin-top:9px;padding:10px;border:0;background:none;color:#65747d;font-weight:700}.telecom-toast{position:fixed;z-index:2147483647;left:50%;bottom:95px;transform:translate(-50%,20px);opacity:0;padding:11px 16px;border-radius:20px;background:#222;color:#fff;font:14px -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;transition:.2s;white-space:nowrap}.telecom-toast.show{transform:translate(-50%,0);opacity:1}
      </style>
      <header class="telecom-head"><div class="telecom-top"><button class="telecom-head-button telecom-close" aria-label="Back to Yami">${icons.back}</button><strong class="telecom-logo" id="telecomLogo">vodacom</strong><span class="telecom-spacer"></span><button class="telecom-head-button telecom-notify" aria-label="Notifications">${icons.bell}</button><span class="telecom-avatar">TM</span></div><div class="carrier-tabs"><button class="carrier-tab selected" data-carrier="vodacom">Vodacom</button><button class="carrier-tab" data-carrier="mtn">MTN</button><button class="carrier-tab" data-carrier="telkom">Telkom</button><button class="carrier-tab" data-carrier="cellc">Cell C</button></div><div class="telecom-greeting">Good morning, Thando</div><div class="telecom-number" id="telecomNumber">082 123 4567 · Prepaid</div></header>
      <main class="telecom-body"><section class="telecom-card"><div class="telecom-card-title"><span><span id="balanceTitle">My Vodacom balances</span><small class="telecom-wallet" id="walletBalance">Yami main balance: R10,057.00</small></span><button class="telecom-eye" aria-label="Hide balances">◉</button></div><div class="telecom-balance-row"><div class="telecom-balance"><div class="telecom-ring" style="--p:.65"><span>${icons.data}</span></div><div class="telecom-label">Anytime Data</div><div class="telecom-amount telecom-data">1.30 GB</div><div class="telecom-detail">Available now</div></div><div class="telecom-divider"></div><div class="telecom-balance"><div class="telecom-ring" style="--p:.35"><span>${icons.airtime}</span></div><div class="telecom-label">Airtime</div><div class="telecom-amount telecom-airtime">R35.00</div><div class="telecom-detail">Available now</div></div></div><button class="telecom-link telecom-view-balances">View all balances ›</button></section>
      <div class="telecom-title-row">Quick actions</div><section class="telecom-actions"><button class="telecom-action"><div class="telecom-action-icon">${icons.recharge}</div>Recharge</button><button class="telecom-action"><div class="telecom-action-icon">${icons.bundles}</div>Buy bundles</button><button class="telecom-action"><div class="telecom-action-icon">${icons.send}</div>Send money</button><button class="telecom-action"><div class="telecom-action-icon">${icons.bill}</div>Pay bill</button></section>
      <div class="telecom-title-row">Just for You <button class="telecom-all">View all</button></div><section class="telecom-banner"><small id="offerLabel">VODACOM OFFER</small><h2 id="offerText">Get 2GB data\nfor only R29</h2><button class="telecom-claim">Claim offer</button></section>
      <div class="telecom-title-row">Popular services</div><section class="telecom-services"><button class="telecom-service"><span class="telecom-service-icon">↔</span>Transfer airtime <span class="telecom-service-arrow">›</span></button><button class="telecom-service"><span class="telecom-service-icon">□</span>Buy a voucher <span class="telecom-service-arrow">›</span></button><button class="telecom-service"><span class="telecom-service-icon">⌁</span>Fibre <span class="telecom-service-arrow">›</span></button><button class="telecom-service"><span class="telecom-service-icon">▯</span>Upgrade <span class="telecom-service-arrow">›</span></button></section></main>
      <nav class="telecom-bottom"><button class="telecom-nav active" data-nav="home"><strong>${icons.home}</strong>Home</button><button class="telecom-nav" data-nav="buy"><strong>${icons.buy}</strong>Buy</button><button class="telecom-nav" data-nav="rewards"><strong>${icons.rewards}</strong>Rewards</button><button class="telecom-nav" data-nav="more"><strong>${icons.more}</strong>More</button></nav><div class="telecom-modal" id="telecomModal"><section class="telecom-sheet"><div class="telecom-handle"></div><h2 id="flowTitle"></h2><p id="flowCopy"></p><label id="flowInputLabel" style="display:none"></label><input class="telecom-input" id="flowInput" style="display:none"><div class="telecom-choice-grid" id="flowChoices"></div><div class="telecom-summary" id="flowSummary"></div><button class="telecom-confirm" id="flowConfirm">Continue</button><button class="telecom-cancel" id="flowCancel">Cancel</button></section></div>`;
    document.body.appendChild(app);
    const backStyle = document.createElement('style');
    backStyle.textContent = '.telecom-demo .telecom-close{width:42px;height:42px;margin:0;border-radius:50%;background:#17394d;color:#fff;font-size:29px;line-height:1;box-shadow:0 5px 14px rgba(8,33,48,.24)}.telecom-demo .telecom-close:hover{background:#ff671d}.telecom-demo .telecom-close:active{transform:scale(.95)}';
    app.appendChild(backStyle);

    let selected = carriers.vodacom;
    const applyCarrier = (key) => {
      selected = carriers[key];
      app.style.setProperty('--brand', selected.brand); app.style.setProperty('--shade', selected.shade); app.style.setProperty('--tint', selected.tint); app.style.setProperty('--screen', selected.screen); app.style.setProperty('--on-brand', selected.onBrand);
      app.querySelector('#telecomLogo').textContent = selected.label;
      app.querySelector('#telecomNumber').textContent = `${selected.number} · Prepaid`;
      app.querySelector('#balanceTitle').textContent = `My ${selected.name} balances`;
      app.querySelector('.telecom-data').textContent = selected.data;
      app.querySelector('.telecom-airtime').textContent = selected.airtime;
      app.querySelector('#offerLabel').textContent = `${selected.name.toUpperCase()} OFFER`;
      app.querySelector('#offerText').textContent = selected.offer;
      app.querySelectorAll('.carrier-tab').forEach(tab => tab.classList.toggle('selected', tab.dataset.carrier === key));
      toast(`${selected.name} theme selected`);
    };
    app.querySelector('.telecom-close').onclick = close;
    app.querySelector('.telecom-notify').onclick = () => toast(`No new ${selected.name} notifications.`);
    app.querySelectorAll('.carrier-tab').forEach(tab => tab.onclick = () => applyCarrier(tab.dataset.carrier));
    app.querySelector('.telecom-eye').onclick = (event) => { const hidden = event.currentTarget.dataset.hidden === '1'; app.querySelector('.telecom-data').textContent = hidden ? selected.data : '••••••'; app.querySelector('.telecom-airtime').textContent = hidden ? selected.airtime : '••••••'; event.currentTarget.dataset.hidden = hidden ? '0' : '1'; };
    let yamiBalance = 10057;
    let activeFlow = null;
    let selectedChoice = 0;
    const flows = {
      recharge: { title: 'Recharge airtime', copy: 'Choose an amount for this mobile number.', input: 'Mobile number', value: () => selected.number, choices: [['R12', 12], ['R29', 29], ['R55', 55]] },
      bundles: { title: 'Buy a data bundle', copy: 'Your bundle will be activated immediately after payment.', choices: [['1GB · R29', 29], ['2GB · R49', 49], ['5GB · R99', 99]] },
      send: { title: 'Send money', copy: 'Enter the recipient you want to pay from your Yami main balance.', input: 'Recipient mobile number', value: () => '', choices: [['R20', 20], ['R50', 50], ['R100', 100]] },
      bill: { title: 'Pay mobile bill', copy: 'Enter the account reference and choose a payment amount.', input: 'Account reference', value: () => selected.number, choices: [['R50', 50], ['R150', 150], ['R300', 300]] },
      transfer: { title: 'Transfer airtime', copy: 'Share airtime with another prepaid number.', input: 'Recipient mobile number', value: () => '', choices: [['R10', 10], ['R20', 20], ['R40', 40]] },
      voucher: { title: 'Buy a voucher', copy: 'Purchase a digital voucher using your Yami main balance.', choices: [['R25 voucher', 25], ['R50 voucher', 50], ['R100 voucher', 100]] },
      fibre: { title: 'Get Fibre', copy: 'Choose a monthly Fibre plan. This demo will request your Yami balance payment.', input: 'Installation address', value: () => '', choices: [['20Mbps · R199', 199], ['50Mbps · R349', 349], ['100Mbps · R499', 499]] },
      upgrade: { title: 'Upgrade your device', copy: 'Choose a demo upgrade deposit to reserve your next device.', choices: [['Entry · R299', 299], ['Plus · R599', 599], ['Premium · R999', 999]] },
      balances: { title: 'Balance details', copy: 'Review your available data, airtime and Yami funding balance.', choices: [['No payment required', 0]] },
      rewards: { title: 'Yami rewards', copy: 'Redeem a reward with your available 640 Yami points.', choices: [['1GB data · 450 pts', 0], ['R10 airtime · 250 pts', 0], ['Movie voucher · 600 pts', 0]], noPayment: true },
      mobileMore: { title: 'More mobile services', copy: 'Manage your line, view usage and get help in one place.', choices: [['Usage overview', 0], ['Manage SIM', 0], ['Contact support', 0]], noPayment: true },
    };
    const modal = app.querySelector('#telecomModal');
    const updateWallet = () => app.querySelector('#walletBalance').textContent = `Yami main balance: R${yamiBalance.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`;
    const renderChoices = () => {
      const choices = activeFlow.choices;
      app.querySelector('#flowChoices').innerHTML = choices.map((choice, index) => `<button class="telecom-choice ${index === selectedChoice ? 'selected' : ''}" data-choice="${index}">${choice[0]}</button>`).join('');
      app.querySelectorAll('.telecom-choice').forEach(button => button.onclick = () => { selectedChoice = Number(button.dataset.choice); renderChoices(); });
      updateFlowSummary();
    };
    const updateFlowSummary = () => {
      const [label, amount] = activeFlow.choices[selectedChoice];
      app.querySelector('#flowSummary').innerHTML = `<div><span>${activeFlow.title}</span><b>${label}</b></div><div><span>Payment source</span><b>${activeFlow.noPayment ? 'Yami rewards' : 'Yami main balance'}</b></div><div><span>Available</span><b>${activeFlow.noPayment ? '640 points' : `R${yamiBalance.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`}</b></div>`;
      app.querySelector('#flowConfirm').textContent = activeFlow === flows.balances ? 'Close details' : activeFlow.noPayment ? 'Redeem reward' : `Continue · Pay R${amount.toFixed(2)}`;
    };
    const openFlow = (key) => {
      activeFlow = flows[key]; selectedChoice = 0;
      app.querySelector('#flowTitle').textContent = activeFlow.title;
      app.querySelector('#flowCopy').textContent = activeFlow.copy;
      const inputLabel = app.querySelector('#flowInputLabel'); const input = app.querySelector('#flowInput');
      if (activeFlow.input) { inputLabel.style.display = 'block'; inputLabel.textContent = activeFlow.input; input.style.display = 'block'; input.value = activeFlow.value(); input.placeholder = activeFlow.input; } else { inputLabel.style.display = 'none'; input.style.display = 'none'; input.value = ''; }
      renderChoices(); modal.classList.add('open');
    };
    app.querySelector('#flowCancel').onclick = () => modal.classList.remove('open');
    app.querySelector('#flowConfirm').onclick = () => {
      if (activeFlow === flows.balances) { modal.classList.remove('open'); return; }
      const input = app.querySelector('#flowInput');
      if (activeFlow.input && !input.value.trim()) { toast(`Enter ${activeFlow.input.toLowerCase()}`); return; }
      const [label, amount] = activeFlow.choices[selectedChoice];
      if (activeFlow.noPayment) { modal.classList.remove('open'); toast(`${activeFlow.title}: ${label}`); return; }
      if (amount > yamiBalance) { toast('Your Yami main balance is too low'); return; }
      yamiBalance -= amount; updateWallet(); modal.classList.remove('open'); toast(amount ? `${activeFlow.title} completed successfully` : 'Balance details closed');
    };
    ['recharge', 'bundles', 'send', 'bill'].forEach((flow, index) => app.querySelectorAll('.telecom-action')[index].onclick = () => openFlow(flow));
    ['transfer', 'voucher', 'fibre', 'upgrade'].forEach((flow, index) => app.querySelectorAll('.telecom-service')[index].onclick = () => openFlow(flow));
    app.querySelector('.telecom-claim').onclick = () => openFlow('bundles');
    app.querySelector('.telecom-view-balances').onclick = () => openFlow('balances');
    app.querySelector('.telecom-all').onclick = () => openFlow('bundles');
    app.querySelectorAll('.telecom-nav').forEach(el => el.onclick = () => {
      app.querySelectorAll('.telecom-nav').forEach(button => button.classList.toggle('active', button === el));
      const nav = el.dataset.nav;
      if (nav === 'home') { modal.classList.remove('open'); app.querySelector('.telecom-body').scrollTo({ top: 0, behavior: 'smooth' }); toast(`${selected.name} home`); }
      if (nav === 'buy') openFlow('bundles');
      if (nav === 'rewards') openFlow('rewards');
      if (nav === 'more') openFlow('mobileMore');
    });
  };

  window.openVodacomDemo = open;
})();
