import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { POST } from '../app/api/chat/route.ts';

// Test configuration is synthetic. No existing secrets are read or restored.
const originalFetch = globalThis.fetch;
after(() => { globalThis.fetch = originalFetch; });
const message = (role, text, id) => ({ id, role, parts: [{ type: 'text', text }] });
const request = (messages) => new Request('http://localhost/api/chat', {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages }),
});
const configure = () => {
  process.env.OPENROUTER_API_KEY = 'test-key-not-a-real-credential';
  process.env.OPENROUTER_MODEL = 'test/model';
};
globalThis.fetch = async () => { throw new Error('Unexpected network access'); };

test('missing configuration returns a readable 503 before any provider call', async () => {
  process.env.OPENROUTER_API_KEY = '';
  process.env.OPENROUTER_MODEL = '';
  const response = await POST(request([message('user', 'Cześć', '1')]));
  assert.equal(response.status, 503);
  assert.match(await response.text(), /OPENROUTER_API_KEY.*OPENROUTER_MODEL/);
});

test('empty messages, invalid history and invalid JSON are rejected', async () => {
  configure();
  for (const messages of [[], [message('user', '   ', '1')], [message('system', 'unexpected', '1')]]) {
    assert.equal((await POST(request(messages))).status, 400);
  }
  assert.equal((await POST(new Request('http://localhost/api/chat', { method: 'POST', body: '{' }))).status, 400);
});

test('streams text through the real provider adapter and forwards conversation history', async () => {
  configure();
  let sent;
  globalThis.fetch = async (_url, options) => {
    sent = JSON.parse(options.body);
    const chunk = (delta, finish_reason = null) => ({
      id: 'test-response', object: 'chat.completion.chunk', created: 0, model: 'test/model',
      choices: [{ index: 0, delta, finish_reason }],
    });
    const frames = [chunk({ role: 'assistant', content: 'Cześć ' }), chunk({ content: 'Alex!' }), chunk({}, 'stop')];
    const encoder = new TextEncoder();
    return new Response(new ReadableStream({ start(controller) {
      for (const frame of frames) controller.enqueue(encoder.encode(`data: ${JSON.stringify(frame)}\n\n`));
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    } }), { headers: { 'Content-Type': 'text/event-stream' } });
  };
  const previous = message('assistant', 'Miło Cię poznać.', '2');
  previous.parts.unshift({ type: 'step-start' });
  const response = await POST(request([message('user', 'Mam na imię Alex', '1'), previous, message('user', 'Jak mam na imię?', '3')]));
  assert.equal(response.status, 200);
  assert.match(response.headers.get('Content-Type'), /text\/event-stream/);
  const body = await response.text();
  assert.match(body, /text-delta/);
  assert.match(body, /Cześć /);
  assert.match(body, /Alex!/);
  assert.match(body, /\[DONE\]/);
  assert.equal(sent.messages.length, 3);
  assert.deepEqual(sent.messages.map(m => m.role), ['user', 'assistant', 'user']);
  assert.match(JSON.stringify(sent.messages), /Mam na imię Alex/);
  assert.equal(sent.stream, true);
});

test('provider errors produce a safe Polish stream error', async () => {
  configure();
  globalThis.fetch = async () => new Response(JSON.stringify({ error: { message: 'private-provider-detail' } }), {
    status: 401, headers: { 'Content-Type': 'application/json' },
  });
  const response = await POST(request([message('user', 'Cześć', '1')]));
  const body = await response.text();
  assert.match(body, /Nie udało się uzyskać odpowiedzi/);
  assert.doesNotMatch(body, /private-provider-detail|test-key-not-a-real-credential/);
});
