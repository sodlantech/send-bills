// Site Protection — Send-Bills.com
// Anti-copy, anti-scrape, anti-AI protection
// Compatible with Firebase Auth, Stripe, PayPal

(function(){
  'use strict';

  // ===== 1. DISABLE RIGHT-CLICK =====
  document.addEventListener('contextmenu', function(e){
    e.preventDefault(); return false;
  });

  // ===== 2. DISABLE TEXT SELECTION (except form inputs) =====
  document.addEventListener('selectstart', function(e){
    var tag = e.target.tagName;
    if(tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT') return;
    e.preventDefault(); return false;
  });

  // ===== 3. DISABLE DRAG =====
  document.addEventListener('dragstart', function(e){ e.preventDefault(); return false; });

  // ===== 4. DISABLE KEYBOARD SHORTCUTS =====
  document.addEventListener('keydown', function(e){
    var k = (e.key||'').toLowerCase();
    if(e.ctrlKey && k==='u'){ e.preventDefault(); return false; }
    if(e.ctrlKey && k==='s'){ e.preventDefault(); return false; }
    if(e.ctrlKey && e.shiftKey && (k==='i'||k==='j'||k==='c'||k==='k')){ e.preventDefault(); return false; }
    if(k==='f12'){ e.preventDefault(); return false; }
    if(e.ctrlKey && k==='a'){
      if(e.target.tagName!=='INPUT'&&e.target.tagName!=='TEXTAREA'){ e.preventDefault(); return false; }
    }
    if(e.ctrlKey && k==='c'){
      if(e.target.tagName!=='INPUT'&&e.target.tagName!=='TEXTAREA'){ e.preventDefault(); return false; }
    }
    if(e.ctrlKey && k==='p' && !document.body.classList.contains('print-allowed')){ e.preventDefault(); return false; }
  });

  // ===== 5. CLIPBOARD PROTECTION =====
  document.addEventListener('copy', function(e){
    if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA') return;
    e.preventDefault();
    if(e.clipboardData){
      e.clipboardData.setData('text/plain','Content protected by Send-Bills.com. Visit https://send-bills.com');
    }
    return false;
  });

  document.addEventListener('cut', function(e){
    if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA') return;
    e.preventDefault(); return false;
  });

  // ===== 6. DISABLE PRINT (unless Print button clicked) =====
  window.addEventListener('beforeprint', function(){
    if(!document.body.classList.contains('print-allowed')){
      document.body.style.display='none';
    }
  });
  window.addEventListener('afterprint', function(){
    document.body.style.display='';
  });

  // ===== 7. DEVTOOLS DETECTION (desktop only — mobile triggers false positives) =====
  var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  var devtoolsOpen = false;
  function checkDevTools(){
    var w = window.outerWidth - window.innerWidth > 160;
    var h = window.outerHeight - window.innerHeight > 160;
    if(w || h){
      if(!devtoolsOpen){
        devtoolsOpen = true;
        document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:Inter,sans-serif;text-align:center;background:#F8FAFB;padding:40px"><div><div style="font-size:48px;margin-bottom:16px">&#128274;</div><h1 style="font-size:24px;color:#111827;margin-bottom:8px">Access Restricted</h1><p style="color:#6B7280;font-size:14px;max-width:400px;line-height:1.6">Developer tools are not permitted on this website. Please close them to continue using Send-Bills.com</p></div></div>';
      }
    } else if(devtoolsOpen){
      devtoolsOpen = false;
      location.reload();
    }
  }
  if(!isMobile){ setInterval(checkDevTools, 1000); }

  // ===== 8. ANTI-IFRAME / CLICKJACKING =====
  if(window.top !== window.self){
    try { window.top.location = window.self.location; } catch(e){
      document.body.innerHTML = '<p style="padding:40px;text-align:center;font-family:sans-serif">This content cannot be displayed in an iframe.</p>';
    }
  }

  // ===== 9. HONEYPOT TRAPS =====
  var traps = ['bot-trap','wp-admin','.env','backup.zip'];
  traps.forEach(function(path){
    var a = document.createElement('a');
    a.href = '/' + path;
    a.style.cssText = 'position:absolute;left:-9999px;top:-9999px;opacity:0;width:1px;height:1px;overflow:hidden;pointer-events:none';
    a.setAttribute('aria-hidden','true');
    a.tabIndex = -1;
    a.textContent = 'Access ' + path;
    if(document.body) document.body.appendChild(a);
  });

  // ===== 10. INVISIBLE WATERMARKING =====
  var wm = '\u200B\u200C\u200D\uFEFF';
  document.querySelectorAll('.hp-heading h2, .hero-banner h2, .feature-card h3').forEach(function(el){
    if(el.textContent) el.textContent = el.textContent + wm;
  });

  // ===== 11. EMAIL OBFUSCATION =====
  document.querySelectorAll('a[href^="mailto:"]').forEach(function(a){
    var email = a.getAttribute('href').replace('mailto:','');
    a.setAttribute('data-email', btoa(email));
    a.removeAttribute('href');
    a.style.cursor = 'pointer';
    a.addEventListener('click', function(){
      window.location.href = 'mailto:' + atob(this.getAttribute('data-email'));
    });
  });

  // ===== 12. CLIENT-SIDE RATE LIMITING =====
  try {
    var loads = parseInt(sessionStorage.getItem('sb_loads')||'0') + 1;
    sessionStorage.setItem('sb_loads', loads);
    if(loads > 100){
      document.body.innerHTML = '<p style="padding:40px;text-align:center;font-family:sans-serif;color:#999">Too many requests. Please try again later.</p>';
    }
  } catch(e){}

})();
