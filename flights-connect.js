const app = document.querySelector('#airport-app');
const toast = document.querySelector('#toast');

const state = { view: 'home', leaveSubmitted: false, travelSearched: false };

const icon = (name) => {
  const icons = {
    wing: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 13.5 21 5l-6.4 6.5 5.1 1.7-9.7 4.8L3 13.5Z"/><path d="m10 18 3.3-6.5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
    bell: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg>',
    home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 11 9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1Z"/></svg>',
    services: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></svg>',
    plane: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 12 18-7-7 18-3-8-8-3Z"/><path d="m11 15 5-5"/></svg>',
    news: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14v14H5z"/><path d="M8 9h8M8 12h8M8 15h5"/></svg>',
    more: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/></svg>',
    payslip: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h8l3 3v15H7z"/><path d="M15 3v4h4M10 11h5M10 15h5"/></svg>',
    leave: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7"/><path d="M12 2v3M12 19v3M4.9 4.9 7 7M17 17l2.1 2.1M2 12h3M19 12h3"/></svg>',
    profile: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.2"/><path d="M4.7 20c.8-3.2 3.4-5 7.3-5s6.5 1.8 7.3 5"/></svg>',
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.8a5.5 5.5 0 0 0-7.8 0L12 6l-1-1.2a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.4a5.5 5.5 0 0 0 0-7.8Z"/></svg>',
    cap: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 9 9-5 9 5-9 5-9-5Z"/><path d="M7 12v4c3 2 7 2 10 0v-4M21 10v5"/></svg>',
    airport: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20V8l8-4 8 4v12M4 13h16M8 9h.01M12 9h.01M16 9h.01M8 17h8"/></svg>',
    shield: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 20 6v5c0 5-3.4 8.2-8 10-4.6-1.8-8-5-8-10V6l8-3Z"/><path d="m8.5 12 2.2 2.2 4.8-5"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>',
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/></svg>',
    back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></svg>',
    download: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg>',
    location: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  };
  return icons[name] || icons.services;
};

const brand = () => `<div class="brand"><span class="brand-mark">${icon('wing')}</span><span>Airport Connect<small>Powered by Yami</small></span></div>`;
const topbar = () => `<header class="topbar">${brand()}<button class="icon-button" data-action="notify" aria-label="Show alerts">${icon('bell')}</button></header>`;
const nav = (active) => `<nav class="bottom-nav" aria-label="Airport Connect navigation">
  <button class="${active === 'home' ? 'active' : ''}" data-view="home">${icon('home')}<span>Home</span></button>
  <button class="${active === 'services' ? 'active' : ''}" data-view="services">${icon('services')}<span>Services</span></button>
  <button class="${active === 'airports' || active === 'travel' ? 'active' : ''}" data-view="airports">${icon('plane')}<span>Airports</span></button>
  <button class="${active === 'news' ? 'active' : ''}" data-view="news">${icon('news')}<span>News</span></button>
  <button class="${active === 'more' || active === 'profile' ? 'active' : ''}" data-view="more">${icon('more')}<span>More</span></button>
</nav>`;

const section = (title, action, content) => `<section><div class="section-heading"><h2>${title}</h2>${action ? `<button class="text-button" data-view="${action.view}">${action.label}</button>` : ''}</div>${content}</section>`;

const quick = (view, iconName, label, flavour = '') => `<button class="quick ${flavour}" data-view="${view}">${icon(iconName)}<span>${label}</span></button>`;

const home = () => `<div class="home">
  ${topbar()}
  <section class="welcome"><span class="avatar">TM</span><div><p>Good morning,</p><h1>Thando Mokoena</h1></div></section>
  <section class="main-flight-hero"><img src="assets/airport-main-landing.jpg" alt="Aircraft arriving on a runway"><div class="hero-copy"><span>YAMI AIRPORT CONNECT</span><h2>Every journey starts here.</h2></div></section>
  <section class="identity-card"><div class="identity-top"><span>EMPLOYEE ID</span><span class="id-chip">YAM-AC12456</span></div><h2>Airport Connect</h2><p>Airport Operations Officer · Operations Department</p></section>
  <section class="stats"><article class="stat"><strong>12</strong><small>leave days<br>available</small></article><article class="stat"><strong>3</strong><small>unread<br>messages</small></article><article class="stat"><strong>2</strong><small>new<br>announcements</small></article></section>
  ${section('Quick access', { view: 'services', label: 'View all' }, `<div class="quick-grid">
    ${quick('payslip', 'payslip', 'Payslip')}${quick('leave', 'leave', 'Leave')}${quick('profile', 'profile', 'My profile')}${quick('benefits', 'heart', 'Benefits', 'quick--warm')}
    ${quick('training', 'cap', 'Training')}${quick('travel', 'plane', 'Travel')}${quick('airports', 'airport', 'Airports', 'quick--green')}${quick('more', 'more', 'More')}
  </div>`)}
  <button class="safety-banner" data-view="news"><span>${icon('shield')}</span><div><strong>Safety First. Excellence Always.</strong><p>Read the latest safety update for all airport teams.</p></div></button>
  ${section('Latest updates', { view: 'news', label: 'View all' }, `<div class="content-card"><article class="announcement"><span class="announcement-art"></span><div><strong>Terminal operations briefing</strong><small>Today · 09:30</small></div><span>›</span></article><article class="announcement"><span class="announcement-art"></span><div><strong>Security awareness refresher</strong><small>Training · 2 days left</small></div><span>›</span></article></div>`)}
</div>${nav('home')}`;

const subHeader = (title) => `<header class="sub-head"><button class="back" data-view="home" aria-label="Back to home">${icon('back')}</button><h1>${title}</h1><span class="placeholder"></span></header>`;
const row = (name, detail, iconName, action = 'service') => `<button class="service-row" data-action="${action}" data-label="${name}"><span class="list-icon">${icon(iconName)}</span><span><strong>${name}</strong><small>${detail}</small></span><span class="chevron">›</span></button>`;

const services = () => `<div class="subpage">${subHeader('Services')}<p class="sub-intro">Everything you need for your workday, travel and wellbeing.</p><label class="search-field">${icon('search')}<input type="search" placeholder="Search services" aria-label="Search services"></label><div class="service-list">
  ${row('Payslip', 'View your latest salary and downloads', 'payslip', 'view-payslip')}
  ${row('Leave', 'Apply for leave and see your balance', 'leave', 'view-leave')}
  ${row('Travel & transport', 'Book staff flights and transport', 'plane', 'view-travel')}
  ${row('Airports', 'Airport information and operations', 'airport', 'view-airports')}
  ${row('Training & development', 'Courses and compliance learning', 'cap')}
  ${row('Benefits', 'Your medical, retirement and wellness cover', 'heart', 'view-benefits')}
</div></div>${nav('services')}`;

const payslip = () => `<div class="subpage">${subHeader('Payslip')}<p class="sub-intro">Your current payslip is ready to view or download.</p><section class="payslip-card"><small>APRIL 2026 · NET PAY</small><strong>R18,645.23</strong><p>Payment date · 25 April 2026</p><div class="button-row"><button class="primary primary--light" data-action="download">${icon('download')} Download PDF</button><button class="primary primary--light" data-action="payslip-history">View history</button></div></section><section class="content-card money-list"><div class="money-row"><span>Gross pay</span><b>R24,830.00</b></div><div class="money-row"><span>Deductions</span><b>−R6,184.77</b></div><div class="money-row"><span>Tax</span><b>−R5,857.60</b></div><div class="money-row"><span>Net pay</span><b>R18,645.23</b></div></section></div>${nav('services')}`;

const leave = () => `<div class="subpage">${subHeader('Leave application')}<p class="sub-intro">You have <b>12 days</b> of annual leave available.</p><form class="form-card" id="leave-form"><label>LEAVE TYPE<select required><option>Annual leave</option><option>Sick leave</option><option>Family responsibility leave</option></select></label><div class="form-split"><label>FROM<input type="date" value="2026-05-20" required></label><label>TO<input type="date" value="2026-05-22" required></label></div><label>REASON<textarea placeholder="Add a short note for your manager"></textarea></label><button class="primary" type="submit">Submit request</button></form>${state.leaveSubmitted ? '<div class="confirmation"><b>Leave request submitted</b>Your manager will be notified. We’ll update you once the request has been reviewed.</div>' : ''}</div>${nav('services')}`;

const profile = () => `<div class="subpage">${subHeader('My profile')}<section class="profile-card"><div class="profile-top"><span class="avatar">TM</span><div><h2>Thando Mokoena</h2><p>Airport Operations Officer</p><span class="tagline">Operations Department</span></div></div></section><section class="content-card"><div class="detail-row"><span class="list-icon">${icon('profile')}</span><span><strong>Employee ID</strong><small>YAM-AC12456</small></span></div><div class="detail-row"><span class="list-icon">${icon('news')}</span><span><strong>Email</strong><small>thando.mokoena@yami.co.za</small></span></div><div class="detail-row"><span class="list-icon">${icon('airport')}</span><span><strong>Base airport</strong><small>O.R. Tambo International (JNB)</small></span></div><div class="detail-row"><span class="list-icon">${icon('calendar')}</span><span><strong>Date joined</strong><small>15 May 2019</small></span></div></section><div class="button-row"><button class="primary" data-action="profile-edit">Edit profile</button><button class="secondary" data-view="more">Settings</button></div></div>${nav('more')}`;

const benefits = () => `<div class="subpage">${subHeader('Benefits')}<p class="sub-intro">Your wellbeing matters. Review the support available to you.</p><section class="profile-card"><h2>Benefits at a glance</h2><p>Personal cover, financial support and resources for a healthier work life.</p></section><div class="service-list">${row('Medical aid', 'View your plan and dependants', 'heart')}${row('Retirement fund', 'Your latest fund statement', 'payslip')}${row('Life assurance', 'Policy summary and cover', 'shield')}${row('Wellness programme', 'Talk to a wellness advisor', 'leave')}</div></div>${nav('services')}`;

const training = () => `<div class="subpage">${subHeader('Training & development')}<p class="sub-intro">Complete your mandatory learning and build new skills.</p><div class="service-list">${row('Aviation safety awareness', 'Mandatory · due in 7 days', 'shield')}${row('Customer service excellence', 'In progress · 60% complete', 'profile')}${row('Security awareness', 'Mandatory · completed', 'airport')}${row('Dangerous goods handling', 'Recommended learning', 'plane')}</div></div>${nav('services')}`;

const airports = () => `<div class="subpage">${subHeader('Airports')}<p class="sub-intro">Airport information, operational updates and staff travel.</p><label class="search-field">${icon('search')}<input type="search" placeholder="Search airports" aria-label="Search airports"></label><button class="airport-card airport-card--jnb" data-view="travel"><span class="airport-code">JNB</span><span><strong>O.R. Tambo International</strong><small>Johannesburg · Airport operations</small></span></button><button class="airport-card airport-card--cpt" data-view="travel"><span class="airport-code">CPT</span><span><strong>Cape Town International</strong><small>Cape Town · Airport operations</small></span></button><button class="airport-card airport-card--dur" data-view="travel"><span class="airport-code">DUR</span><span><strong>King Shaka International</strong><small>Durban · Airport operations</small></span></button><button class="airport-card airport-card--plz" data-view="travel"><span class="airport-code">PLZ</span><span><strong>Chief Dawid Stuurman</strong><small>Gqeberha · Airport operations</small></span></button></div>${nav('airports')}`;

const travel = () => `<div class="subpage">${subHeader('Travel & transport')}<p class="sub-intro">Plan your approved staff travel across South Africa.</p><form class="form-card" id="travel-form"><label>FROM<select><option>O.R. Tambo International (JNB)</option><option>Cape Town International (CPT)</option><option>King Shaka International (DUR)</option></select></label><label>TO<select><option>Cape Town International (CPT)</option><option>King Shaka International (DUR)</option><option>O.R. Tambo International (JNB)</option></select></label><div class="form-split"><label>DEPARTURE<input type="date" value="2026-05-21"></label><label>PASSENGERS<select><option>1</option><option>2</option><option>3</option></select></label></div><button class="primary" type="submit">Search flights</button></form>${state.travelSearched ? '<section class="content-card"><div class="detail-row"><span class="list-icon">' + icon('plane') + '</span><span><strong>JNB → CPT · 08:45</strong><small>Staff fare · Economy · Direct</small></span><button class="text-button" data-action="book-travel">Book</button></div><div class="detail-row"><span class="list-icon">' + icon('plane') + '</span><span><strong>JNB → CPT · 15:30</strong><small>Staff fare · Economy · Direct</small></span><button class="text-button" data-action="book-travel">Book</button></div></section>' : ''}</div>${nav('airports')}`;

const news = () => `<div class="subpage">${subHeader('News & announcements')}<p class="sub-intro">The latest updates from your airport network.</p><article class="news-card"><div class="news-art"></div><div><strong>Airport safety week 2026 is now underway</strong><p>Join daily briefings and share best practice with your team.</p><small>21 MAY 2026</small></div></article><article class="news-card"><div class="news-art"></div><div><strong>CEO message: building the future together</strong><p>A message for every employee in the airport community.</p><small>18 MAY 2026</small></div></article><article class="news-card"><div class="news-art"></div><div><strong>System upgrade: IT services update</strong><p>Planned maintenance for employee services this weekend.</p><small>17 MAY 2026</small></div></article></div>${nav('news')}`;

const more = () => `<div class="subpage">${subHeader('More')}<section class="profile-card"><div class="profile-top"><span class="avatar">TM</span><div><h2>Thando Mokoena</h2><p>Airport Operations Officer</p></div></div></section><div class="service-list">${row('My profile', 'Personal details and employment information', 'profile', 'view-profile')}${row('Notifications', '2 new updates', 'bell')}${row('Settings', 'App preferences and privacy', 'services')}${row('Help & support', 'Contact the Airport Connect team', 'news')}${row('About Airport Connect', 'Powered by Yami · Demo environment', 'wing')}</div><div class="button-row"><button class="secondary" data-action="sign-out">Sign out</button></div></div>${nav('more')}`;

const views = { home, services, payslip, leave, profile, benefits, training, airports, travel, news, more };

function render() {
  app.innerHTML = views[state.view]();
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(window.yamiAirportToast);
  window.yamiAirportToast = setTimeout(() => toast.classList.remove('show'), 2600);
}

app.addEventListener('click', (event) => {
  const viewButton = event.target.closest('[data-view]');
  if (viewButton) {
    state.view = viewButton.dataset.view;
    render();
    return;
  }
  const actionButton = event.target.closest('[data-action]');
  if (!actionButton) return;
  const action = actionButton.dataset.action;
  if (action === 'notify') showToast('You have 2 new Airport Connect announcements.');
  else if (action === 'view-payslip') { state.view = 'payslip'; render(); }
  else if (action === 'view-leave') { state.view = 'leave'; render(); }
  else if (action === 'view-travel' || action === 'view-airports') { state.view = action === 'view-travel' ? 'travel' : 'airports'; render(); }
  else if (action === 'view-profile') { state.view = 'profile'; render(); }
  else if (action === 'view-benefits') { state.view = 'benefits'; render(); }
  else if (action === 'download') showToast('Your April 2026 payslip download is ready.');
  else if (action === 'payslip-history') showToast('Showing the last six months of payslips.');
  else if (action === 'profile-edit') showToast('Profile editing is available in the next demo step.');
  else if (action === 'book-travel') showToast('Flight request saved for manager approval.');
  else if (action === 'sign-out') showToast('Demo session kept active. No account was signed out.');
  else showToast(`${actionButton.dataset.label || 'This service'} is available in the demo.`);
});

app.addEventListener('submit', (event) => {
  event.preventDefault();
  if (event.target.id === 'leave-form') {
    state.leaveSubmitted = true;
    render();
    showToast('Leave request submitted for review.');
  }
  if (event.target.id === 'travel-form') {
    state.travelSearched = true;
    render();
  }
});

render();
