# dst-countdown
Micro sito statico che mostra il conto alla rovescia al prossimo passaggio all'ora legale a Roma (fuso `Europe/Rome`).

L'ora legale comincia l'ultima domenica di marzo: alle 02:00 ora locale gli orologi passano alle 03:00, cioè alle 01:00 UTC. Il prossimo passaggio è il 28 marzo 2027.

## Pubblicazione
Il sito si pubblica con GitHub Pages dal branch `main`. L'indirizzo atteso è `https://magobaol.github.io/dst-countdown/`.

## Stack
HTML, CSS e JavaScript statici: nessuno step di build e nessuna dipendenza runtime.

## Modalità
- **Fuori dall'ora legale:** conto alla rovescia all'inizio dell'ora legale (ultima domenica di marzo, 01:00 UTC).
- **Durante l'ora legale:** messaggio di festeggiamento e conto alla rovescia alla fine (ultima domenica di ottobre, 01:00 UTC).

Il passaggio fra le modalità avviene senza ricaricare la pagina. Il parametro `?now=2027-06-01T12:00:00Z` simula l'ora corrente.

## Test
```
npm test
```
