// 1. ТАЙМЕР ДО 1 ДЕКАБРЯ (исчезает автоматически после дедлайна)
(function initCountdown() {
  try {
    const promo = document.getElementById('winter-promo');
    const daysEl = document.getElementById('t-days');
    const hoursEl = document.getElementById('t-hours');
    const minsEl = document.getElementById('t-mins');
    const secsEl = document.getElementById('t-secs');

    // Если какой-то элемент удалили из HTML — тихо выходим без ошибки
    if (!promo || !daysEl || !hoursEl || !minsEl || !secsEl) return;

    const now = new Date();
    const year = now.getFullYear();
    const startDate = new Date(year, 9, 1, 0, 0, 0); // 1 октября
    const endDate = new Date(year, 11, 1, 0, 0, 0);  // 1 декабря

    if (now < startDate || now >= endDate) {
      promo.style.display = 'none';
      return;
    }

    const deadline = endDate.getTime();
    let interval = null; // Объявляем заранее, до вызова tick()

    function tick() {
      const diff = deadline - Date.now();

      if (diff <= 0) {
        promo.style.display = 'none';
        if (interval !== null) {
          clearInterval(interval);
          interval = null;
        }
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);

      daysEl.textContent = String(d).padStart(2, '0');
      hoursEl.textContent = String(h).padStart(2, '0');
      minsEl.textContent = String(m).padStart(2, '0');
      secsEl.textContent = String(s).padStart(2, '0');

      promo.style.display = '';
    }

    tick();

    if (deadline > Date.now()) {
      interval = setInterval(tick, 1000);
    }
  } catch (err) {
    console.error('Ошибка в таймере:', err);
  }
})();
    // 2. ИНТЕРАКТИВНЫЙ КАЛЬКУЛЯТОР KING OF TIRES
    (function initCalculator() {
      const prices = {
        full: {
          r13_14: 60,
          r15_16: 70,
          r17: 80,
          r18: 90,
          r19: 100,
          r20: 120,
          r21: 130,
          r22: 150
        },
        balance: {
          r13_14: 70,
          r15_16: 70,
          r17: 70,
          r18: 80,
          r19: 80,
          r20: 100,
          r21: 100,
          r22: 100
        }
      };

      const lowProfileEligible = ['r17', 'r18', 'r19', 'r20', 'r21', 'r22'];

      let currentMode = 'full';
      let currentRadius = 'r15_16';

      const totalEl = document.getElementById('total-price');
      const captionEl = document.getElementById('result-caption');
      const listEl = document.getElementById('included-list');
      const lpCheckbox = document.getElementById('low-profile-cb');
      const lpLabel = document.getElementById('low-profile-label');
      const lpNote = document.getElementById('low-profile-note');

      function updateCalc() {
        const canUseLowProfile = currentMode === 'full' && lowProfileEligible.includes(currentRadius);

        if (canUseLowProfile) {
          lpCheckbox.disabled = false;
          lpLabel.classList.remove('disabled');
          lpNote.textContent = 'Надбавка +30% для профиля 45 и ниже';
        } else {
          lpCheckbox.checked = false;
          lpCheckbox.disabled = true;
          lpLabel.classList.add('disabled');
          lpNote.textContent = currentMode === 'balance'
            ? 'Не применяется к комплексу балансировки'
            : 'Доступно для полной переобувки R17–R22';
        }

        let base = prices[currentMode][currentRadius];
        if (canUseLowProfile && lpCheckbox.checked) {
          base = Math.round(base * 1.3);
        }

        totalEl.textContent = `${base} BYN`;

        if (currentMode === 'full') {
          captionEl.textContent = 'Комплекс переобувки за 4 колеса:';
          listEl.innerHTML = `
            <li>Снятие и установка 4 колёс</li>
            <li>Демонтаж и монтаж шин</li>
            <li>Балансировка + грузики</li>
            <li>Все расходники (кроме металлических вентилей)</li>
          `;
        } else {
          captionEl.textContent = 'Комплекс балансировки за 4 колеса:';
          listEl.innerHTML = `
            <li>Снятие и установка 4 колёс</li>
            <li>Очистка посадочных поверхностей</li>
            <li>Точная балансировка всех колёс</li>
            <li>Все расходные материалы включены</li>
          `;
        }
      }

      document.querySelectorAll('#mode-tabs .tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('#mode-tabs .tab-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentMode = btn.dataset.mode;
          updateCalc();
        });
      });

      document.querySelectorAll('#radius-tabs .tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('#radius-tabs .tab-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentRadius = btn.dataset.radius;
          updateCalc();
        });
      });

      lpCheckbox.addEventListener('change', updateCalc);
      updateCalc();
    })();

    // 3. ЗАЩИТА ЯНДЕКСКАРТЫ ОТ СЛУЧАЙНОГО СКРОЛЛА НА МОБИЛКЕ
    const mapWrapper = document.getElementById('map-wrapper');
    mapWrapper.addEventListener('click', () => {
      mapWrapper.classList.add('active');
    });
(function () {
  const dot = document.getElementById('status-dot');
  if (!dot) return;

  const now = new Date();
  const day = now.getDay(); // 1=Пн, 2=Вт, 3=Ср, 6=Сб
  const hour = now.getHours();

  const isOpen =
    (day >= 1 && day <= 3 && hour >= 10 && hour < 21) ||
    (day === 6 && hour >= 10 && hour < 20);

  dot.classList.toggle('is-closed', !isOpen);
})();
// === СЛАЙДЕР ПРИМЕРОВ РАБОТ (С АВТОПРОКРУТКОЙ) ===
const worksTrack = document.getElementById('worksTrack');
const worksPrev = document.getElementById('worksPrev');
const worksNext = document.getElementById('worksNext');

if (worksTrack && worksPrev && worksNext) {
  let autoSlideTimer;

  const getStep = () => {
    const firstSlide = worksTrack.querySelector('.work-slide');
    return firstSlide ? firstSlide.offsetWidth + 18 : 320;
  };

  const slideNext = () => {
    const isAtEnd = worksTrack.scrollLeft + worksTrack.clientWidth >= worksTrack.scrollWidth - 10;
    if (isAtEnd) {
      worksTrack.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      worksTrack.scrollBy({ left: getStep(), behavior: 'smooth' });
    }
  };

  const startAutoSlide = () => {
    clearInterval(autoSlideTimer);
    autoSlideTimer = setInterval(slideNext, 3500);
  };

  const stopAutoSlide = () => clearInterval(autoSlideTimer);

  worksNext.addEventListener('click', () => {
    slideNext();
    startAutoSlide();
  });

  worksPrev.addEventListener('click', () => {
    if (worksTrack.scrollLeft <= 10) {
      worksTrack.scrollTo({ left: worksTrack.scrollWidth, behavior: 'smooth' });
    } else {
      worksTrack.scrollBy({ left: -getStep(), behavior: 'smooth' });
    }
    startAutoSlide();
  });

  // Пауза при наведении мыши или касании на телефоне
  worksTrack.addEventListener('mouseenter', stopAutoSlide);
  worksTrack.addEventListener('mouseleave', startAutoSlide);
  worksTrack.addEventListener('touchstart', stopAutoSlide, { passive: true });
  worksTrack.addEventListener('touchend', startAutoSlide);

  startAutoSlide();
}