/* PetShop Amigos do Simon · prévia Patron */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var WA = 'https://wa.me/5511959654713?text=';
  var ABRE = 'Olá! Vi o site do Amigos do Simon e ';

  function linkWa(texto) { return WA + encodeURIComponent(texto); }

  /* ---------- Mensagens prontas por serviço ---------- */
  function mensagem(tipo, pet) {
    var doPet = pet ? ' para ' + pet : '';
    switch (tipo) {
      case 'banho': return ABRE + 'quero agendar banho e tosa' + doPet + '.';
      case 'creche': return ABRE + 'quero saber sobre a creche' + doPet + '.';
      case 'hotel': return ABRE + 'quero saber sobre o hotel' + doPet + '.';
      case 'loja': return ABRE + 'quero saber se vocês têm um produto.';
      default: return ABRE + 'quero agendar um horário.';
    }
  }

  /* ---------- Um dia aqui ---------- */
  /* CONFIRMAR: rotina real. Textos genéricos e sem horário, a pedido. */
  var ICONES = {
    chegada: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 42V8h18v34M8 42h32"/><circle cx="25" cy="25" r="1.500" fill="currentColor"/><path d="M36 14v-4M41 16l3-3M42 22h4"/></svg>',
    brincar: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><circle cx="24" cy="24" r="15"/><path d="M11 17q13 9 26 0M11 31q13-9 26 0"/></svg>',
    descanso: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 34c0-6 6-9 18-9s18 3 18 9v4H6z"/><path d="M28 8h8l-8 9h8M38 18h5l-5 6h5"/></svg>',
    video: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="13" y="5" width="22" height="38" rx="5"/><path d="M21 18v12l10-6z" fill="currentColor"/></svg>',
    retirada: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M24 40C12 31 7 25 7 18a9 9 0 0 1 17-4 9 9 0 0 1 17 4c0 7-5 13-17 22z"/></svg>'
  };

  var ROTEIROS = {
    creche: [
      { t: 'Chegada', i: 'chegada', x: 'Você traz {pet} no horário combinado e a equipe recebe na porta.' },
      { t: 'Brincadeira', i: 'brincar', x: 'Hora de gastar energia e fazer amigos, sempre com a equipe por perto.' },
      { t: 'Descanso', i: 'descanso', x: 'Uma pausa tranquila para {pet} recarregar a bateria.' },
      { t: 'Vídeo para você', i: 'video', x: 'Chega um vídeo de {pet} para você acompanhar de longe. É o que os clientes mais comentam nas avaliações.' },
      { t: 'Retirada', i: 'retirada', x: 'Você busca {pet} no horário combinado. Pronto para repetir?' }
    ],
    hotel: [
      { t: 'Chegada', i: 'chegada', x: 'Você traz {pet} no dia combinado e a equipe recebe para a hospedagem.' },
      { t: 'Brincadeira', i: 'brincar', x: 'Durante o dia, tempo para brincar e se movimentar com a equipe por perto.' },
      { t: 'Descanso', i: 'descanso', x: 'Hora de sossegar e dormir bem até o dia seguinte.' },
      { t: 'Vídeo para você', i: 'video', x: 'Enquanto você está fora, chegam vídeos de {pet} para matar a saudade.' },
      { t: 'Retirada', i: 'retirada', x: 'Na volta, é só buscar {pet} no horário combinado.' }
    ]
  };

  var palco = document.querySelector('.dia__palco');
  if (palco) {
    var cena = palco.querySelector('.dia__cena');
    var elIcone = document.getElementById('dia-icone');
    var elConta = document.getElementById('dia-conta');
    var elTitulo = document.getElementById('dia-titulo');
    var elTexto = document.getElementById('dia-texto');
    var pontos = Array.prototype.slice.call(palco.querySelectorAll('.trilha__ponto'));
    var btVoltar = document.getElementById('dia-voltar');
    var btProxima = document.getElementById('dia-proxima');
    var btReservar = document.getElementById('dia-reservar');
    var campoPet = document.getElementById('nome-pet');
    var opcoes = Array.prototype.slice.call(document.querySelectorAll('.alternar__op'));
    var modo = 'creche';
    var etapa = 0;

    function nomePet() { return campoPet.value.replace(/[<>]/g, '').trim(); }

    function pintar(animar) {
      var passos = ROTEIROS[modo];
      var p = passos[etapa];
      var pet = nomePet();
      palco.setAttribute('data-etapa', etapa);
      palco.style.setProperty('--p', etapa / (passos.length - 1));
      elIcone.innerHTML = ICONES[p.i];
      elConta.textContent = 'Etapa ' + (etapa + 1) + ' de ' + passos.length + ' · ' + (modo === 'creche' ? 'creche' : 'hotel');
      elTitulo.textContent = p.t;
      elTexto.textContent = p.x.replace(/\{pet\}/g, pet || 'seu pet');

      pontos.forEach(function (b, i) {
        b.classList.toggle('is-ativo', i === etapa);
        b.classList.toggle('is-feito', i < etapa);
        if (i === etapa) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
      });

      var fim = etapa === passos.length - 1;
      btVoltar.disabled = etapa === 0;
      btProxima.hidden = fim;
      btReservar.hidden = !fim;
      btReservar.textContent = 'Reservar ' + (modo === 'creche' ? 'creche' : 'hotel') + (pet ? ' para ' + pet : '');
      btReservar.href = linkWa(mensagem(modo, pet));
      btReservar.setAttribute('data-wa', modo);

      if (animar) {
        cena.classList.remove('is-trocando');
        void cena.offsetWidth; // reinicia a animação
        cena.classList.add('is-trocando');
      }
    }

    function irPara(n) {
      etapa = Math.max(0, Math.min(ROTEIROS[modo].length - 1, n));
      pintar(true);
    }

    pontos.forEach(function (b) {
      b.addEventListener('click', function () { irPara(Number(b.getAttribute('data-i'))); });
    });
    btProxima.addEventListener('click', function () { irPara(etapa + 1); });
    btVoltar.addEventListener('click', function () { irPara(etapa - 1); });

    opcoes.forEach(function (o) {
      o.addEventListener('click', function () {
        modo = o.getAttribute('data-modo');
        opcoes.forEach(function (x) {
          var ativo = x === o;
          x.classList.toggle('is-ativo', ativo);
          x.setAttribute('aria-pressed', ativo ? 'true' : 'false');
        });
        etapa = 0;
        pintar(true);
      });
    });

    campoPet.addEventListener('input', function () { pintar(false); atualizarLinks(); });

    pintar(false);
  }

  /* ---------- Links de WhatsApp levam o nome do pet, se informado ---------- */
  function atualizarLinks() {
    var campo = document.getElementById('nome-pet');
    var pet = campo ? campo.value.replace(/[<>]/g, '').trim() : '';
    document.querySelectorAll('a[data-wa]').forEach(function (a) {
      if (a.id === 'dia-reservar') return;
      a.href = linkWa(mensagem(a.getAttribute('data-wa'), pet));
    });
  }

  /* ---------- Entrada das seções ---------- */
  var alvos = document.querySelectorAll('.revelar');
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-visivel'); obs.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    alvos.forEach(function (el) { obs.observe(el); });
  } else {
    alvos.forEach(function (el) { el.classList.add('is-visivel'); });
  }

  /* ---------- Destaca o dia de hoje no horário ---------- */
  var linha = document.querySelector('#horario tr[data-dia="' + new Date().getDay() + '"]');
  if (linha) linha.classList.add('is-hoje');

  /* ---------- Botão flutuante some enquanto o botão principal do topo está visível ---------- */
  var flutuante = document.querySelector('.flutuante');
  /* ...e também sobre os botões da linha do tempo e da chamada final, para não cobrir nada */
  var vigiados = document.querySelectorAll('.heroi__acoes .btn--principal, .dia__acoes, .final__acoes');
  if (flutuante && vigiados.length && 'IntersectionObserver' in window) {
    var aVista = 0;
    var vigia = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting && !e.target._visto) { e.target._visto = true; aVista++; }
        else if (!e.isIntersecting && e.target._visto) { e.target._visto = false; aVista--; }
      });
      flutuante.classList.toggle('is-oculto', aVista > 0);
    });
    vigiados.forEach(function (el) { vigia.observe(el); });
  }
})();
