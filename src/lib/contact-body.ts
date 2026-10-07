import { MAX_CONTACT_BODY_BYTES } from './contact-limits';

export class BodyTooLargeError extends Error {}

// Enforce the limit while reading, including chunked bodies without Content-Length.
export async function readContactBody(request: Request): Promise<unknown> {
  const length = Number(request.headers.get('content-length'));
  if (length > MAX_CONTACT_BODY_BYTES) throw new BodyTooLargeError();
  const reader = request.body?.getReader();
  if (!reader) throw new SyntaxError('Missing JSON body');
  const decoder = new TextDecoder();
  let bytes = 0;
  let text = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_CONTACT_BODY_BYTES) {
        await reader.cancel();
        throw new BodyTooLargeError();
      }
      text += decoder.decode(value, { stream: true });
    }
    return JSON.parse(text + decoder.decode());
  } finally {
    reader.releaseLock();
  }
}
