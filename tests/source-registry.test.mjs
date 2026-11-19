import test from 'node:test';
import assert from 'node:assert/strict';
import { sourceRegistry, sourceForUrl } from '../src/sourceRegistry.js';

test('source registry keeps official DORA and secondary DGA scopes distinct', () => {
  const doraSources = sourceRegistry.filter((source) => source.regime === 'DORA');
  const dgaSources = sourceRegistry.filter((source) => source.regime === 'DGA');

  assert.equal(doraSources.length, 2);
  assert.ok(doraSources.every((source) => source.sourceType === 'official' && source.monitorEnabled));
  assert.ok(doraSources.some((source) => source.url.endsWith('/dora-oversight')));
  assert.equal(dgaSources.length, 1);
  assert.equal(dgaSources[0].monitorEnabled, false);
  assert.match(dgaSources[0].scope.zh, /数据中介|非个人数据出境/);
});

test('source lookup returns the registered official source', () => {
  const source = sourceForUrl('https://www.eba.europa.eu/activities/direct-supervision-and-oversight/digital-operational-resilience-act/dora-oversight');

  assert.equal(source.id, 'eba-dora-oversight');
  assert.equal(source.authority, 'EBA / ESA');
});
