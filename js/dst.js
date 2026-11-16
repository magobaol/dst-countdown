// Ora legale a Roma (Europe/Rome). Inizio: ultima domenica di marzo, alle
// 02:00 ora locale, cioè alle 01:00 UTC. Fine: ultima domenica di ottobre,
// alle 03:00 ora locale, cioè alle 01:00 UTC. Tutto il calcolo è in UTC,
// quindi il risultato non dipende dal fuso del browser o del processo.
//
// È uno script classico, non un modulo ES: i browser bloccano gli import
// dei moduli da file://, e la pagina deve funzionare anche aperta in locale.
// Le funzioni sono esposte su globalThis.dst.

(function (root) {
  const MARCH = 2;
  const OCTOBER = 9;
  const SWITCH_HOUR_UTC = 1;

  // Marzo e ottobre hanno entrambi 31 giorni.
  function lastSundayAtSwitch(year, month) {
    const lastDay = new Date(Date.UTC(year, month, 31));
    const lastSunday = 31 - lastDay.getUTCDay();
    return new Date(Date.UTC(year, month, lastSunday, SWITCH_HOUR_UTC));
  }

  const dstStart = (year) => lastSundayAtSwitch(year, MARCH);
  const dstEnd = (year) => lastSundayAtSwitch(year, OCTOBER);

  // Il prossimo inizio strettamente successivo a `now`: nell'istante esatto
  // del cambio l'ora legale è già iniziata, quindi si passa all'anno dopo.
  function nextDstStart(now = new Date()) {
    const year = now.getUTCFullYear();
    const thisYear = dstStart(year);
    return now < thisYear ? thisYear : dstStart(year + 1);
  }

  // Come per l'inizio: nell'istante esatto della fine l'ora legale è già finita.
  function nextDstEnd(now = new Date()) {
    const year = now.getUTCFullYear();
    const thisYear = dstEnd(year);
    return now < thisYear ? thisYear : dstEnd(year + 1);
  }

  // L'ora legale è in vigore dall'istante di inizio (compreso) a quello di fine (escluso).
  function isDst(now = new Date()) {
    const year = now.getUTCFullYear();
    return now >= dstStart(year) && now < dstEnd(year);
  }

  root.dst = { dstStart, dstEnd, nextDstStart, nextDstEnd, isDst };
})(globalThis);
