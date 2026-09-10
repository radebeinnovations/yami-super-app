const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const cssToAdd = `
#yami-watermarks { position: fixed; inset: 0; z-index: -1; pointer-events: none; overflow: hidden; display: block; }
.yami-wm-row { position: absolute; white-space: nowrap; font-size: 20vw; font-weight: 900; font-family: -apple-system, sans-serif; color: rgba(255,255,255,0.06); }
.yami-wm-left { left: 0; animation: ym-left linear infinite; }
.yami-wm-right { left: -50%; animation: ym-right linear infinite; }
@keyframes ym-left { 0% { transform: translateY(-50%) translateX(0); } 100% { transform: translateY(-50%) translateX(-30%); } }
@keyframes ym-right { 0% { transform: translateY(-50%) translateX(0); } 100% { transform: translateY(-50%) translateX(30%); } }
`;

const htmlToAdd = `
  <div id="yami-watermarks">
    <div class="yami-wm-row yami-wm-left" style="top: 15%; animation-duration: 30s;">Y A M I &nbsp;&nbsp;&nbsp; Y A M I &nbsp;&nbsp;&nbsp; Y A M I &nbsp;&nbsp;&nbsp; Y A M I &nbsp;&nbsp;&nbsp; Y A M I</div>
    <div class="yami-wm-row yami-wm-right" style="top: 35%; animation-duration: 35s;">Y A M I &nbsp;&nbsp;&nbsp; Y A M I &nbsp;&nbsp;&nbsp; Y A M I &nbsp;&nbsp;&nbsp; Y A M I &nbsp;&nbsp;&nbsp; Y A M I</div>
    <div class="yami-wm-row yami-wm-left" style="top: 55%; animation-duration: 25s;">Y A M I &nbsp;&nbsp;&nbsp; Y A M I &nbsp;&nbsp;&nbsp; Y A M I &nbsp;&nbsp;&nbsp; Y A M I &nbsp;&nbsp;&nbsp; Y A M I</div>
    <div class="yami-wm-row yami-wm-right" style="top: 75%; animation-duration: 28s;">Y A M I &nbsp;&nbsp;&nbsp; Y A M I &nbsp;&nbsp;&nbsp; Y A M I &nbsp;&nbsp;&nbsp; Y A M I &nbsp;&nbsp;&nbsp; Y A M I</div>
    <div class="yami-wm-row yami-wm-left" style="top: 95%; animation-duration: 32s;">Y A M I &nbsp;&nbsp;&nbsp; Y A M I &nbsp;&nbsp;&nbsp; Y A M I &nbsp;&nbsp;&nbsp; Y A M I &nbsp;&nbsp;&nbsp; Y A M I</div>
  </div>
`;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  if (content.includes('bg_splash.png')) {
    content = content.replace(/background:[^;]+url\('assets\/images\/main\/bg_splash\.png'\)[^;]*;/g, "background:linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.95)), url('https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=1000') center/cover fixed !important;");
    
    if (!content.includes('yami-watermarks')) {
      content = content.replace('</style>', cssToAdd + '</style>');
      content = content.replace('<body>', '<body>\n' + htmlToAdd);
    }
    
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  }
}
