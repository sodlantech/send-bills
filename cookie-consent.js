// Cookie Consent Manager — Send-Bills.com
// Compliant with GDPR, CCPA, ePrivacy, LGPD, POPIA, PIPEDA
// Persists via cookie + localStorage + sessionStorage (triple storage)

(function() {
  'use strict';

  var COOKIE_NAME = 'sb_cookie_consent';
  var STORAGE_KEY = 'sb_consent_prefs';
  var COOKIE_DAYS = 365;

  // Read consent from any available storage
  function getConsent() {
    // 1. Check cookie
    var match = document.cookie.match(new RegExp('(^| )' + COOKIE_NAME + '=([^;]+)'));
    if (match) { try { return JSON.parse(decodeURIComponent(match[2])); } catch(e) {} }
    // 2. Check localStorage
    try { var ls = localStorage.getItem(STORAGE_KEY); if (ls) return JSON.parse(ls); } catch(e) {}
    // 3. Check sessionStorage
    try { var ss = sessionStorage.getItem(STORAGE_KEY); if (ss) return JSON.parse(ss); } catch(e) {}
    return null;
  }

  // Write consent to all available storages
  function setConsent(prefs) {
    prefs.v = 2; // version
    prefs.ts = Date.now();
    var json = JSON.stringify(prefs);
    // Cookie
    var d = new Date(); d.setTime(d.getTime() + COOKIE_DAYS * 86400000);
    document.cookie = COOKIE_NAME + '=' + encodeURIComponent(json) + ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax;Secure';
    // localStorage
    try { localStorage.setItem(STORAGE_KEY, json); } catch(e) {}
    // sessionStorage
    try { sessionStorage.setItem(STORAGE_KEY, json); } catch(e) {}
  }

  // Already consented — don't show
  if (getConsent()) return;

  // Inject styles
  var style = document.createElement('style');
  style.textContent = [
    '.cookie-overlay{position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:99999;display:flex;align-items:flex-end;justify-content:center;padding:16px;animation:cookieFadeIn .3s ease}',
    '@keyframes cookieFadeIn{from{opacity:0}to{opacity:1}}',
    '.cookie-banner{background:#fff;border-radius:16px 16px 0 0;max-width:680px;width:100%;box-shadow:0 -8px 40px rgba(0,0,0,.15);padding:28px 24px 20px;font-family:Inter,system-ui,sans-serif;color:#111827;position:relative;max-height:90vh;overflow-y:auto}',
    '.cookie-banner h3{font-size:18px;font-weight:800;margin:0 0 8px;display:flex;align-items:center;gap:8px}',
    '.cookie-banner h3 span{font-size:22px}',
    '.cookie-banner p{font-size:13px;color:#6B7280;line-height:1.6;margin:0 0 16px}',
    '.cookie-banner a{color:#0D9488;text-decoration:none;font-weight:600}',
    '.cookie-banner a:hover{text-decoration:underline}',
    '.cookie-toggles{display:flex;flex-direction:column;gap:10px;margin-bottom:18px}',
    '.cookie-toggle{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px}',
    '.cookie-toggle-info{flex:1}',
    '.cookie-toggle-info .ct-name{font-size:13px;font-weight:700;color:#111827}',
    '.cookie-toggle-info .ct-desc{font-size:11px;color:#9CA3AF;margin-top:1px}',
    '.cookie-toggle-switch{position:relative;width:40px;height:22px;flex-shrink:0;margin-left:12px}',
    '.cookie-toggle-switch input{opacity:0;width:0;height:0}',
    '.cookie-toggle-switch .slider{position:absolute;cursor:pointer;inset:0;background:#D1D5DB;border-radius:22px;transition:.2s}',
    '.cookie-toggle-switch .slider:before{content:"";position:absolute;height:16px;width:16px;left:3px;bottom:3px;background:#fff;border-radius:50%;transition:.2s}',
    '.cookie-toggle-switch input:checked+.slider{background:#0D9488}',
    '.cookie-toggle-switch input:checked+.slider:before{transform:translateX(18px)}',
    '.cookie-toggle-switch input:disabled+.slider{opacity:.6;cursor:not-allowed}',
    '.cookie-btns{display:flex;gap:8px;flex-wrap:wrap}',
    '.cookie-btn{padding:10px 20px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;border:none;transition:all .15s;flex:1;min-width:120px;text-align:center}',
    '.cookie-btn-accept{background:#0D9488;color:#fff}',
    '.cookie-btn-accept:hover{background:#0F766E}',
    '.cookie-btn-reject{background:#F3F4F6;color:#374151}',
    '.cookie-btn-reject:hover{background:#E5E7EB}',
    '.cookie-btn-settings{background:none;color:#0D9488;border:1px solid #CCFBF1;padding:8px 14px}',
    '.cookie-btn-settings:hover{background:#F0FDFA}',
    '.cookie-details{display:none;margin-top:12px;padding-top:12px;border-top:1px solid #E5E7EB}',
    '.cookie-details.show{display:block}',
    '@media(max-width:480px){.cookie-banner{padding:20px 16px}.cookie-btns{flex-direction:column}.cookie-btn{min-width:auto}}'
  ].join('');
  document.head.appendChild(style);

  // Inject banner HTML
  var overlay = document.createElement('div');
  overlay.className = 'cookie-overlay';
  overlay.innerHTML = '<div class="cookie-banner">'
    + '<h3><span>&#127850;</span> We value your privacy</h3>'
    + '<p>We use cookies to ensure the best experience on our website. Essential cookies are required for the site to function. Analytics and advertising cookies help us improve our service and are optional.</p>'
    + '<p style="font-size:12px;margin-bottom:12px">By clicking "Accept All", you consent to the use of all cookies. Read our <a href="cookies-policy.html">Cookie Policy</a>, <a href="privacy-policy.html">Privacy Policy</a>, and <a href="gdpr.html">GDPR Rights</a> for details.</p>'
    + '<div class="cookie-btns">'
    + '<button class="cookie-btn cookie-btn-accept" id="cookieAcceptAll">Accept All</button>'
    + '<button class="cookie-btn cookie-btn-reject" id="cookieRejectAll">Essential Only</button>'
    + '<button class="cookie-btn cookie-btn-settings" id="cookieToggleSettings">Customize</button>'
    + '</div>'
    + '<div class="cookie-details" id="cookieDetails">'
    + '<div class="cookie-toggles">'
    + '<div class="cookie-toggle"><div class="cookie-toggle-info"><div class="ct-name">Essential Cookies</div><div class="ct-desc">Required for the website to function. Cannot be disabled.</div></div><label class="cookie-toggle-switch"><input type="checkbox" checked disabled><span class="slider"></span></label></div>'
    + '<div class="cookie-toggle"><div class="cookie-toggle-info"><div class="ct-name">Analytics Cookies</div><div class="ct-desc">Help us understand how visitors use our site to improve the experience.</div></div><label class="cookie-toggle-switch"><input type="checkbox" id="cookieAnalytics" checked><span class="slider"></span></label></div>'
    + '<div class="cookie-toggle"><div class="cookie-toggle-info"><div class="ct-name">Advertising Cookies</div><div class="ct-desc">Used by Google AdSense to serve relevant advertisements.</div></div><label class="cookie-toggle-switch"><input type="checkbox" id="cookieAds" checked><span class="slider"></span></label></div>'
    + '<div class="cookie-toggle"><div class="cookie-toggle-info"><div class="ct-name">Functional Cookies</div><div class="ct-desc">Remember your preferences like language and currency selection.</div></div><label class="cookie-toggle-switch"><input type="checkbox" id="cookieFunctional" checked><span class="slider"></span></label></div>'
    + '</div>'
    + '<button class="cookie-btn cookie-btn-accept" id="cookieSavePrefs" style="width:100%">Save Preferences</button>'
    + '</div></div>';
  document.body.appendChild(overlay);

  // Handlers
  document.getElementById('cookieAcceptAll').onclick = function() {
    setConsent({ essential:true, analytics:true, ads:true, functional:true });
    overlay.remove();
  };
  document.getElementById('cookieRejectAll').onclick = function() {
    setConsent({ essential:true, analytics:false, ads:false, functional:false });
    overlay.remove();
    removeNonEssential();
  };
  document.getElementById('cookieToggleSettings').onclick = function() {
    var d = document.getElementById('cookieDetails');
    d.classList.toggle('show');
    this.textContent = d.classList.contains('show') ? 'Hide Options' : 'Customize';
  };
  document.getElementById('cookieSavePrefs').onclick = function() {
    var p = {
      essential:true,
      analytics: document.getElementById('cookieAnalytics').checked,
      ads: document.getElementById('cookieAds').checked,
      functional: document.getElementById('cookieFunctional').checked
    };
    setConsent(p);
    overlay.remove();
    if (!p.analytics || !p.ads) removeNonEssential();
  };

  function removeNonEssential() {
    window['ga-disable-UA-XXXXX-Y'] = true;
    document.cookie.split(';').forEach(function(c) {
      var name = c.trim().split('=')[0];
      if (name.match(/^(_ga|_gid|__gads|__gpi|_fbp|IDE|DSID|NID)/)) {
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.' + location.hostname;
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
      }
    });
  }
})();
