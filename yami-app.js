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
    if (!doc.getElementById('yami-frame-script')) { const frameUi = doc.createElement('script'); frameUi.id = 'yami-frame-script'; frameUi.src = '/yami-frame.js?v=2'; doc.head.appendChild(frameUi); }
    if (!doc.querySelector('script[src*="yami-wallet.js"]')) { const wallet = doc.createElement('script'); wallet.src = '/yami-wallet.js?v=1'; doc.body.appendChild(wallet); }
    if (!doc.querySelector('script[src*="yami-shell.js"]')) { const shell = doc.createElement('script'); shell.src = '/yami-shell.js?v=1'; doc.body.appendChild(shell); }
  };
  const miniDestinations = new Set([
    'ekurhuleni-bus.html', 'metrobus.html', 'yami-bus-selector.html', 'yami-account.html', 'yami-airtime-data.html',
    'yami-electricity.html', 'yami-finance.html', 'yami-history.html', 'yami-money.html', 'yami-scan-pay.html',
    'yami-services.html', 'yami-water.html', 'flights.html', 'prasa.html'
  ]);
  const openMiniApp = (destination, name) => {
    const parsed = new URL(destination, window.location.href);
    const localDestination = parsed.origin === window.location.origin && miniDestinations.has(parsed.pathname.split('/').pop());
    if (!localDestination) return;
    title.textContent = name || 'Service';
    frame.title = `Yami ${name || 'service'}`;
    frame.src = destination === 'ekurhuleni-bus.html' ? `${destination}?v=metrobus-10` : destination;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  document.querySelectorAll('[data-open]').forEach((button) => button.addEventListener('click', () => openMiniApp(button.dataset.open, button.dataset.name)));
  document.getElementById('close-mini-app').addEventListener('click', closeMiniApp);
  frame.addEventListener('load', () => window.setTimeout(configureFrame, 30));
  window.addEventListener('message', (event) => {
    if (event.origin !== window.location.origin) return;
    if (event.data?.type === 'yami:closeMiniApp') closeMiniApp();
    if (event.data?.type === 'yami:openMiniApp') openMiniApp(event.data.destination, event.data.name);
  });
  window.addEventListener('yami:wallet-changed', refreshBalance);
  window.addEventListener('storage', (event) => { if (event.key === 'yami.demo.wallet.balance.v1') refreshBalance(); });
  document.querySelector('[data-home]').addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

  const adverts = [
    { partner: 'VODACOM', title: 'Mobile data, made easy.', copy: 'Recharge whenever you need it.', cta: 'View offers ↗', href: 'https://www.vodacom.co.za/shopping/shop', image: 'assets/recharge_bg_v3.png' },
    { partner: 'EKURHULENI BUS', title: 'Ride your city with ease.', copy: 'Plan and pay with KTVR Bus.', cta: 'Visit KTVR ↗', href: 'https://ktvr.co.za/', image: 'assets/ekurhuleni-bus-hero.png' },
    { partner: 'AIRLINK', title: 'Fly more, connect more.', copy: 'Book your next journey with Airlink.', cta: 'Visit Airlink ↗', href: 'https://www.flyairlink.com/', image: 'assets/airport-airlink.jpg' },
    { partner: 'PRASA', title: 'Rail travel, made easy.', copy: 'Plan your next journey with PRASA.', cta: 'Visit PRASA ↗', href: 'https://www.prasa.com/Default.aspx', image: 'assets/prasa-train-hero.png' }
  ];
  const renderAdvert = (slot, index) => {
    const advert = adverts[index];
    slot.href = advert.href;
    slot.style.backgroundImage = `url("${advert.image}")`;
    slot.setAttribute('aria-label', `Advertisement: ${advert.partner}. ${advert.title}`);
    slot.querySelector('.ad-label').textContent = `ADVERTISEMENT · ${advert.partner}`;
    slot.querySelector('h2').textContent = advert.title;
    slot.querySelector('p').textContent = advert.copy;
    slot.querySelector('.ad-cta').textContent = advert.cta;
    slot.querySelector('.ad-dots').innerHTML = adverts.map((_, dot) => `<i class="${dot === index ? 'is-active' : ''}"></i>`).join('');
  };
  document.querySelectorAll('[data-ad-slot]').forEach((slot) => {
    let index = Number(slot.dataset.adSlot) % adverts.length;
    renderAdvert(slot, index);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    window.setInterval(() => {
      if (slot.matches(':hover, :focus-within')) return;
      slot.classList.add('is-changing');
      window.setTimeout(() => {
        index = (index + 1) % adverts.length;
        renderAdvert(slot, index);
        window.requestAnimationFrame(() => slot.classList.remove('is-changing'));
      }, 180);
    }, 4500);
  });
  refreshBalance();
})();
