export const defaultTimeoutOptions = {
    lockTimeout: 10000,
    acquireTimeout: 10000,
    acquireAttemptsLimit: Number.POSITIVE_INFINITY,
    retryInterval: 10,
};
export function defaultOnLockLost(err) {
    throw err;
}
