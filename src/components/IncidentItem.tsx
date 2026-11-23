import React from 'react';
import {
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonRouterLink,
} from '@ionic/react';
import { checkmarkCircleOutline, chevronForwardOutline, trashOutline } from 'ionicons/icons';
import { Incident, IncidentPriority } from '../types/incident';

/** Etiqueta de prioridad: colores planos brutalistas con texto negro (contraste > 12:1). */
export const PRIORITY_BADGE_STYLES: Record<IncidentPriority, string> = {
  alta: 'bg-brutal-red',
  media: 'bg-brutal-yellow',
  baja: 'bg-brutal-green',
};

/** Props de la fila de incidencia (RA 1 / CE 1.b, RA 3 / CE 3.a). */
export interface IncidentItemProps {
  incident: Incident;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

const IncidentItem: React.FC<IncidentItemProps> = ({ incident, onToggleStatus, onDelete }) => {
  const isResolved = incident.status === 'resuelta';

  return (
    <IonItemSliding className="brutal-card block animate-pop overflow-hidden transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg motion-reduce:animate-none motion-reduce:transition-none">
      <IonItem className="incident-item" lines="none">
        <div className="w-full py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="border-2 border-black bg-black px-1.5 font-mono text-xs font-bold text-brutal-yellow">
                {incident.id}
              </span>
              <span
                className={`border-2 border-black px-2 py-0.5 text-xs font-black uppercase text-black ${
                  PRIORITY_BADGE_STYLES[incident.priority]
                }`}
              >
                {incident.priority}
              </span>
            </div>
            <span className="font-mono text-xs font-bold text-black">{incident.createdAt}</span>
          </div>

          <h3
            className={`mt-2 text-lg font-black uppercase leading-tight ${
              isResolved ? 'text-neutral-600 line-through decoration-4' : 'text-black'
            }`}
          >
            {incident.title}
          </h3>

          <p className="mt-1 text-sm font-medium text-neutral-800">{incident.description}</p>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t-3 border-black pt-3">
            <span className="text-xs font-bold uppercase text-black">
              Ubicación: <span className="bg-brutal-blue px-1">{incident.location}</span>
            </span>

            <div className="flex items-center gap-3">
              {/* Botón nativo: enfocable con teclado y área táctil mínima 44x44 px (CE 4.c) */}
              <button
                type="button"
                onClick={() => onToggleStatus(incident.id)}
                aria-label={`Cambiar estado de ${incident.id}. Estado actual: ${incident.status}`}
                aria-pressed={isResolved}
                className={`brutal-btn text-black ${isResolved ? 'bg-brutal-green' : 'bg-brutal-yellow'}`}
              >
                {isResolved ? '✓ Resuelta' : '○ Pendiente'}
              </button>

              <IonRouterLink
                routerLink={`/incident/${incident.id}`}
                aria-label={`Ver ficha técnica de ${incident.id}`}
                className="brutal-btn inline-flex items-center gap-1 bg-white text-black"
              >
                Ficha
                <IonIcon icon={chevronForwardOutline} aria-hidden="true" />
              </IonRouterLink>
            </div>
          </div>
        </div>
      </IonItem>

      {/* Opciones ocultas tras deslizamiento horizontal */}
      <IonItemOptions side="end">
        <IonItemOption
          color="success"
          onClick={() => onToggleStatus(incident.id)}
          aria-label={`Marcar ${incident.id} como ${isResolved ? 'pendiente' : 'resuelta'}`}
        >
          <IonIcon slot="icon-only" icon={checkmarkCircleOutline} />
        </IonItemOption>
        <IonItemOption
          color="danger"
          onClick={() => onDelete(incident.id)}
          aria-label={`Eliminar ${incident.id}`}
        >
          <IonIcon slot="icon-only" icon={trashOutline} />
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
};

export default IncidentItem;
