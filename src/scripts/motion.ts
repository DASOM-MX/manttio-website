/**
 * Motion primitives — plan §4.
 *
 * Binding rules: transform/opacity only, enter 400–600 ms, exit ≤ 200 ms,
 * everything interruptible, and `prefers-reduced-motion` collapses each effect
 * to its final state rather than hiding content behind an animation.
 */
import { animate, inView, scroll, stagger } from 'motion';

const REDUCED = '(prefers-reduced-motion: reduce)';

export const prefersReduced = (): boolean =>
	typeof window !== 'undefined' && window.matchMedia(REDUCED).matches;

/**
 * How much of the element must be in view before it reveals.
 *
 * Anything approaching viewport height can never satisfy a fractional
 * threshold, and since these helpers set `opacity: 0` up front, a threshold
 * that never fires leaves the element invisible permanently. Fall back to
 * `'some'` for tall elements.
 */
const visibilityAmount = (el: Element, preferred: number): number | 'some' =>
	(el as HTMLElement).offsetHeight > window.innerHeight * 0.8 ? 'some' : preferred;

/** Fade + rise once, when the element first enters view. */
export function reveal(target: string | Element, opts: { y?: number; delay?: number } = {}) {
	const els = resolve(target);
	if (!els.length) return;
	if (prefersReduced()) return show(els);

	const { y = 24, delay = 0 } = opts;
	for (const el of els) {
		(el as HTMLElement).style.opacity = '0';
		inView(
			el,
			() => {
				animate(
					el,
					{ opacity: [0, 1], transform: [`translateY(${y}px)`, 'translateY(0px)'] },
					{ duration: 0.55, delay, ease: [0.2, 0.7, 0.3, 1] },
				);
			},
			{ amount: visibilityAmount(el, 0.25) },
		);
	}
}

/** Same, staggered across a group. Capped so long lists never crawl. */
export function revealStagger(target: string | Element, opts: { each?: number; y?: number } = {}) {
	const els = resolve(target);
	if (!els.length) return;
	if (prefersReduced()) return show(els);

	const { each = 0.06, y = 20 } = opts;
	const capped = Math.min(each, 0.5 / els.length);
	for (const el of els) (el as HTMLElement).style.opacity = '0';

	inView(
		els[0].parentElement ?? els[0],
		() => {
			animate(
				els,
				{ opacity: [0, 1], transform: [`translateY(${y}px)`, 'translateY(0px)'] },
				{ duration: 0.55, delay: stagger(capped), ease: [0.2, 0.7, 0.3, 1] },
			);
		},
		{ amount: visibilityAmount(els[0].parentElement ?? els[0], 0.2) },
	);
}

/** Normalized 0→1 progress across a sticky scene. */
export function scrollProgress(section: Element, cb: (p: number) => void) {
	if (prefersReduced()) {
		cb(0);
		return;
	}
	scroll((progress: number) => cb(progress), {
		target: section as HTMLElement,
		offset: ['start start', 'end end'],
	});
}

/** Count-up with tabular numerals. Reduced motion prints the final value. */
export function counter(el: HTMLElement, to: number, opts: { suffix?: string; duration?: number } = {}) {
	const { suffix = '', duration = 900 } = opts;
	const print = (n: number) => {
		el.textContent = Math.round(n).toLocaleString('es-MX') + suffix;
	};
	if (prefersReduced()) return print(to);

	inView(
		el,
		() => {
			const start = performance.now();
			const step = (now: number) => {
				const p = Math.min(1, (now - start) / duration);
				print(to * (1 - Math.pow(1 - p, 3)));
				if (p < 1) requestAnimationFrame(step);
			};
			requestAnimationFrame(step);
		},
		{ amount: 0.6 },
	);
}

/** Pointer-following nudge, ≤ 6 px, fine pointers only. */
export function magnetic(el: HTMLElement, strength = 6) {
	if (prefersReduced() || !window.matchMedia('(pointer: fine)').matches) return;
	el.addEventListener('pointermove', (e) => {
		const r = el.getBoundingClientRect();
		const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
		const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
		animate(el, { x: dx * strength, y: dy * strength }, { duration: 0.18, ease: [0.2, 0.7, 0.3, 1] });
	});
	el.addEventListener('pointerleave', () => {
		animate(el, { x: 0, y: 0 }, { duration: 0.3, ease: [0.2, 0.7, 0.3, 1] });
	});
}

export const BRANDS = ['indigo', 'rojizo', 'verde', 'violeta'] as const;
export type Brand = (typeof BRANDS)[number];

type CycleController = {
	hold: () => void;
	release: () => void;
	set: (brand: string) => void;
	current: () => string;
	onChange: (fn: (brand: string) => void) => void;
};

/**
 * The ambient whitelabel proof — one new primary every `intervalMs` (§3.2).
 * Pauses on a hidden tab, while held by the brand section, and entirely under
 * reduced motion.
 */
export function brandCycle(intervalMs = 10000): CycleController {
	const root = document.documentElement;
	const listeners: ((brand: string) => void)[] = [];
	let index = Math.max(0, BRANDS.indexOf(root.dataset.brand as Brand));
	let held = false;
	let timer: number | null = null;

	const emit = () => listeners.forEach((fn) => fn(root.dataset.brand ?? BRANDS[0]));

	const apply = (brand: string) => {
		root.dataset.brand = brand;
		emit();
	};

	const running = () => !prefersReduced() && !held && !document.hidden;

	const sync = () => {
		if (timer !== null) {
			clearInterval(timer);
			timer = null;
		}
		if (running()) {
			timer = window.setInterval(() => {
				index = (index + 1) % BRANDS.length;
				apply(BRANDS[index]);
			}, intervalMs);
		}
	};

	document.addEventListener('visibilitychange', sync);
	sync();

	return {
		hold() {
			held = true;
			sync();
		},
		release() {
			held = false;
			sync();
		},
		set(brand: string) {
			const i = BRANDS.indexOf(brand as Brand);
			if (i >= 0) index = i;
			apply(brand);
		},
		current: () => root.dataset.brand ?? BRANDS[0],
		onChange(fn) {
			listeners.push(fn);
		},
	};
}

function resolve(target: string | Element): Element[] {
	if (typeof target === 'string') return Array.from(document.querySelectorAll(target));
	return [target];
}

function show(els: Element[]) {
	for (const el of els) (el as HTMLElement).style.opacity = '1';
}
