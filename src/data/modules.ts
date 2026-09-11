import type { ImageMetadata } from 'astro';

import fieldappReportes from '../assets/app/fieldapp-reportes.png';
import fieldappReportesDetalle from '../assets/app/fieldapp-reportes-detalle.png';
import superadminClientesDetalle from '../assets/app/superadmin-clientes-detalle.png';
import superadminContratosDetalle from '../assets/app/superadmin-contratos-detalle.png';
import superadminCotizacionesDetalle from '../assets/app/superadmin-cotizaciones-detalle.png';
import superadminReportesDetalle from '../assets/app/superadmin-reportes-detalle.png';
import superadminMetricas from '../assets/app/superadmin-metricas.png';
import superadminCalendario from '../assets/app/superadmin-calendario.png';
import superadminClientes from '../assets/app/superadmin-clientes.png';
import superadminContratos from '../assets/app/superadmin-contratos.png';
import superadminCotizaciones from '../assets/app/superadmin-cotizaciones.png';
import superadminOrdenes from '../assets/app/superadmin-ordenes.png';
import superadminEquipos from '../assets/app/superadmin-equipos.png';
import superadminReportes from '../assets/app/superadmin-reportes.png';
import superadminSitio from '../assets/app/superadmin-sitio.png';

/**
 * The twelve modules, in pitch order (owner, 2026-08-21). The order is a sales
 * decision, not a dependency order: the strongest proof points lead, the two
 * unshipped modules and the remaining shipped ones sit in the middle, and the
 * field app closes. Claims are verified against the module plans in
 * `manttio-whitelabeled/.claude/plans/superadmin/`.
 *
 * `shipped: false` renders a "Próximamente" chip. The split follows what is
 * actually routed in the app (owner, 2026-08-19), NOT the whitelabeled
 * master-plan progress board — that board still lists quotations, orders,
 * calendar and contracts as unbuilt and is out of date.
 */
export type ModuleRow = {
	title: string;
	meta: string;
	chip: string;
	state: 'ok' | 'act' | 'wait';
};

export type ModuleStat = { value: string; label: string; hi?: boolean };

export type Module = {
	id: string;
	name: string;
	icon: string;
	plan: string;
	shipped: boolean;
	crumb: string;
	claim: string;
	stats: ModuleStat[];
	rows: ModuleRow[];
	/**
	 * Real capture of the running app, produced by the screenshot harnesses in
	 * the whitelabeled repo (`superadmin/screenshots`, `frontend/screenshots`)
	 * against stubbed data. Only shipped modules have one; the rest fall back to
	 * the HTML faux-UI, which is also what keeps "Próximamente" honest.
	 */
	shot?: ImageMetadata;
	/** `mobile` renders narrow, in a phone frame. Applies to both captures. */
	shotKind?: 'desktop' | 'mobile';
	/**
	 * The same module with ONE record open, from the same harnesses. `shot`
	 * proves the module exists; this proves what a record holds, which is the
	 * argument the "Dolores" panels make — see `AppShot`'s `variant` prop.
	 * Absent where the module's own screen already IS a detail view (the CMS
	 * editor) or where nothing is shipped to capture.
	 */
	shotDetail?: ImageMetadata;
};

export const MODULES: Module[] = [
	{
		id: 'reportes',
		shot: superadminReportes,
		shotDetail: superadminReportesDetalle,
		shotKind: 'desktop',
		name: 'Reportes y plantillas',
		icon: 'lucide:file-text',
		plan: '06',
		shipped: true,
		crumb: 'Reportes / Plantillas',
		claim:
			'Dale forma a tus reportes cuando lo necesites: edita, crea y revisa. Todos los reportes requieren imágenes de evidencia y la firma de tu cliente para un mejor seguimiento.',
		stats: [
			{ value: '4', label: 'Plantillas activas', hi: true },
			{ value: '128', label: 'Reportes del mes' },
			{ value: '96%', label: 'Firmados' },
		],
		rows: [
			{ title: 'Mantenimiento preventivo · Chiller 40 TR', meta: 'RPT-1284', chip: 'Firmado', state: 'ok' },
			{ title: 'Diagnóstico · Manejadora nave 2', meta: 'RPT-1283', chip: 'En proceso', state: 'act' },
			{ title: 'Correctivo · Cuarto frío', meta: 'RPT-1281', chip: 'Enviado', state: 'wait' },
		],
	},
	{
		id: 'cotizaciones',
		shot: superadminCotizaciones,
		shotDetail: superadminCotizacionesDetalle,
		shotKind: 'desktop',
		name: 'Cotizaciones',
		icon: 'lucide:file-check',
		plan: '20',
		shipped: true,
		crumb: 'Cotizaciones / COT-0184',
		claim:
			'Olvídate de enviar las cotizaciones en PowerPoint o Excel. Con Manttio, tus clientes pueden aprobar o declinar tus cotizaciones en un solo lugar, sin largas esperas y con respuesta inmediata.',
		stats: [
			{ value: '$184,200', label: 'En revisión', hi: true },
			{ value: '5', label: 'Esperando aprobación' },
		],
		rows: [
			{ title: 'COT-0184 · Hotel Vista Real', meta: '18 ago', chip: 'Esperando', state: 'act' },
			{ title: 'COT-0183 · Planta Norte', meta: '16 ago', chip: 'Aprobada', state: 'ok' },
			{ title: 'COT-0179 · Bodega Sur', meta: '11 ago', chip: 'Rechazada', state: 'wait' },
		],
	},
	{
		id: 'ordenes',
		shot: superadminOrdenes,
		shotKind: 'desktop',
		name: 'Órdenes de servicio',
		icon: 'lucide:clipboard-list',
		plan: '19',
		shipped: true,
		crumb: 'Órdenes / OS-0442',
		claim:
			'Abre órdenes de servicio para tus clientes después de que las cotizaciones hayan sido aprobadas, genera reportes automáticamente, agenda visitas, registra contratos y deja de traspapelar órdenes de servicio. Nosotros enviamos todo lo necesario a tus clientes en PDF.',
		stats: [
			{ value: '9', label: 'Órdenes abiertas', hi: true },
			{ value: '3', label: 'Visitas esta semana' },
		],
		rows: [
			{ title: 'OS-0442 · Mantenimiento trimestral', meta: '2 visitas', chip: 'Abierta', state: 'act' },
			{ title: 'OS-0441 · Instalación', meta: '1 visita', chip: 'Abierta', state: 'act' },
			{ title: 'OS-0438 · Correctivo', meta: 'cerrada', chip: 'Completada', state: 'ok' },
		],
	},
	{
		id: 'metricas',
		shot: superadminMetricas,
		shotKind: 'desktop',
		name: 'Métricas de clientes',
		icon: 'lucide:chart-no-axes-column',
		plan: '08 · utm-params',
		shipped: true,
		crumb: 'CRM / Dashboard',
		claim:
			'¿Sabes cuántos clientes llegan a tu negocio después de pagar por publicidad en redes sociales? Nosotros sí. Revisa qué medios de publicidad funcionan mejor para tu negocio e invierte inteligentemente.',
		stats: [
			{ value: '37', label: 'Leads del mes', hi: true },
			{ value: '11', label: 'Nuevos activos' },
			{ value: '23%', label: 'Conversión' },
		],
		rows: [
			{ title: 'Facebook · 14 leads', meta: '3 activos', chip: 'Canal', state: 'ok' },
			{ title: 'Google · 9 leads', meta: '4 activos', chip: 'Canal', state: 'ok' },
			{ title: 'WhatsApp · 5 leads', meta: '2 activos', chip: 'Canal', state: 'act' },
		],
	},
	{
		id: 'crm',
		shot: superadminClientes,
		shotDetail: superadminClientesDetalle,
		shotKind: 'desktop',
		name: 'Clientes',
		icon: 'lucide:users',
		plan: '07 · 08',
		shipped: true,
		crumb: 'Clientes / Hotel Vista Real',
		claim:
			'No pierdas nunca de vista a tus clientes: guarda contactos, crea recordatorios de seguimiento y deja de olvidar las interacciones que has tenido con ellos. Con Manttio, mejora la relación con tus clientes.',
		stats: [
			{ value: '38', label: 'Clientes activos' },
			{ value: '6', label: 'Seguimientos hoy', hi: true },
			{ value: '2', label: 'Vencidos' },
		],
		rows: [
			{ title: 'Llamada · confirma visita del jueves', meta: 'Hoy 10:24', chip: 'Nota', state: 'wait' },
			{ title: 'Cambio de estatus → Cliente', meta: 'Ayer', chip: 'Sistema', state: 'act' },
			{ title: 'Seguimiento programado', meta: '22 ago', chip: 'Agendado', state: 'ok' },
		],
	},
	{
		id: 'calendario',
		shot: superadminCalendario,
		shotKind: 'desktop',
		name: 'Calendario de visitas',
		icon: 'lucide:calendar-days',
		plan: '12',
		shipped: true,
		crumb: 'Calendario / Semana 34',
		claim:
			'Nunca olvides lo que tú y tus técnicos tienen planeado para esta semana: revísalo directamente en el calendario y agenda visitas fácilmente. Tus técnicos las pueden ver desde la aplicación de campo.',
		stats: [
			{ value: '17', label: 'Visitas de la semana', hi: true },
			{ value: '4', label: 'Sin asignar' },
		],
		rows: [
			{ title: 'Mar 09:00 · Hotel Vista Real', meta: 'J. Ramírez', chip: 'Asignada', state: 'act' },
			{ title: 'Mié 13:00 · Planta Norte', meta: 'L. Ortega', chip: 'Atendida', state: 'ok' },
			{ title: 'Jue 08:00 · Bodega Sur', meta: 'sin asignar', chip: 'Pendiente', state: 'wait' },
		],
	},
	{
		id: 'contratos',
		shot: superadminContratos,
		shotDetail: superadminContratosDetalle,
		shotKind: 'desktop',
		name: 'Contratos y pólizas',
		icon: 'lucide:file-signature',
		plan: '13',
		shipped: true,
		crumb: 'Contratos / Pólizas vigentes',
		claim:
			'No pierdas nunca las pólizas de servicio y recuerda de qué orden de servicio salieron. Deja de traspapelar tus contratos y mantenlos todos en un mismo lugar.',
		stats: [
			{ value: '11', label: 'Vigentes' },
			{ value: '2', label: 'Vencen en 30 días', hi: true },
		],
		rows: [
			{ title: 'Póliza de mantenimiento · Hotel Vista Real', meta: 'vence 12 dic', chip: 'Vigente', state: 'ok' },
			{ title: 'Garantía de instalación · Planta Norte', meta: 'vence 03 sep', chip: 'Por vencer', state: 'act' },
			{ title: 'Contrato de renta · Bodega Sur', meta: 'vence 30 ago', chip: 'Por vencer', state: 'act' },
		],
	},
	{
		id: 'sitio',
		shot: superadminSitio,
		shotKind: 'desktop',
		name: 'Sitio web y CMS',
		icon: 'lucide:globe',
		plan: '03 · 04 · 15',
		shipped: true,
		crumb: 'Sitio web / Contenido',
		claim:
			'¿Necesitas una página web para inspirar más confianza en tus clientes? ¡Nosotros te tenemos cubierto! Tu página web viene incluida en cualquier plan, totalmente personalizable, con la identidad de tu negocio por defecto, optimizada para SEO y con las mejores métricas para empujarla directamente a los primeros resultados en Google.',
		stats: [
			{ value: '1', label: 'Sitio publicado', hi: true },
			{ value: '2', label: 'Escalas de color' },
			{ value: '10', label: 'Tipografías' },
		],
		rows: [
			{ title: 'Color primario · escala completa', meta: 'materializada', chip: 'Aplicada', state: 'ok' },
			{ title: 'Logotipo claro y oscuro', meta: 'cargados', chip: 'Aplicada', state: 'ok' },
			{ title: 'Sitio público · contenido publicado', meta: 'hace 3 días', chip: 'En línea', state: 'ok' },
		],
	},
	{
		id: 'almacen',
		name: 'Almacén',
		icon: 'lucide:package',
		plan: '10',
		shipped: false,
		crumb: 'Almacén / Existencias',
		claim:
			'Revisa todo tu inventario y el de tus técnicos, separa material para tus visitas y descuenta piezas después de cada reporte. Mantén toda la trazabilidad de tu inventario de inicio a fin con nosotros.',
		stats: [
			{ value: '312', label: 'SKU en catálogo' },
			{ value: '4', label: 'Almacenes' },
			{ value: '2', label: 'Bajo mínimo', hi: true },
		],
		rows: [
			{ title: 'Refrigerante R-410A · Camioneta 3', meta: '12 kg', chip: 'En rango', state: 'ok' },
			{ title: 'Filtro 20x25x1 · Bodega central', meta: '8 pz', chip: 'Bajo mínimo', state: 'wait' },
			{ title: 'Reabastecimiento · factura cargada', meta: 'hoy', chip: 'Por aprobar', state: 'act' },
		],
	},
	{
		id: 'equipos',
		shot: superadminEquipos,
		shotKind: 'desktop',
		name: 'Equipos',
		icon: 'lucide:gauge',
		plan: '11',
		shipped: true,
		crumb: 'Clientes / Hotel Vista Real / Equipos',
		claim:
			'Mantén los equipos de tus clientes en orden, nunca olvides dónde se encuentran y qué servicios se les han hecho, y liga reportes y órdenes de servicio para no perder de vista ningún trabajo.',
		stats: [
			{ value: '14', label: 'Equipos registrados' },
			{ value: '3', label: 'Servicios de la unidad', hi: true },
		],
		rows: [
			{ title: 'Compresor Bitzer 4VE-6 · serie 88214', meta: '3 servicios', chip: 'En sitio', state: 'ok' },
			{ title: 'Chiller York YCAL · 40 TR', meta: '7 servicios', chip: 'En sitio', state: 'ok' },
			{ title: 'Manejadora Trane · nave 2', meta: '1 servicio', chip: 'Garantía', state: 'act' },
		],
	},
	{
		id: 'facturacion',
		name: 'Facturación',
		icon: 'lucide:receipt',
		plan: '09',
		shipped: false,
		crumb: 'Facturación / Saldos',
		claim:
			'Deja de pagar por otras aplicaciones para facturar: nosotros mismos nos encargamos de ello. Evita dolores de cabeza y de bolsillo.',
		stats: [
			{ value: '$312,480', label: 'Por cobrar', hi: true },
			{ value: '3', label: 'Vencidas' },
		],
		rows: [
			{ title: 'Hotel Vista Real · 4 reportes', meta: '$48,200', chip: 'Pagada', state: 'ok' },
			{ title: 'Planta Norte · 7 reportes', meta: '$96,400', chip: 'Pendiente', state: 'act' },
			{ title: 'Bodega Sur · 2 reportes', meta: '$18,900', chip: 'Vencida', state: 'wait' },
		],
	},
	{
		id: 'campo',
		shot: fieldappReportes,
		shotDetail: fieldappReportesDetalle,
		shotKind: 'mobile',
		name: 'App de campo',
		icon: 'lucide:smartphone',
		plan: 'field app',
		shipped: true,
		crumb: 'App de campo / Sincronización',
		claim:
			'Funciona en cualquier dispositivo con un navegador web, incluso sin señal. Tus técnicos capturan desde cualquier lugar y todo sube solo en cuanto se recupera la red.',
		stats: [
			{ value: '3', label: 'Por sincronizar', hi: true },
			{ value: '12', label: 'Técnicos activos' },
		],
		rows: [
			{ title: 'Captura offline · Hotel Vista Real', meta: 'hace 2 h', chip: 'Sincronizado', state: 'ok' },
			{ title: 'Firma del cliente capturada', meta: 'hace 2 h', chip: 'Sincronizado', state: 'ok' },
			{ title: 'Fotos de evidencia (4)', meta: 'en cola', chip: 'Pendiente', state: 'wait' },
		],
	},
];
