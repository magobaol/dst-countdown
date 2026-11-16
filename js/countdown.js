// Conto alla rovescia verso globalThis.dst.nextDstStart(), aggiornato a ogni
// secondo. Quando l'istante del cambio è raggiunto, il bersaglio passa
// all'anno successivo senza ricaricare la pagina.

(function () {
  const { nextDstStart } = globalThis.dst;

  const SECOND = 1000;
  const MINUTE = 60 * SECOND;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;

  const dateFormat = new Intl.DateTimeFormat('it-IT', {
    timeZone: 'Europe/Rome',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const fields = {
    date: document.getElementById('switch-date'),
    days: document.getElementById('days'),
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds'),
  };

  let target = null;

  function setTarget(now) {
    target = nextDstStart(now);
    fields.date.textContent = `${dateFormat.format(target)}, 02:00 → 03:00`;
  }

  const pad = (number) => String(number).padStart(2, '0');

  function render() {
    const now = new Date();
    if (target === null || now >= target) setTarget(now);

    const remaining = target - now;
    fields.days.textContent = Math.floor(remaining / DAY);
    fields.hours.textContent = pad(Math.floor((remaining % DAY) / HOUR));
    fields.minutes.textContent = pad(Math.floor((remaining % HOUR) / MINUTE));
    fields.seconds.textContent = pad(Math.floor((remaining % MINUTE) / SECOND));

    // Riallinea il prossimo aggiornamento al cambio di secondo.
    setTimeout(render, SECOND - (Date.now() % SECOND));
  }

  render();
})();
