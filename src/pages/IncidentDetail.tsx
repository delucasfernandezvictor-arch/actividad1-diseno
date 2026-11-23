import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonPage,
  IonTextarea,
  IonTitle,
  IonToast,
  IonToolbar,
} from '@ionic/react';
import { useIncidents } from '../context/IncidentsContext';
import { PRIORITY_BADGE_STYLES } from '../components/IncidentItem';

interface DetailParams {
  id: string;
}

/**
 * Vista de detalle /incident/:id (RA 2 / CE 2.b, RA 3 / CE 3.e).
 * Muestra la ficha técnica completa y permite editar la descripción.
 */
const IncidentDetail: React.FC = () => {
  const { id } = useParams<DetailParams>();
  const { getIncident, updateDescription } = useIncidents();
  const incident = getIncident(id);

  const [draft, setDraft] = useState<string>(incident?.description ?? '');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Si cambia la incidencia mostrada, recargamos el borrador
  useEffect(() => {
    setDraft(incident?.description ?? '');
  }, [incident?.id, incident?.description]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incident) return;
    const value = draft.trim();
    if (!value) {
      setToastMessage('La descripción no puede estar vacía');
      return;
    }
    updateDescription(incident.id, value);
    setToastMessage('Descripción actualizada');
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" text="Volver" className="font-black uppercase" />
          </IonButtons>
          <IonTitle>Ficha {id}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {/* Layout en vh: la ficha ocupa la altura visible bajo la cabecera */}
        <div className="mx-auto flex min-h-[calc(100vh-56px)] max-w-3xl flex-col px-4 pb-[6vh] pt-[4vh] sm:px-6">
          {!incident ? (
            <div className="brutal-card flex min-h-[50vh] flex-col items-center justify-center bg-brutal-pink p-8 text-center">
              <p className="text-base font-black uppercase text-black">
                La incidencia {id} no existe o ha sido eliminada.
              </p>
              <IonButton routerLink="/home" routerDirection="back" className="brutal-ion-btn mt-6">
                Volver al listado
              </IonButton>
            </div>
          ) : (
            <article
              aria-label={`Ficha técnica de ${incident.id}`}
              className="brutal-card flex min-h-[70vh] flex-1 flex-col p-5 shadow-brutal-lg"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="border-2 border-black bg-black px-1.5 font-mono text-sm font-bold text-brutal-yellow">{incident.id}</span>
                <span
                  className={`border-2 border-black px-2 py-0.5 text-xs font-black uppercase text-black ${
                    PRIORITY_BADGE_STYLES[incident.priority]
                  }`}
                >
                  Prioridad {incident.priority}
                </span>
                <span
                  className={`border-2 border-black px-2 py-0.5 text-xs font-black uppercase text-black ${
                    incident.status === 'resuelta' ? 'bg-brutal-green' : 'bg-brutal-yellow'
                  }`}
                >
                  {incident.status === 'resuelta' ? 'Resuelta' : 'Pendiente'}
                </span>
              </div>

              <h2 className="mt-4 text-2xl font-black uppercase leading-tight text-black md:text-3xl">{incident.title}</h2>

              <dl className="mt-5 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                <div className="border-3 border-black bg-brutal-blue p-3 shadow-brutal-sm">
                  <dt className="text-xs font-black uppercase tracking-wider text-black">
                    Ubicación
                  </dt>
                  <dd className="mt-1 font-bold text-black">{incident.location}</dd>
                </div>
                <div className="border-3 border-black bg-brutal-blue p-3 shadow-brutal-sm">
                  <dt className="text-xs font-black uppercase tracking-wider text-black">
                    Registrada
                  </dt>
                  <dd className="mt-1 font-bold text-black">{incident.createdAt}</dd>
                </div>
              </dl>

              <form onSubmit={handleSave} className="mt-6 flex flex-1 flex-col gap-5">
                <IonItem className="brutal-field" lines="none">
                  <IonTextarea
                    label="Descripción técnica"
                    labelPlacement="stacked"
                    rows={5}
                    autoGrow
                    value={draft}
                    onIonInput={(e) => setDraft(e.detail.value ?? '')}
                  />
                </IonItem>
                <IonButton expand="block" type="submit" className="brutal-ion-btn mt-auto">
                  Guardar cambios
                </IonButton>
              </form>
            </article>
          )}
        </div>

        <IonToast
          isOpen={toastMessage !== null}
          message={toastMessage ?? ''}
          duration={2000}
          position="bottom"
          onDidDismiss={() => setToastMessage(null)}
        />
      </IonContent>
    </IonPage>
  );
};

export default IncidentDetail;
