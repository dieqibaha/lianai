(function () {
  'use strict';
  var config = window.GAME_WORLD;
  var world = document.getElementById('world');
  var locationName = document.getElementById('location-name');
  var dialogue = document.getElementById('dialogue');
  var ride = document.getElementById('ride-transition');
  var rideTitle = document.getElementById('ride-title');
  var currentSceneId = 'map';
  var rideTimer;
  var catTimer;
  var moveTimer;

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch];
    });
  }
  function sceneStyle(path) {
    return "background-image:linear-gradient(180deg,rgba(20,35,29,.06),rgba(20,35,29,.04)),url('" + esc(path) + "')";
  }
  function renderMap() {
    var stops = config.map.stops.map(function (stop) {
      return '<button class="map-stop" data-route="' + esc(stop.id) + '" style="left:' + stop.x + '%;top:' + stop.y + '%" aria-label="乘车前往' + esc(stop.label) + '"><span class="map-pin"><i></i></span><span class="map-stop-label"><b>' + esc(stop.label) + '</b><small>' + esc(stop.region) + '</small></span></button>';
    }).join('');
    return '<section class="scene map-scene" style="' + sceneStyle(config.map.background) + '"><div class="map-shade"></div><div class="map-route-line" aria-hidden="true"><svg viewBox="0 0 1000 600" preserveAspectRatio="none"><path d="M240 394 C330 333 365 423 452 335 S578 247 660 275 S760 276 788 186"/><path d="M240 394 C330 333 365 423 452 335 S578 247 660 275 S760 276 788 186" class="route-glow"/></svg><span class="map-train">🚆</span></div>' + stops + '<div class="map-title"><span>RAIL JOURNEY · 01</span><strong>月台之间</strong></div><div class="map-edge-label">选择站点 · 登上列车</div></section>';
  }
  function renderStation(scene) {
    var hotspots = (scene.hotspots || []).map(function (spot) {
      return '<button class="destination-hotspot hotspot-' + esc(spot.kind) + '" data-go="' + esc(spot.target) + '" style="left:' + spot.x + '%;top:' + spot.y + '%" aria-label="前往' + esc(spot.label) + '"><span class="hotspot-ring"><b>' + esc(spot.icon) + '</b></span><span class="hotspot-label">' + esc(spot.label) + '</span></button>';
    }).join('');
    return '<section class="scene station-scene" style="' + sceneStyle(scene.background) + '"><div class="scene-grade"></div><div class="world-sign"><span>' + esc(scene.region) + '</span><b>' + esc(scene.name) + '</b></div><div class="station-glint"></div>' + hotspots + '</section>';
  }
  function renderHome(scene) {
    var cat = scene.cat;
    var actor = scene.actor;
    var actions = cat.actions.map(function (item) {
      return '<button class="cat-action" data-cat-action="' + esc(item.id) + '" aria-label="让猫咪' + esc(item.label) + '"><span>' + esc(item.icon) + '</span><small>' + esc(item.label) + '</small></button>';
    }).join('');
    return '<section class="scene home-scene" id="home-scene" style="' + sceneStyle(scene.background) + '"><div class="scene-grade warm"></div><div class="cat-position" id="cat-position" style="left:' + cat.x + '%;bottom:' + cat.bottom + '%;width:' + cat.width + '%"><button class="cat-hit" data-interact="cat-menu" aria-label="点击鼠标"><img id="cat-sprite" src="' + esc(cat.sleep) + '" alt="鼠标在红色猫窝里的银灰虎斑猫"></button><span class="cat-name-tag">' + esc(cat.name) + '</span><div class="cat-actions" id="cat-actions" hidden>' + actions + '</div><div class="cat-speech" id="cat-speech" aria-live="polite"></div></div><img class="actor actor-lianai" id="moving-actor" src="' + esc(actor.image) + '" alt="怜爱" style="left:' + actor.x + '%;bottom:' + actor.bottom + '%"><span class="actor-name" id="actor-name" style="left:' + actor.x + '%;bottom:' + actor.bottom + '%">' + esc(actor.name) + '</span><div class="move-cursor" id="move-cursor" hidden>✦</div></section>';
  }
  function renderSchool(scene) {
    var actor = scene.actor;
    return '<section class="scene school-scene" id="school-scene" style="' + sceneStyle(scene.background) + '"><div class="scene-grade"></div><button class="actor-target" data-interact="talk" aria-label="和男主说话"><img class="actor actor-hero" src="' + esc(actor.image) + '" alt="男主"><span class="actor-name actor-name-hero">' + esc(actor.name) + '</span><span class="talk-prompt">···</span></button></section>';
  }
  function renderScene(id) {
    if (id === 'map') return renderMap();
    var scene = config.scenes[id];
    if (!scene) return renderMap();
    if (scene.type === 'station') return renderStation(scene);
    if (scene.type === 'home') return renderHome(scene);
    if (scene.type === 'school') return renderSchool(scene);
    return '<section class="scene" style="' + sceneStyle(scene.background) + '"></section>';
  }
  function openScene(id) {
    currentSceneId = id;
    world.innerHTML = renderScene(id);
    document.getElementById('game').classList.toggle('at-map', id === 'map');
    var scene = config.scenes[id];
    locationName.textContent = id === 'map' ? config.map.name : (scene.name === '学校' ? '学校' : scene.name + ' · ' + scene.region);
    dialogue.hidden = true;
  }
  function showDialogue(speaker, text, avatar) {
    document.getElementById('dialogue-speaker').textContent = speaker;
    document.getElementById('dialogue-line').textContent = text;
    var face = document.getElementById('dialogue-avatar');
    face.innerHTML = avatar ? '<img src="' + esc(avatar) + '" alt="">' : '✦';
    dialogue.hidden = false;
  }
  function travelTo(id) {
    var scene = id === 'map' ? { name: config.map.name } : config.scenes[id];
    if (!scene) return;
    window.clearTimeout(rideTimer);
    rideTitle.textContent = '前往　' + scene.name;
    ride.classList.add('depart');
    rideTimer = window.setTimeout(function () {
      ride.classList.remove('depart');
      openScene(id);
    }, 1200);
  }
  function catAction(action) {
    var cat = config.scenes.home.cat;
    var sprite = document.getElementById('cat-sprite');
    var position = document.getElementById('cat-position');
    var speech = document.getElementById('cat-speech');
    var menu = document.getElementById('cat-actions');
    var definition = cat.actions.filter(function (item) { return item.id === action; })[0];
    if (!sprite) return;
    window.clearTimeout(catTimer);
    menu.hidden = true;
    sprite.className = '';
    speech.textContent = definition ? definition.line : '';
    speech.classList.add('visible');
    if (action === 'roll') {
      sprite.src = cat.sleep;
      sprite.alt = '银灰虎斑猫在红色猫窝里打滚';
      sprite.classList.add('cat-roll');
    } else if (action === 'meow') {
      sprite.src = cat.awake;
      sprite.alt = '银灰虎斑猫坐起，睁着金黄色眼睛喵叫';
      sprite.classList.add('cat-meow');
      playMeow();
    } else {
      sprite.src = cat.awake;
      sprite.alt = '银灰虎斑猫从猫窝里起来转圈';
      sprite.classList.add('cat-spin');
    }
    catTimer = window.setTimeout(function () {
      if (!document.getElementById('cat-sprite')) return;
      sprite.className = '';
      sprite.src = cat.sleep;
      sprite.alt = '鼠标在红色猫窝里的银灰虎斑猫';
      speech.classList.remove('visible');
      position.classList.remove('cat-active');
    }, 1900);
  }
  function playMeow() {
    var Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return;
    try {
      var ctx = new Audio(); var osc = ctx.createOscillator(); var gain = ctx.createGain();
      osc.type = 'triangle'; osc.frequency.setValueAtTime(620, ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(390, ctx.currentTime + .32);
      gain.gain.setValueAtTime(.001, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(.045, ctx.currentTime + .06); gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .38);
      osc.connect(gain); gain.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + .4); osc.onended = function () { ctx.close(); };
    } catch (e) {}
  }
  function moveActor(event) {
    var scene = document.getElementById('home-scene');
    var actor = document.getElementById('moving-actor');
    var label = document.getElementById('actor-name');
    if (!scene || !actor || !label) return;
    if (event.target.closest('.hud,.cat-position,.dialogue,.interact-hint')) return;
    var rect = scene.getBoundingClientRect();
    var x = Math.max(8, Math.min(92, (event.clientX - rect.left) / rect.width * 100));
    var bottom = Math.max(6, Math.min(48, (rect.bottom - event.clientY) / rect.height * 100 - 5));
    actor.style.left = x + '%'; actor.style.bottom = bottom + '%';
    label.style.left = x + '%'; label.style.bottom = (bottom - 3) + '%';
    actor.classList.remove('walking'); void actor.offsetWidth; actor.classList.add('walking');
    var marker = document.getElementById('move-cursor');
    if (marker) {
      marker.style.left = x + '%'; marker.style.top = ((event.clientY - rect.top) / rect.height * 100) + '%';
      marker.hidden = false; marker.classList.remove('ping'); void marker.offsetWidth; marker.classList.add('ping');
      window.clearTimeout(moveTimer); moveTimer = window.setTimeout(function () { marker.hidden = true; }, 750);
    }
  }
  function interact(action) {
    if (action === 'map') { openScene('map'); return; }
    if (action === 'close-dialogue') { dialogue.hidden = true; return; }
    if (action === 'cat-menu') {
      var menu = document.getElementById('cat-actions');
      var position = document.getElementById('cat-position');
      if (menu) { menu.hidden = !menu.hidden; position.classList.toggle('cat-active', !menu.hidden); }
      return;
    }
    if (action === 'talk') {
      var line = config.scenes.school.dialogue.hello;
      showDialogue('男主', line, config.scenes.school.actor.image);
      return;
    }
  }
  document.addEventListener('click', function (event) {
    var route = event.target.closest('[data-route]');
    if (route) { travelTo(route.getAttribute('data-route')); return; }
    var go = event.target.closest('[data-go]');
    if (go) { openScene(go.getAttribute('data-go')); return; }
    var catActionButton = event.target.closest('[data-cat-action]');
    if (catActionButton) { catAction(catActionButton.getAttribute('data-cat-action')); return; }
    var button = event.target.closest('[data-interact]');
    if (button) { interact(button.getAttribute('data-interact')); return; }
    var talkChoice = event.target.closest('[data-talk-line]');
    if (talkChoice) showDialogue('男主', talkChoice.getAttribute('data-talk-line'), config.scenes.school.actor.image);
  });
  document.addEventListener('click', function (event) {
    if (currentSceneId === 'home') moveActor(event);
  });
  openScene('map');
}());
