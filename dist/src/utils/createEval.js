import { Script } from '@valkey/valkey-glide';
import createDebug from 'debug';
const debug = createDebug('redis-semaphore:eval');
export default function createEval(script, keysCount) {
    const scriptInstance = new Script(script);
    debug('creating script:', script, 'sha1:', scriptInstance.getHash());
    return async function optimizedEval(client, args) {
        return client.invokeScript(scriptInstance, {
            keys: args.slice(0, keysCount).map(String),
            args: args.slice(keysCount).map(String),
        });
    };
}
