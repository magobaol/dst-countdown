// Inizio dell'ora legale a Roma (Europe/Rome): ultima domenica di marzo,
// alle 02:00 ora locale, cioè alle 01:00 UTC. Tutto il calcolo è in UTC,
// quindi il risultato non dipende dal fuso del browser o del processo.
//
// È uno script classico, non un modulo ES: i browser bloccano gli import
// dei moduli da file://, e la pagina deve funzionare anche aperta in locale.
// Le funzioni sono esposte su globalThis.dst.

(function (root) {
  const MARCH = 2;
  const SWITCH_HOUR_UTC = 1;

  function dstStart(year) {
    const lastOfMarch = new Date(Date.UTC(year, MARCH, 31));
    const lastSunday = 31 - lastOfMarch.getUTCDay();
    return new Date(Date.UTC(year, MARCH, lastSunday, SWITCH_HOUR_UTC));
  }

  // Il prossimo inizio strettamente successivo a `now`: nell'istante esatto
  // del cambio l'ora legale è già iniziata, quindi si passa all'anno dopo.
  function nextDstStart(now = new Date()) {
    const year = now.getUTCFullYear();
    const thisYear = dstStart(year);
    return now < thisYear ? thisYear : dstStart(year + 1);
  }

  root.dst = { dstStart, nextDstStart };
})(globalThis);
