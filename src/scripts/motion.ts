/**
 * Motion primitives.
 *
 * Binding rules: transform/opacity only, enter 400–600 ms, exit ≤ 200 ms,
 * everything interruptible, and `prefers-reduced-motion` collapses each effect
 * to its final state rather than hiding content behind an animation.
 *
 * Nothing here drives scroll. The pinned scenes this file used to serve
 * (`scrollProgress`) were removed 2026-09-10 along with `brandCycle` (the
 * four-hue rotation), `counter`, and `magnetic`. Every section on the site now
 * reveals once on entry and then holds still.
 */
import { animate, inView, stagger } from 'motion';

const REDUCED = '(prefers-reduced-motion: reduce)';

/**
 * Un selector, un elemento, o un grupo ya recolectado. El array importa para
 * los casos donde el llamador ya acotó el alcance — p. ej. los elementos de UN
 * beat de la línea de tiempo, que deben escalonarse entre ellos y no con los
 * de los otros cinco beats.
 */
export type Target = string | Element | Element[];

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

/**
 * Fade + rise once, when the element first enters view.
 *
 * `x` desplaza además en horizontal — lo usa la línea de tiempo en zig-zag,
 * donde cada tarjeta entra desde su propio lado de la espina.
 */
export function reveal(target: Target, opts: { y?: number; x?: number; delay?: number } = {}) {
	const els = resolve(target);
	if (!els.length) return;
	if (prefersReduced()) return show(els);

	const { y = 24, x = 0, delay = 0 } = opts;
	for (const el of els) {
		(el as HTMLElement).style.opacity = '0';
		inView(
			el,
			() => {
				animate(
					el,
					{
						opacity: [0, 1],
						transform: [`translate(${x}px, ${y}px)`, 'translate(0px, 0px)'],
					},
					{ duration: 0.55, delay, ease: [0.2, 0.7, 0.3, 1] },
				);
			},
			{ amount: visibilityAmount(el, 0.25) },
		);
	}
}

/** Same, staggered across a group. Capped so long lists never crawl. */
export function revealStagger(target: Target, opts: { each?: number; y?: number } = {}) {
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

/**
 * The "writing" reveal — each `[data-word]` inside `target` fades up in turn.
 *
 * The words are split in the component's frontmatter and rendered as inline
 * spans, so the heading's accessible name is still the whole sentence and
 * `text-wrap: balance` still sees one run of text.
 */
export function revealWords(
	target: Target,
	opts: { each?: number; y?: number; duration?: number; delay?: number } = {},
) {
	const hosts = resolve(target);
	if (!hosts.length) return;

	const words = hosts.flatMap((h) => Array.from(h.querySelectorAll<HTMLElement>('[data-word]')));
	if (!words.length) return;
	if (prefersReduced()) return show(words);

	const { each = 0.045, y = 14, duration = 0.42, delay = 0 } = opts;
	for (const el of words) el.style.opacity = '0';

	inView(
		hosts[0],
		() => {
			animate(
				words,
				{ opacity: [0, 1], transform: [`translateY(${y}px)`, 'translateY(0px)'] },
				{ duration, delay: stagger(each, { startDelay: delay }), ease: [0.2, 0.7, 0.3, 1] },
			);
		},
		{ amount: visibilityAmount(hosts[0], 0.25) },
	);
}

/**
 * Marca un elemento cuando entra en viewport para que el CSS lo dibuje.
 *
 * No anima nada por sí misma: solo pone `data-drawn`, y la transición vive en
 * el CSS del componente. Eso mantiene la regla de "solo transform y opacity"
 * intacta — el conector de la línea punteada se revela con un `translateY`
 * dentro de un contenedor recortado, nunca animando `height`.
 *
 * `inView` de motion.dev es un IntersectionObserver por dentro, así que esto
 * comparte el mismo mecanismo (y el mismo presupuesto) que el resto de las
 * primitivas en lugar de montar un observer aparte.
 */
export function drawOnView(target: Target, opts: { amount?: number } = {}) {
	const els = resolve(target);
	if (!els.length) return;

	// Sin movimiento: la línea ya está dibujada desde el primer frame.
	if (prefersReduced()) {
		for (const el of els) el.setAttribute('data-drawn', '');
		return;
	}

	const { amount = 0.35 } = opts;
	for (const el of els) {
		// `data-anim` es lo que autoriza al CSS a esconder la tinta. Sin JS nunca
		// se pone, así que la línea se queda dibujada y la sección se lee igual
		// — mismo trato que `reveal`, que también aplica su estado inicial aquí
		// y no en la hoja de estilos.
		el.setAttribute('data-anim', '');
		inView(el, () => el.setAttribute('data-drawn', ''), { amount: visibilityAmount(el, amount) });
	}
}

function resolve(target: Target): Element[] {
	if (typeof target === 'string') return Array.from(document.querySelectorAll(target));
	if (Array.isArray(target)) return target;
	return [target];
}

function show(els: Element[]) {
	for (const el of els) (el as HTMLElement).style.opacity = '1';
}
