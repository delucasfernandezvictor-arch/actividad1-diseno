import React, { useMemo, useRef, useState } from 'react';
import {
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToast,
  IonToolbar,
  RefresherEventDetail,
} from '@ionic/react';
import {
  addOutline,
  alertCircleOutline,
  checkmarkCircleOutline,
  closeOutline,
  layersOutline,
  timeOutline,
} from 'ionicons/icons';
import { FilterOption, Incident, IncidentPriority } from '../types/incident';
import { useIncidents } from '../context/IncidentsContext';
import KpiCard from '../components/KpiCard';
import IncidentItem from '../components/IncidentItem';

const Home: React.FC = () => {
  // Estado principal de datos y controles UI
  // Datos persistidos en localStorage a través del Custom Hook (vía contexto)
  const { incidents, addIncident, toggleStatus, deleteIncident } = useIncidents();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<FilterOption>('todas');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Estado controlado del formulario modal
  const [title, setTitle] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [priority, setPriority] = useState<IncidentPriority>('media');

  // Referencia a IonList para cerrar elementos deslizados programáticamente
  const listRef = useRef<HTMLIonListElement | null>(null);

  // Cálculo memoizado de indicadores KPI (CE 3.e: optimización de renderizado)
  const metrics = useMemo(() => {
    const total = incidents.length;
    const pending = incidents.filter((item) => item.status === 'pendiente').length;
    const resolved = incidents.filter((item) => item.status === 'resuelta').length;
    const critical = incidents.filter(
      (item) => item.status === 'pendiente' && item.priority === 'alta'
    ).length;
    return { total, pending, resolved, critical };
  }, [incidents]);

  // Filtrado combinado por estado y búsqueda textual
  const filteredIncidents = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return incidents.filter((item) => {
      const matchesStatus = activeFilter === 'todas' || item.status === activeFilter;
      const matchesQuery =
        normalizedQuery === '' ||
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.location.toLowerCase().includes(normalizedQuery) ||
        item.id.toLowerCase().includes(normalizedQuery);
      return matchesStatus && matchesQuery;
    });
  }, [incidents, activeFilter, searchQuery]);

  // Gesto nativo Pull-to-Refresh
  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    setTimeout(() => {
      setToastMessage('Estado sincronizado con el servidor');
      event.detail.complete();
    }, 700);
  };

  // Alternar estado pendiente / resuelta desde IonItemSliding
  const handleToggleStatus = async (id: string) => {
    toggleStatus(id);
    await listRef.current?.closeSlidingItems();
    setToastMessage('Estado de incidencia actualizado');
  };

  // Eliminación de elemento
  const handleDeleteIncident = async (id: string) => {
    deleteIncident(id);
    await listRef.current?.closeSlidingItems();
    setToastMessage(`Incidencia ${id} eliminada`);
  };

  // Creación de nueva incidencia desde IonModal
  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) {
      setToastMessage('El título y la ubicación son obligatorios');
      return;
    }

    const newIncident: Incident = {
      id: `INC-${Date.now().toString().slice(-6)}`, // id único (evita colisiones al persistir)
      title: title.trim(),
      location: location.trim(),
      description: description.trim() || 'Sin observaciones adicionales.',
      priority,
      status: 'pendiente',
      createdAt: new Date().toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    addIncident(newIncident);
    setTitle('');
    setLocation('');
    setDescription('');
    setPriority('media');
    setIsModalOpen(false);
    setToastMessage(`Incidencia ${newIncident.id} registrada`);
  };

  return (
    <IonPage>
      {/* Cabecera móvil con contador dinámico */}
      <IonHeader className="ion-no-border">
        <IonToolbar color="primary">
          <IonTitle>SmartLab Monitor</IonTitle>
          <IonButtons slot="end">
            <div className="mr-3 flex items-center gap-2">
              <span className="hidden text-xs font-black uppercase text-brutal-yellow sm:inline">
                Pendientes:
              </span>
              <IonBadge className="rounded-none border-2 border-brutal-yellow px-2.5 py-1 font-black" style={{ background: '#FFE500', color: '#000' }}>
                {metrics.pending}
              </IonBadge>
            </div>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {/* Control táctil Pull-to-Refresh */}
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent
            pullingText="Desliza para actualizar"
            refreshingSpinner="crescent"
            refreshingText="Sincronizando..."
          />
        </IonRefresher>

        {/* Contenedor principal responsivo centrado en escritorio */}
        {/* Layout en unidades de viewport: ocupa al menos toda la altura visible bajo la cabecera */}
        <div className="mx-auto flex min-h-[calc(100vh-56px)] max-w-5xl flex-col px-4 pb-[12vh] pt-[3vh] sm:px-6">
          {/* Bloque 1: Panel de métricas KPI con Tailwind Grid */}
          <section aria-label="Resumen de métricas" className="mb-[4vh]">
            <h2 className="mb-3 inline-block border-3 border-black bg-black px-2 py-1 text-xs font-black uppercase tracking-wider text-brutal-yellow">
              Estado Operativo del Centro
            </h2>
            {/* Rejilla KPI con altura mínima relativa al viewport */}
            <div className="grid min-h-[26vh] auto-rows-fr grid-cols-2 gap-4 md:min-h-[18vh] md:grid-cols-4">
              <KpiCard label="Total" value={metrics.total} icon={layersOutline} bgClassName="bg-white" />
              <KpiCard label="Pendientes" value={metrics.pending} icon={timeOutline} bgClassName="bg-brutal-yellow" />
              <KpiCard label="Críticas" value={metrics.critical} icon={alertCircleOutline} bgClassName="bg-brutal-red" />
              <KpiCard label="Resueltas" value={metrics.resolved} icon={checkmarkCircleOutline} bgClassName="bg-brutal-green" />
            </div>
          </section>

          {/* Bloque 2: Barra de búsqueda y filtro segmentado */}
          <section aria-label="Filtros de búsqueda" className="mb-[4vh] space-y-4">
            <IonSearchbar
              value={searchQuery}
              onIonInput={(e) => setSearchQuery(e.detail.value ?? '')}
              placeholder="Buscar por código, título o aula..."
              debounce={200}
              className="brutal-search"
              aria-label="Buscar incidencias"
            />

            <IonSegment
              scrollable
              className="brutal-segment"
              value={activeFilter}
              onIonChange={(e) =>
                setActiveFilter((e.detail.value as FilterOption) ?? 'todas')
              }
            >
              <IonSegmentButton value="todas">
                <IonLabel>Todas ({metrics.total})</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="pendiente">
                <IonLabel>Pendientes ({metrics.pending})</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="resuelta">
                <IonLabel>Resueltas ({metrics.resolved})</IonLabel>
              </IonSegmentButton>
            </IonSegment>
          </section>

          {/* Bloque 3: Listado interactivo con gestos laterales (IonItemSliding) */}
          <section aria-label="Listado de incidencias" className="flex flex-1 flex-col">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="inline-block border-3 border-black bg-black px-2 py-1 text-xs font-black uppercase tracking-wider text-brutal-yellow">
                Incidencias Registradas ({filteredIncidents.length})
              </h2>
              <span className="text-xs font-bold uppercase text-black">
                Desliza un elemento para acciones
              </span>
            </div>

            {filteredIncidents.length === 0 ? (
              <div className="brutal-card flex min-h-[35vh] flex-1 items-center justify-center border-dashed bg-brutal-pink p-8 text-center">
                <p className="text-base font-black uppercase text-black">
                  No existen incidencias que coincidan con el filtro aplicado.
                </p>
              </div>
            ) : (
              <IonList
                ref={listRef}
                lines="none"
                className="flex flex-col gap-5 bg-transparent p-0 pr-2"
              >
                {filteredIncidents.map((incident) => (
                  <IncidentItem
                    key={incident.id}
                    incident={incident}
                    onToggleStatus={handleToggleStatus}
                    onDelete={handleDeleteIncident}
                  />
                ))}
              </IonList>
            )}
          </section>
        </div>

        {/* Botón de acción flotante (FAB) accesible (área >= 48x48px) */}
        <IonFab slot="fixed" vertical="bottom" horizontal="end" className="mb-[3vh] mr-3">
          <IonFabButton
            className="brutal-fab"
            onClick={() => setIsModalOpen(true)}
            aria-label="Registrar nueva incidencia"
          >
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>

        {/* Modal de alta de nueva incidencia */}
        <IonModal className="brutal-modal" isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Nueva Incidencia</IonTitle>
              <IonButtons slot="end">
                <IonButton
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Cerrar formulario"
                >
                  <IonIcon icon={closeOutline} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          <IonContent className="ion-padding">
            {/* Formulario con altura mínima en vh: el botón queda anclado abajo */}
            <form onSubmit={handleCreateIncident} className="flex min-h-[70vh] flex-col gap-5">
              <IonItem className="brutal-field" lines="none">
                <IonInput
                  label="Título de la incidencia *"
                  labelPlacement="stacked"
                  placeholder="Ej. Error de compilación en SDK"
                  value={title}
                  onIonInput={(e) => setTitle(e.detail.value ?? '')}
                  required
                />
              </IonItem>

              <IonItem className="brutal-field" lines="none">
                <IonInput
                  label="Aula o Ubicación *"
                  labelPlacement="stacked"
                  placeholder="Ej. Laboratorio 102"
                  value={location}
                  onIonInput={(e) => setLocation(e.detail.value ?? '')}
                  required
                />
              </IonItem>

              <IonItem className="brutal-field" lines="none">
                <IonSelect
                  label="Nivel de Prioridad"
                  labelPlacement="stacked"
                  value={priority}
                  onIonChange={(e) => setPriority(e.detail.value as IncidentPriority)}
                >
                  <IonSelectOption value="alta">Alta (Crítica)</IonSelectOption>
                  <IonSelectOption value="media">Media (Operativa)</IonSelectOption>
                  <IonSelectOption value="baja">Baja (Mantenimiento)</IonSelectOption>
                </IonSelect>
              </IonItem>

              <IonItem className="brutal-field" lines="none">
                <IonTextarea
                  label="Descripción técnica"
                  labelPlacement="stacked"
                  rows={4}
                  placeholder="Detalla los síntomas observados..."
                  value={description}
                  onIonInput={(e) => setDescription(e.detail.value ?? '')}
                />
              </IonItem>

              <div className="mt-auto pt-2">
                <IonButton expand="block" type="submit" className="brutal-ion-btn">
                  Guardar Incidencia
                </IonButton>
              </div>
            </form>
          </IonContent>
        </IonModal>

        {/* Notificación Toast de confirmación */}
        <IonToast
          isOpen={toastMessage !== null}
          message={toastMessage ?? ''}
          duration={2200}
          position="bottom"
          onDidDismiss={() => setToastMessage(null)}
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;
