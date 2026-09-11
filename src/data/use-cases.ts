/**
 * Los cinco sectores a los que se vende Manttio (owner, 2026-09-10).
 *
 * ⚠️ COPY PENDIENTE DE REVISIÓN DEL DUEÑO. Cada texto de aquí está derivado de
 * las capacidades reales que ya declaran los módulos en `./modules.ts` — no hay
 * cifras, porcentajes ni promesas inventadas, precisamente porque no existe una
 * fuente para ellas. Si un sector necesita un argumento que el producto todavía
 * no cumple, se corrige aquí y no en el componente.
 *
 * `shot` apunta al módulo cuya captura ilustra el sector; `modules` son los
 * módulos que ese sector usa más y se renderizan como ligas a /features.
 */
export type UseCase = {
	id: string;
	label: string;
	headline: string;
	body: string;
	/** Módulo cuya captura real se muestra en el panel. */
	shot: string;
	/** Módulos que este sector usa más. Ids de `./modules.ts`. */
	modules: string[];
};

export const USE_CASES: UseCase[] = [
	{
		id: 'hvac',
		label: 'HVAC y refrigeración',
		headline: 'Cada unidad con su historial completo',
		body: 'Un chiller, una manejadora, un cuarto frío: cada equipo guarda su propio expediente de servicios, con los reportes y las órdenes que lo tocaron. Cuando tu cliente pregunta por qué su compresor vuelve a fallar, la respuesta ya está escrita.',
		shot: 'equipos',
		modules: ['equipos', 'contratos', 'calendario'],
	},
	{
		id: 'industrial',
		label: 'Mantenimiento industrial',
		headline: 'Naves, sótanos y azoteas, con o sin señal',
		body: 'La app de campo no depende de la red: el técnico captura el reporte donde esté y todo sube solo en cuanto recupera la conexión. Las órdenes de servicio nacen de una cotización aprobada y se reparten en visitas.',
		shot: 'campo',
		modules: ['campo', 'ordenes', 'reportes'],
	},
	{
		id: 'calibracion',
		label: 'Servicios técnicos y calibración',
		headline: 'Reportes con evidencia y firma, ligados al equipo',
		body: 'Diseña el formato de reporte que tu servicio necesita. Cada captura pide imágenes de evidencia y la firma del cliente para poder cerrarse, y queda ligada al equipo al que se le dio servicio.',
		shot: 'reportes',
		modules: ['reportes', 'equipos', 'crm'],
	},
	{
		id: 'inmuebles',
		label: 'Mantenimiento de inmuebles',
		headline: 'Pólizas que avisan antes de vencer',
		body: 'Hoteles, oficinas y bodegas trabajan por póliza. Las que están por vencer, los seguimientos pendientes y la agenda de la semana aparecen desde que entras al sistema.',
		shot: 'contratos',
		modules: ['contratos', 'calendario', 'crm'],
	},
	{
		id: 'equipo',
		label: 'Reparación de equipo y línea blanca',
		headline: 'Del reporte de falla al cobro, sin traspapelar',
		body: 'Equipo industrial, electrodomésticos y línea blanca: cada cliente con su historial de contactos, cada cotización aprobada o rechazada en línea con el precio congelado, y cada reparación con su reporte firmado.',
		shot: 'crm',
		modules: ['crm', 'cotizaciones', 'reportes'],
	},
];
