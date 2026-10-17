// =====================================================
// main.js — домики, «ваш день», калькулятор брони, анимации
// =====================================================

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const rub = (n) => n.toLocaleString('ru-RU') + ' ₽';

// ---------- Данные домиков ----------
const HOUSES = [
  { id: 'ridge', name: 'Гребень', tag: 'A-frame', guests: 2, area: 28, price: 9800, imgs: ['img/h-aframe.jpg', 'img/in-bed.jpg', 'img/in-view.jpg'],
    text: 'Треугольный домик на самом краю склона. Кровать стоит прямо у стеклянной стены, так что рассвет вы встретите не вставая.',
    list: ['кровать king size', 'панорамное окно 6 м', 'тёплый пол', 'душ и санузел', 'кофемашина', 'терраса с видом'] },
  { id: 'light', name: 'Огонёк', tag: 'Модуль', guests: 2, area: 24, price: 8900, imgs: ['img/h-cube.jpg', 'img/in-view.jpg', 'img/stars.jpg'],
    text: 'Компактный модуль с круглым окном. Ночью светится в лесу как фонарь, а изнутри видно только деревья и небо.',
    list: ['двуспальная кровать', 'круглое окно в лес', 'кондиционер', 'душ и санузел', 'мини-кухня', 'Wi-Fi'] },
  { id: 'cedar', name: 'Кедр', tag: 'Шале', guests: 4, area: 58, price: 15600, imgs: ['img/h-night.jpg', 'img/lights.jpg', 'img/in-bed.jpg'],
    text: 'Большое шале для семьи или компании друзей. Две спальни, гостиная с камином и собственная баня на участке.',
    list: ['2 спальни', 'камин', 'своя баня', 'кухня-гостиная', 'можно с собакой', 'мангал'] },
  { id: 'dome', name: 'Купол', tag: 'Глэмп-шатёр', guests: 2, area: 30, price: 7900, imgs: ['img/h-dome.jpg', 'img/stars.jpg', 'img/valley.jpg'],
    text: 'Геокупол с прозрачной стеной, обращённой к горам. Внутри печка, мягкий ковёр и телескоп для звёзд.',
    list: ['кровать queen size', 'печь-буржуйка', 'телескоп', 'душ в общем доме', 'терраса', 'гамак'] },
  { id: 'lake', name: 'Берег', tag: 'A-frame', guests: 4, area: 46, price: 13400, imgs: ['img/h-lake.jpg', 'img/lake.jpg', 'img/lights.jpg'],
    text: 'Домик у горного озера, в стороне от остальных. Второй ярус для детей, а с террасы можно ловить рыбу.',
    list: ['2 яруса', 'вид на озеро', 'сап-борд', 'кухня', 'чан на террасе', 'детская кровать'] },
  { id: 'sauna', name: 'Пар', tag: 'Модуль', guests: 2, area: 26, price: 10500, imgs: ['img/sauna-cube.jpg', 'img/sauna.jpg', 'img/tub.jpg'],
    text: 'Домик со встроенной сауной. Из парилки выход сразу на террасу с купелью — для тех, кто едет за банным отдыхом.',
    list: ['своя сауна', 'купель', 'двуспальная кровать', 'душ и санузел', 'травяной бар', 'халаты и тапочки'] }
];

// ---------- Шапка и меню ----------
const header = $('#header');
const burger = $('#burger');
const nav = $('#nav');
addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 40), { passive: true });
burger.addEventListener('click', () => { burger.classList.toggle('open'); nav.classList.toggle('open'); });
$$('#nav a').forEach((a) => a.addEventListener('click', () => { burger.classList.remove('open'); nav.classList.remove('open'); }));

// ---------- Параллакс ----------
const heroBg = $('.hero__bg');
const word = $('.banner__word');
const banner = $('.banner');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
function parallax() {
  if (scrollY < innerHeight) heroBg.style.transform = `translateY(${scrollY * 0.25}px)`;
  const r = banner.getBoundingClientRect();
  if (r.top < innerHeight && r.bottom > 0) word.style.transform = `translateX(${(r.top - innerHeight / 2) * 0.25}px)`;
}
if (!reduce) addEventListener('scroll', () => requestAnimationFrame(parallax), { passive: true });

// ---------- Появление и счётчики ----------
const io = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in');
  if (e.target.dataset.count) countUp(e.target);
  io.unobserve(e.target);
}), { threshold: 0.3 });
$$('.reveal, [data-count]').forEach((el) => io.observe(el));

function countUp(el) {
  const end = parseFloat(el.dataset.count);
  const dec = +(el.dataset.dec || 0);
  if (reduce) { el.textContent = end.toFixed(dec).replace('.', ','); return; }
  const t0 = performance.now();
  (function tick(t) {
    const k = Math.min((t - t0) / 1400, 1);
    const v = end * (1 - Math.pow(1 - k, 3));
    el.textContent = v.toFixed(dec).replace('.', ',');
    if (k < 1) requestAnimationFrame(tick);
  })(t0);
}

// ---------- Преимущества: раскрытие карточки ----------
$$('.perk').forEach((p) => {
  const open = () => $$('.perk').forEach((x) => x.classList.toggle('active', x === p));
  p.addEventListener('click', open);
  p.addEventListener('mouseenter', () => { if (matchMedia('(hover: hover)').matches) open(); });
});

// ---------- Окна ----------
function openModal(m) { m.classList.add('open'); m.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; }
function closeModal(m) { m.classList.remove('open'); m.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
$$('.modal').forEach((m) => m.addEventListener('click', (e) => { if (e.target === m || e.target.closest('[data-close]')) closeModal(m); }));
addEventListener('keydown', (e) => { if (e.key === 'Escape') $$('.modal.open').forEach(closeModal); });

// ---------- Каталог домиков ----------
const grid = $('#house-grid');
function renderHouses(filter) {
  grid.innerHTML = '';
  HOUSES.filter((h) => filter === 'all' || String(h.guests) === filter).forEach((h, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'house';
    b.style.animationDelay = i * 0.07 + 's';
    b.innerHTML = `<div class="house__img"><img src="${h.imgs[0]}" alt="Домик ${h.name}" loading="lazy"><span class="house__tag glass">${h.tag}</span></div>
      <div class="house__body"><div class="house__top"><h3>${h.name}</h3><span class="house__price">${rub(h.price)} <small>/ ночь</small></span></div>
      <div class="house__meta"><span>до ${h.guests} гостей</span><span>${h.area} м²</span></div><span class="house__more">Подробнее →</span></div>`;
    b.addEventListener('click', () => openHouse(h));
    grid.append(b);
  });
}
$$('#house-tabs .tab').forEach((t) => t.addEventListener('click', () => {
  $$('#house-tabs .tab').forEach((x) => x.classList.toggle('active', x === t));
  renderHouses(t.dataset.filter);
}));
renderHouses('all');

const houseModal = $('#house-modal');
function openHouse(h) {
  $('#hm').innerHTML = `<div class="hm__gallery"><img id="hm-img" src="${h.imgs[0]}" alt="Домик ${h.name}">
      <div class="hm__thumbs">${h.imgs.map((src, i) => `<button type="button" class="${i ? '' : 'active'}" data-src="${src}"><img src="${src}" alt=""></button>`).join('')}</div></div>
    <div class="hm__info"><p class="eyebrow">${h.tag} · ${h.area} м² · до ${h.guests} гостей</p><h3>${h.name}</h3><p class="muted">${h.text}</p>
      <ul class="hm__list">${h.list.map((x) => `<li>${x}</li>`).join('')}</ul>
      <div class="hm__price"><div><b>${rub(h.price)}</b> <small>за ночь</small></div><button class="btn btn--light" type="button" id="hm-book">Рассчитать отдых <span>→</span></button></div></div>`;
  $$('.hm__thumbs button').forEach((t) => t.addEventListener('click', () => {
    $('#hm-img').src = t.dataset.src;
    $$('.hm__thumbs button').forEach((x) => x.classList.toggle('active', x === t));
  }));
  $('#hm-book').addEventListener('click', () => {
    closeModal(houseModal);
    calc.house = h.id;
    renderHouseChips();
    update();
    $('#book').scrollIntoView({ behavior: 'smooth' });
  });
  openModal(houseModal);
}

// ---------- Ваш день ----------
const stepImg = $('#step-img');
$$('#steps li').forEach((li) => li.addEventListener('click', () => {
  if (li.classList.contains('active')) return;
  $$('#steps li').forEach((x) => x.classList.toggle('active', x === li));
  stepImg.classList.add('swap');
  setTimeout(() => {
    stepImg.src = li.dataset.img;
    $('#step-time').textContent = li.dataset.time;
    $('#step-text').textContent = li.dataset.text;
    stepImg.classList.remove('swap');
  }, 250);
}));

// ---------- Калькулятор ----------
const EXTRAS = { tub: { price: 3000, per: 'night' }, sauna: { price: 2500, per: 'night' }, dinner: { price: 1200, per: 'guest' }, horse: { price: 2000, per: 'guest' } };
const calc = { house: 'ridge', nights: 2, guests: 2 };
const houseById = (id) => HOUSES.find((h) => h.id === id);

function renderHouseChips() {
  const box = $('#calc-house');
  box.innerHTML = '';
  HOUSES.forEach((h) => {
    const c = document.createElement('button');
    c.type = 'button';
    c.className = 'chip' + (h.id === calc.house ? ' active' : '');
    c.innerHTML = `${h.name}<small>${(h.price / 1000).toLocaleString('ru-RU')}к</small>`;
    c.addEventListener('click', () => { calc.house = h.id; renderHouseChips(); update(); });
    box.append(c);
  });
}

$$('[data-step]').forEach((b) => b.addEventListener('click', () => {
  const key = b.dataset.step;
  const max = key === 'nights' ? 14 : houseById(calc.house).guests;
  calc[key] = Math.min(max, Math.max(1, calc[key] + +b.dataset.d));
  update();
}));
$$('#extras input').forEach((i) => i.addEventListener('change', update));

// Дата заезда: не раньше завтра
const dateInput = $('#calc-date');
const tomorrow = new Date(Date.now() + 864e5);
dateInput.min = tomorrow.toISOString().slice(0, 10);
dateInput.addEventListener('change', () => { dateInput.classList.remove('err'); $('#calc-error').textContent = ''; update(); });

function update() {
  const h = houseById(calc.house);
  calc.guests = Math.min(calc.guests, h.guests);
  $('#nights').textContent = calc.nights;
  $('#guests').textContent = calc.guests;
  let sum = h.price * calc.nights;
  $$('#extras input:checked').forEach((i) => {
    const e = EXTRAS[i.value];
    sum += e.price * (e.per === 'night' ? calc.nights : calc.guests);
  });
  $('#total').textContent = rub(sum);
  const n = calc.nights;
  const word = n % 10 === 1 && n % 100 !== 11 ? 'ночь' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 'ночи' : 'ночей';
  $('#total-note').textContent = `«${h.name}», ${n} ${word}, гостей: ${calc.guests}`;
  calc.sum = sum;
}
renderHouseChips();
update();

const doneModal = $('#done-modal');
$('#calc').addEventListener('submit', (e) => {
  e.preventDefault();
  if (!dateInput.value) { dateInput.classList.add('err'); $('#calc-error').textContent = 'Выберите дату заезда'; return; }
  const d = new Date(dateInput.value).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  $('#done-summary').textContent = `Домик «${houseById(calc.house).name}» с ${d}, ${$('#total-note').textContent.split(', ').slice(1).join(', ')}. Итого ${rub(calc.sum)}.`;
  doneModal.classList.remove('sent');
  openModal(doneModal);
});

['#c-name', '#c-phone'].forEach((s) => $(s).addEventListener('input', () => { $(s).classList.remove('err'); $('#c-error').textContent = ''; }));
$('#contact-form').addEventListener('submit', (e) => {
  e.preventDefault();
  if ($('#c-name').value.trim().length < 2) { $('#c-name').classList.add('err'); $('#c-error').textContent = 'Напишите, как к вам обращаться'; return; }
  if ($('#c-phone').value.replace(/\D/g, '').length < 10) { $('#c-phone').classList.add('err'); $('#c-error').textContent = 'Проверьте номер телефона'; return; }
  doneModal.classList.add('sent');
  $('#contact-form').reset();
});
