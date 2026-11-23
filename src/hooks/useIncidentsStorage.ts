import { useCallback, useEffect, useState } from 'react';
import { Incident, IncidentStatus } from '../types/incident';

/** Clave única en localStorage para el listado de incidencias. */
const STORAGE_KEY = 'smartlab.incidents.v1';

/** Datos de ejemplo que se cargan solo la primera vez (localStorage vacío). */
export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'INC-101',
    title: 'Fallo de enlace en Switch Rack B',
    location: 'Aula 204 - Redes',
    description: 'Pérdida intermitente de paquetes en puertos Gigabit 12 al 16.',
    priority: 'alta',
    status: 'pendiente',
    createdAt: '09:15',
  },
  {
    id: 'INC-102',
    title: 'Actualización de imágenes Docker',
    location: 'Laboratorio DAM 2',
    description: 'Desplegar imagen base Node 22 Alpine en estaciones de trabajo.',
    priority: 'media',
    status: 'pendiente',
    createdAt: '10:30',
  },
  {
    id: 'INC-103',
    title: 'Calibración de proyector láser',
    location: 'Aula Magna',
    description: 'Ajuste trapezoidal y verificación de entrada HDMI.',
    priority: 'baja',
    status: 'resuelta',
    createdAt: 'Ayer',
  },
];

/** Lee el listado guardado; si no existe o está corrupto, devuelve los datos iniciales. */
const loadIncidents = (): Incident[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_INCIDENTS;
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Incident[]) : INITIAL_INCIDENTS;
  } catch {
    return INITIAL_INCIDENTS;
  }
};

/** Contrato público del hook (lo que reciben los componentes). */
export interface IncidentsStorage {
  incidents: Incident[];
  addIncident: (incident: Incident) => void;
  toggleStatus: (id: string) => void;
  deleteIncident: (id: string) => void;
  updateDescription: (id: string, description: string) => void;
  getIncident: (id: string) => Incident | undefined;
}

/**
 * Custom Hook de persistencia (RA 3 / CE 3.c).
 * Mantiene el estado en React y lo sincroniza con localStorage en cada cambio,
 * de modo que altas, cambios de estado, ediciones y borrados sobreviven a la recarga.
 */
export const useIncidentsStorage = (): IncidentsStorage => {
  // Inicialización perezosa: solo se lee localStorage en el primer render
  const [incidents, setIncidents] = useState<Incident[]>(loadIncidents);

  // Sincronización estado -> localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(incidents));
    } catch {
      // Almacenamiento lleno o bloqueado: la app sigue funcionando en memoria
    }
  }, [incidents]);

  const addIncident = useCallback((incident: Incident) => {
    setIncidents((prev) => [incident, ...prev]);
  }, []);

  const toggleStatus = useCallback((id: string) => {
    setIncidents((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const next: IncidentStatus = item.status === 'pendiente' ? 'resuelta' : 'pendiente';
        return { ...item, status: next };
      })
    );
  }, []);

  const deleteIncident = useCallback((id: string) => {
    setIncidents((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateDescription = useCallback((id: string, description: string) => {
    setIncidents((prev) =>
      prev.map((item) => (item.id === id ? { ...item, description } : item))
    );
  }, []);

  const getIncident = useCallback(
    (id: string) => incidents.find((item) => item.id === id),
    [incidents]
  );

  return { incidents, addIncident, toggleStatus, deleteIncident, updateDescription, getIncident };
};
