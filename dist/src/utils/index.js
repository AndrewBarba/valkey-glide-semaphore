import createEval from './createEval.js';
export { createEval };
export async function delay(ms) {
    return await new Promise((resolve) => setTimeout(resolve, ms));
}
