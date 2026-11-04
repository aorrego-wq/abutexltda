(function(){
  var WA='56994197049';
  var btn=document.getElementById('menuBtn'),nav=document.getElementById('nav');
  if(btn){
    btn.addEventListener('click',function(){var o=nav.classList.toggle('open');btn.setAttribute('aria-expanded',o)});
    nav.addEventListener('click',function(e){if(e.target.tagName==='A'){nav.classList.remove('open');btn.setAttribute('aria-expanded','false')}});
  }
  var y=document.getElementById('year'); if(y) y.textContent=new Date().getFullYear();

  /* Medición de conversiones: si instalas Google Analytics 4 o Meta Pixel,
     cada clic en un elemento con data-cta se registra como lead/contacto. */
  function track(name){
    if(window.gtag) gtag('event','generate_lead',{cta:name});
    if(window.fbq) fbq('track','Contact',{cta:name});
  }
  document.addEventListener('click',function(e){
    var a=e.target.closest('a[data-cta]'); if(a) track(a.getAttribute('data-cta'));
  });

  /* Formularios: arman el mensaje y lo abren en WhatsApp */
  var L={nombre:'Nombre',empresa:'Empresa',telefono:'Teléfono',email:'Correo',comuna:'Comuna / ciudad',linea:'Línea',tipo:'Tipo de cliente',cantidad:'Cantidad',producto:'Productos',personalizacion:'Personalización',mensaje:'Comentarios'};
  [].forEach.call(document.querySelectorAll('form.wa-form'),function(f){
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var req=f.querySelectorAll('[required]'),ok=true;
      [].forEach.call(req,function(el){ if(!el.value.trim()){ el.style.borderColor='#e0322b'; if(ok) el.focus(); ok=false } else el.style.borderColor=''; });
      if(!ok) return;
      var data={},order=[];
      [].forEach.call(f.elements,function(el){
        if(!el.name||el.type==='submit') return;
        if((el.type==='checkbox'||el.type==='radio')&&!el.checked) return;
        var v=(el.value||'').trim(); if(!v) return;
        if(!(el.name in data)){data[el.name]=[];order.push(el.name)}
        data[el.name].push(v);
      });
      var t=(f.getAttribute('data-intro')||'Hola Abutex, quiero una cotización.')+'\n\n';
      order.forEach(function(k){ t+=(L[k]||k)+': '+data[k].join(', ')+'\n' });
      track(f.getAttribute('data-cta')||'form');
      window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(t),'_blank','noopener');
    });
  });
})();
