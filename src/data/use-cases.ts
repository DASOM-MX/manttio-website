import type { ImageMetadata } from 'astro';

import equipoArt from '../assets/use-cases/appliance-repair-usecase.png';
import construccionArt from '../assets/use-cases/construction-usecase.png';
import inmueblesArt from '../assets/use-cases/household-maintenance-usecase.png';
import hvacArt from '../assets/use-cases/hvac-usecase.png';
import industrialArt from '../assets/use-cases/industrial-maintenance-use-case.png';

/**
 * Los cinco sectores a los que se vende Manttio (owner 2026-09-10; sectores y
 * copy revisados 2026-09-16).
 *
 * Los paneles se ordenan por la FORMA COMERCIAL del trabajo, no por los
 * módulos que usan: ruta preventiva por unidad, obra dentro de planta ajena,
 * obra que termina y entrega garantía, póliza mensual multi-servicio y ticket
 * por evento. Es lo único en lo que los cinco sectores se distinguen de
 * verdad, y es lo que evita que la sección se lea como un resumen de features
 * — que es justo donde había caído la versión anterior, en la que cada texto
 * repetía un `claim` de `./modules.ts` o una tarjeta de `Pains.astro`.
 *
 * Dos reglas al editar:
 *
 *  1. Sin cifras, porcentajes ni promesas inventadas. Todo lo que se afirma
 *     aquí lo respalda un módulo real de `./modules.ts`.
 *  2. El cuerpo no nombra módulos. De eso ya se encargan los chips; el cuerpo
 *     habla de la operación del cliente.
 *
 * `art` es la ilustración del sector y, cuando existe, ES la imagen del panel
 * (owner 2026-09-16): la sección pasa a ser reconocimiento del sector y la
 * prueba de producto se queda en `Pains.astro` y en /features. Mientras un
 * sector no tenga la suya, `shot` mantiene su captura de la app — por eso los
 * cinco `shot` son distintos entre sí y siguen documentados abajo: cambiar de
 * pestaña tiene que cambiar la pantalla, haya ilustración o no.
 *
 * `modules` son los módulos que ese sector usa más y se renderizan como ligas
 * a /features.
 */
export type UseCase = {
	id: string;
	label: string;
	headline: string;
	body: string;
	/**
	 * Ilustración del sector. Cuando está, reemplaza la captura en el panel.
	 * Va en `src/assets/` y no en `public/` para que Astro la optimice.
	 */
	art?: ImageMetadata;
	/** Módulo cuya captura se muestra mientras el sector no tenga `art`. */
	shot: string;
	/** Módulos que este sector usa más. Ids de `./modules.ts`. */
	modules: string[];
};

export const USE_CASES: UseCase[] = [
	{
		id: 'hvac',
		label: 'HVAC y refrigeración',
		headline: 'Deja de buscar entre reportes viejos: cada equipo tiene su historial',
		body: 'Tus clientes tienen varios equipos en un mismo sitio y cada uno lleva su propia historia. Ahí quedan sus servicios, sus reportes y sus órdenes, siempre en el mismo lugar. Cuando te pregunten por uno, la respuesta ya está lista.',
		art: hvacArt,
		shot: 'equipos',
		modules: ['equipos', 'reportes', 'calendario'],
	},
	{
		id: 'industrial',
		label: 'Mantenimiento industrial',
		headline: '¿Sin señal en la planta? No hay problema',
		body: 'En plantas, naves y sótanos la app funciona igual. Tus técnicos capturan el reporte en el momento, con fotos y firma, y todo se sincroniza solo en cuanto vuelve la red. Nadie tiene que repetir el trabajo al llegar a la oficina.',
		art: industrialArt,
		shot: 'campo',
		modules: ['campo', 'reportes', 'ordenes'],
	},
	{
		id: 'construccion',
		label: 'Servicios técnicos de construcción',
		headline: 'Desde una simple instalación o mantenimiento hasta una obra completa',
		body: 'Lo mismo una instalación pequeña que un proyecto de meses: la orden de servicio se adapta al tamaño del trabajo. Y cuando termina, la garantía y los equipos instalados quedan registrados, listos para el día en que ese cliente vuelva a necesitarte.',
		art: construccionArt,
		shot: 'ordenes',
		modules: ['ordenes', 'contratos', 'equipos'],
	},
	{
		id: 'inmuebles',
		label: 'Mantenimiento de inmuebles',
		headline: '¿Qué cubre la póliza y qué se cobra aparte? Siempre claro',
		body: 'Un inmueble necesita atención de distintos tipos durante todo el año. Cada visita queda ligada a la póliza que la cubre, y lo que no está cubierto se cotiza aparte antes de mandar al técnico. A fin de mes sabes qué se atendió y qué se cobra.',
		art: inmueblesArt,
		shot: 'contratos',
		modules: ['contratos', 'calendario', 'cotizaciones'],
	},
	{
		id: 'equipo',
		label: 'Reparación de equipo y línea blanca',
		headline: 'No pierdas tiempo cambiando de área de trabajo: todo desde tu taller',
		body: 'Atiendes varios servicios al día y el papeleo se acumula más rápido que el trabajo. Cotizas, das seguimiento y cierras el reporte desde el mismo sistema, sin cambiar de aplicación ni volver a capturar nada. El cliente recibe su PDF y tú sigues con el siguiente.',
		art: equipoArt,
		shot: 'crm',
		modules: ['crm', 'cotizaciones', 'reportes'],
	},
];
