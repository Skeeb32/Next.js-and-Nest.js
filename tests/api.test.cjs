const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
require('reflect-metadata');
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../apps/api/dist/app.module.js');
let app, base;
before(async () => { app = await NestFactory.create(AppModule, { logger: false }); await app.listen(0, '127.0.0.1'); base = await app.getUrl(); });
after(async () => { if (app) await app.close(); });
const send = (path, body, method = 'POST') => fetch(base + path, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
test('create, retrieve and complete a task over HTTP', async () => {
  const created = await send('/tasks', { title: '  Test shared contract  ' });
  assert.equal(created.status, 201); const task = await created.json();
  assert.equal(task.title, 'Test shared contract'); assert.equal(task.isCompleted, false);
  const fetched = await (await fetch(base + '/tasks/' + task.id)).json(); assert.deepEqual(fetched, task);
  const updated = await send('/tasks/' + task.id, { isCompleted: true }, 'PATCH'); assert.equal(updated.status, 200); assert.equal((await updated.json()).isCompleted, true);
});
test('rejects malformed payloads and unknown fields', async () => {
  for (const body of [{title: ''}, {title: '   '}, {title: 42}, {title: 'x'.repeat(121)}, {title: 'Valid', admin: true}]) assert.equal((await send('/tasks', body)).status, 400);
  assert.equal((await send('/tasks/1', {isCompleted: 'true'}, 'PATCH')).status, 400);
});
test('handles invalid and missing IDs', async () => {
  assert.equal((await fetch(base + '/tasks/nope')).status, 400);
  assert.equal((await fetch(base + '/tasks/999999')).status, 404);
});
