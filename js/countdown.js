// Pagina in due modalità, scelte a ogni secondo da globalThis.dst.isDst():
// fuori dall'ora legale il conto alla rovescia punta al suo inizio; durante
// l'ora legale compare un messaggio di festeggiamento e il conto alla rovescia
// punta alla sua fine. Il passaggio da una modalità all'altra avviene senza
// ricaricare la pagina.
//
// Il parametro ?now=<data ISO> simula l'ora corrente (per esempio
// ?now=2027-06-01T12:00:00Z): l'orologio parte da quell'istante e prosegue.

(function () {
  const { nextDstStart, nextDstEnd, isDst } = globalThis.dst;

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

  const MODES = {
    standard: {
      title: "Prossimo passaggio all'ora legale a Roma",
      next: nextDstStart,
      change: '02:00 → 03:00',
    },
    dst: {
      title: "Alla fine dell'ora legale a Roma mancano",
      next: nextDstEnd,
      change: '03:00 → 02:00',
    },
  };

  const elements = {
    main: document.querySelector('main'),
    celebration: document.getElementById('celebration'),
    title: document.getElementById('title'),
    date: document.getElementById('switch-date'),
    days: document.getElementById('days'),
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds'),
  };

  const simulated = Date.parse(new URLSearchParams(location.search).get('now'));
  const clockOffset = Number.isNaN(simulated) ? 0 : simulated - Date.now();
  const currentTime = () => new Date(Date.now() + clockOffset);

  let mode = null;
  let target = null;

  function setMode(name, now) {
    mode = name;
    target = MODES[name].next(now);
    elements.main.classList.toggle('dst-active', name === 'dst');
    elements.celebration.hidden = name !== 'dst';
    elements.title.textContent = MODES[name].title;
    elements.date.textContent = `${dateFormat.format(target)}, ${MODES[name].change}`;
  }

  const pad = (number) => String(number).padStart(2, '0');

  function render() {
    const now = currentTime();
    const name = isDst(now) ? 'dst' : 'standard';
    if (name !== mode || now >= target) setMode(name, now);

    const remaining = target - now;
    elements.days.textContent = Math.floor(remaining / DAY);
    elements.hours.textContent = pad(Math.floor((remaining % DAY) / HOUR));
    elements.minutes.textContent = pad(Math.floor((remaining % HOUR) / MINUTE));
    elements.seconds.textContent = pad(Math.floor((remaining % MINUTE) / SECOND));

    // Riallinea il prossimo aggiornamento al cambio di secondo.
    setTimeout(render, SECOND - (Date.now() % SECOND));
  }

  render();
})();
