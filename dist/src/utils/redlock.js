export function getQuorum(clientCount) {
    return Math.round((clientCount + 1) / 2);
}
export function smartSum(count, zeroOrOne) {
    return count + zeroOrOne;
}
