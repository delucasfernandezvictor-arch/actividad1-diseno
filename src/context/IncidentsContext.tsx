import React, { createContext, useContext } from 'react';
import { IncidentsStorage, useIncidentsStorage } from '../hooks/useIncidentsStorage';

/**
 * Contexto que comparte UNA sola instancia del hook entre Home y la vista de detalle.
 * Así, al editar en /incident/:id y volver atrás, Home ya muestra el cambio
 * (IonRouterOutlet mantiene Home montada en memoria).
 */
const IncidentsContext = createContext<IncidentsStorage | null>(null);

interface IncidentsProviderProps {
  children: React.ReactNode;
}

export const IncidentsProvider: React.FC<IncidentsProviderProps> = ({ children }) => {
  const storage = useIncidentsStorage();
  return <IncidentsContext.Provider value={storage}>{children}</IncidentsContext.Provider>;
};

export const useIncidents = (): IncidentsStorage => {
  const ctx = useContext(IncidentsContext);
  if (!ctx) {
    throw new Error('useIncidents debe usarse dentro de <IncidentsProvider>');
  }
  return ctx;
};
