import { test } from 'node:test';
import assert from 'node:assert/strict';
import '../js/dst.js';

const { dstStart, nextDstStart } = globalThis.dst;

const utc = (iso) => new Date(iso);

test('da novembre 2026 il prossimo è il 28 marzo 2027 alle 01:00 UTC', () => {
  assert.deepEqual(nextDstStart(utc('2026-11-16T12:00:00Z')), utc('2027-03-28T01:00:00Z'));
});

test('un secondo prima del cambio restituisce il cambio dello stesso giorno', () => {
  assert.deepEqual(nextDstStart(utc('2027-03-28T00:59:59Z')), utc('2027-03-28T01:00:00Z'));
});

test('nell\'istante esatto del cambio restituisce quello dell\'anno dopo', () => {
  assert.deepEqual(nextDstStart(utc('2027-03-28T01:00:00Z')), utc('2028-03-26T01:00:00Z'));
});

test('un secondo dopo il cambio restituisce quello dell\'anno dopo', () => {
  assert.deepEqual(nextDstStart(utc('2027-03-28T01:00:01Z')), utc('2028-03-26T01:00:00Z'));
});

test('da aprile restituisce marzo dell\'anno dopo', () => {
  assert.deepEqual(nextDstStart(utc('2027-04-15T10:00:00Z')), utc('2028-03-26T01:00:00Z'));
});

test('anno in cui il 31 marzo è domenica', () => {
  assert.deepEqual(dstStart(2024), utc('2024-03-31T01:00:00Z'));
  assert.deepEqual(nextDstStart(utc('2024-01-10T00:00:00Z')), utc('2024-03-31T01:00:00Z'));
});

test('anno in cui il 25 marzo è domenica', () => {
  assert.deepEqual(dstStart(2029), utc('2029-03-25T01:00:00Z'));
});

const { dstEnd, nextDstEnd, isDst } = globalThis.dst;

test('fine dell\'ora legale 2027: 31 ottobre alle 01:00 UTC', () => {
  assert.deepEqual(dstEnd(2027), utc('2027-10-31T01:00:00Z'));
});

test('anno in cui il 25 ottobre è domenica', () => {
  assert.deepEqual(dstEnd(2026), utc('2026-10-25T01:00:00Z'));
});

test('isDst ai confini dell\'inizio', () => {
  assert.equal(isDst(utc('2027-03-28T00:59:59Z')), false);
  assert.equal(isDst(utc('2027-03-28T01:00:00Z')), true);
  assert.equal(isDst(utc('2027-03-28T01:00:01Z')), true);
});

test('isDst ai confini della fine', () => {
  assert.equal(isDst(utc('2027-10-31T00:59:59Z')), true);
  assert.equal(isDst(utc('2027-10-31T01:00:00Z')), false);
  assert.equal(isDst(utc('2027-10-31T01:00:01Z')), false);
});

test('isDst a cavallo del cambio d\'anno e in pieno inverno', () => {
  assert.equal(isDst(utc('2026-12-31T23:59:59Z')), false);
  assert.equal(isDst(utc('2027-01-01T00:00:00Z')), false);
  assert.equal(isDst(utc('2027-06-01T12:00:00Z')), true);
});

test('nextDstEnd: un secondo prima e un secondo dopo la fine', () => {
  assert.deepEqual(nextDstEnd(utc('2027-10-31T00:59:59Z')), utc('2027-10-31T01:00:00Z'));
  assert.deepEqual(nextDstEnd(utc('2027-10-31T01:00:00Z')), utc('2028-10-29T01:00:00Z'));
  assert.deepEqual(nextDstEnd(utc('2027-10-31T01:00:01Z')), utc('2028-10-29T01:00:00Z'));
});

test('nextDstEnd da gennaio e da giugno dello stesso anno', () => {
  assert.deepEqual(nextDstEnd(utc('2027-01-01T00:00:00Z')), utc('2027-10-31T01:00:00Z'));
  assert.deepEqual(nextDstEnd(utc('2027-06-01T12:00:00Z')), utc('2027-10-31T01:00:00Z'));
});
