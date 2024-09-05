import { generateBuildOptions } from './lib/utils';

const sTime = performance.now();

const cPromise = Bun.build(generateBuildOptions('chrome'));
const fPromise = Bun.build(generateBuildOptions('firefox'));

await Promise.all([cPromise, fPromise]);

const eTime = performance.now();

console.log(`[BUNDLER] Built in ${eTime - sTime}ms.`);
