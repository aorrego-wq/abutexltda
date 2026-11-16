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
  /* Catálogo Challatin: envía los datos por correo (FormSubmit) a aorrego@ con copia a gerencia@ y habilita la descarga */
  var cf=document.getElementById('catalogForm');
  if(cf){
    cf.addEventListener('submit',function(e){
      e.preventDefault();
      var ok=true;
      [].forEach.call(cf.querySelectorAll('[required]'),function(el){
        var bad=!el.value.trim()||(el.type==='email'&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.value.trim()));
        el.style.borderColor=bad?'#e0322b':''; if(bad&&ok){el.focus();ok=false}
      });
      if(!ok) return;
      var btn=cf.querySelector('button[type=submit]'); btn.disabled=true; btn.textContent='Enviando...';
      var data={_subject:'Descarga catálogo Challatin: '+cf.empresa.value.trim(),_cc:'gerencia@challatin.cl',_template:'table',_captcha:'false',_replyto:cf.email.value.trim(),_honey:cf._honey.value};
      ['nombre','empresa','email','telefono','tipo','comuna'].forEach(function(k){data[L[k]||k]=cf[k].value.trim()});
      data['Acepta recibir publicidad']=cf.consentimiento.checked?'Sí':'No';
      data['Fecha de envío']=new Date().toLocaleString('es-CL');
      function done(){
        document.getElementById('catalogFields').hidden=true;
        var box=document.getElementById('catalogOk'); box.hidden=false;
        track('catalogo-formulario');
        box.querySelector('a').click();
      }
      fetch('https://formsubmit.co/ajax/aorrego@challatin.cl',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)})
        .then(done,done);
    });
  }
  /* Botón flotante de WhatsApp: visible al bajar */
  var onScrollWa=function(){document.body.classList.toggle('scrolled',window.scrollY>500)};
  onScrollWa(); window.addEventListener('scroll',onScrollWa,{passive:true});

  /* Filtro de categorías del catálogo de hotelería */
  var chipsF=document.querySelectorAll('.chip[data-f]');
  [].forEach.call(chipsF,function(c){
    c.addEventListener('click',function(){
      [].forEach.call(chipsF,function(x){x.classList.toggle('on',x===c)});
      [].forEach.call(document.querySelectorAll('.cat[data-cat]'),function(k){k.hidden=!(c.dataset.f==='all'||k.dataset.cat===c.dataset.f)});
    });
  });
})();
