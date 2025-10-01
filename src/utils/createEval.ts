import { Script } from '@valkey/valkey-glide';
import createDebug from 'debug';
import type { GlideClient } from '../types.js';

const debug = createDebug('redis-semaphore:eval');

export default function createEval<Args extends Array<number | string>, Result>(
  script: string,
  keysCount: number,
): (client: GlideClient, args: Args) => Promise<Result> {
  const scriptInstance = new Script(script);
  debug('creating script:', script, 'sha1:', scriptInstance.getHash());
  return async function optimizedEval(client: GlideClient, args: Args): Promise<Result> {
    return client.invokeScript(scriptInstance, {
      keys: args.slice(0, keysCount).map(String),
      args: args.slice(keysCount).map(String),
    }) as Promise<Result>;
  };
}
