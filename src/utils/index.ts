import createEval from './createEval';

export { createEval };

export async function delay(ms: number): Promise<void> {
  return await new Promise((resolve) => setTimeout(resolve, ms));
}
