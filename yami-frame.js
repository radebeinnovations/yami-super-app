(() => {
  'use strict';

  const css = `
    /* The parent Yami shell provides the only exit control: its top-right X. */
    .back, .mini-back, .internal-back, [data-yami-back] { display:none !important; }
    .app > .top > h1 { grid-column:2 !important; }
    .app > .top > span { grid-column:3 !important; }
    .head > .top { justify-content:flex-start !important; }
    .head > .top > .brand { margin-left:0 !important; }
  `;

  const apply = () => {
    document.querySelectorAll('.back, .mini-back, .internal-back, [data-yami-back]').forEach((button) => {
      button.style.setProperty('display', 'none', 'important');
    });
    document.querySelectorAll('.app > .top > h1').forEach((heading) => heading.style.setProperty('grid-column', '2', 'important'));
    document.querySelectorAll('.app > .top > span').forEach((spacer) => spacer.style.setProperty('grid-column', '3', 'important'));
    document.querySelectorAll('.head > .top').forEach((top) => top.style.setProperty('justify-content', 'flex-start', 'important'));
    document.querySelectorAll('.head > .top > .brand').forEach((brand) => brand.style.setProperty('margin-left', '0', 'important'));
  };

  const mount = () => {
    if (!document.getElementById('yami-frame-style')) {
      const style = document.createElement('style');
      style.id = 'yami-frame-style';
      style.textContent = css;
      document.head.append(style);
    }
    apply();
    new MutationObserver(apply).observe(document.documentElement, { childList:true, subtree:true });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once:true });
  else mount();
})();
