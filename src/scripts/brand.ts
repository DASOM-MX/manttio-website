/**
 * Single shared rotation controller (§3.2). ES-module singleton, so every
 * component script on the page talks to the same cycle.
 */
import { brandCycle } from './motion';

export const cycle = brandCycle(10000);
