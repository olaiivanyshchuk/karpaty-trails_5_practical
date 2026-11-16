'use strict';

/* ---------- Глобальний стан: таймер сесії ---------- */
const timerEl = document.getElementById('session-timer');
const startedAt = Date.now();

function formatTime(totalSeconds) {
  const pad = (n) => String(n).padStart(2, '0');
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  return `${pad(h)}:${pad(m)}:${pad(totalSeconds % 60)}`;
}

window.setInterval(() => {
  timerEl.textContent = formatTime(Math.floor((Date.now() - startedAt) / 1000));
}, 1000);

/* ---------- Хеш-маршрутизація (підхід А) ---------- */
const views = Array.from(document.querySelectorAll('.view'));
const links = Array.from(document.querySelectorAll('.nav__link'));
const DEFAULT_ROUTE = 'catalog';

function currentRoute() {
  const id = window.location.hash.slice(1);
  return views.some((v) => v.id === id) ? id : DEFAULT_ROUTE;
}

function render() {
  const route = currentRoute();
  views.forEach((v) => v.classList.toggle('is-hidden', v.id !== route));
  links.forEach((a) => {
    const active = a.getAttribute('href') === `#${route}`;
    a.classList.toggle('is-active', active);
    if (active) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

window.addEventListener('hashchange', render);
render();

/* ---------- Форма зворотного зв’язку ---------- */
const form = document.getElementById('feedback-form');
const status = document.getElementById('form-status');
const reviewsEl = document.getElementById('reviews');
const STORAGE_KEY = 'lab5-reviews';

function loadReviews() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveReviews(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) { /* сховище недоступне: відгуки живуть до перезавантаження */ }
}

let reviews = loadReviews();

function renderReviews() {
  reviewsEl.textContent = '';
  if (reviews.length === 0) {
    const li = document.createElement('li');
    li.className = 'review__empty';
    li.textContent = 'Відгуків ще немає. Напишіть перший.';
    reviewsEl.append(li);
    return;
  }
  reviews.forEach((r) => {
    const li = document.createElement('li');
    const author = document.createElement('div');
    author.className = 'review__author';
    author.textContent = r.name;
    const text = document.createElement('div');
    text.textContent = r.message;
    li.append(author, text);
    reviewsEl.append(li);
  });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = form.elements.name.value.trim();
  const message = form.elements.message.value.trim();
  const ok = name.length > 0 && message.length > 0;
  status.classList.toggle('is-error', !ok);
  if (!ok) {
    status.textContent = 'Заповніть імʼя та повідомлення.';
    return;
  }
  reviews.unshift({ name, message });
  saveReviews(reviews);
  renderReviews();
  status.textContent = 'Відгук додано.';
  form.reset();
});

renderReviews();

/* ---------- Чек-ліст спорядження ---------- */
const gearList = document.getElementById('gear-list');
const gearProgress = document.getElementById('gear-progress');

gearList.addEventListener('change', () => {
  const boxes = gearList.querySelectorAll('input[type="checkbox"]');
  const done = gearList.querySelectorAll('input:checked').length;
  gearProgress.textContent = `Зібрано ${done} з ${boxes.length}`;
  boxes.forEach((b) => b.closest('li').classList.toggle('is-done', b.checked));
});