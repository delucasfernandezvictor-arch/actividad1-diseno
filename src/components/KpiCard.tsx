import React from 'react';
import { IonIcon } from '@ionic/react';

/** Props de la tarjeta KPI (RA 1 / CE 1.b, RA 3 / CE 3.a). */
export interface KpiCardProps {
  /** Texto descriptivo del indicador (ej. "Pendientes"). */
  label: string;
  /** Valor numérico a mostrar. */
  value: number;
  /** Icono de ionicons (string SVG importado desde 'ionicons/icons'). */
  icon: string;
  /** Clase Tailwind del color de fondo plano (ej. "bg-brutal-yellow"). */
  bgClassName: string;
}

/** Tarjeta KPI neo-brutalista: fondo plano, borde negro grueso, sombra dura. */
const KpiCard: React.FC<KpiCardProps> = ({ label, value, icon, bgClassName }) => (
  <div
    className={`brutal-card brutal-interactive flex h-full flex-col justify-between p-4 ${bgClassName}`}
    role="group"
    aria-label={`${label}: ${value}`}
    tabIndex={0}
  >
    <div className="flex items-center justify-between text-black">
      <span className="text-xs font-black uppercase tracking-wider">{label}</span>
      <IonIcon icon={icon} className="text-2xl text-black" aria-hidden="true" />
    </div>
    <p className="mt-2 text-4xl font-black leading-none text-black md:text-5xl">{value}</p>
  </div>
);

export default KpiCard;
