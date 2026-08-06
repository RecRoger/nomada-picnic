const CABA_BOUNDS = {
  north: -34.50,
  south: -34.70,
  west: -58.58,
  east: -58.32,
};

export const MAP_OPTIONS = {
  mapId: '4f50a3928030c24bc35f98e6',
  center: { lat: -34.5635107, lng: -58.4345651 },
  zoom: 12,
  clickableIcons: false,
  streetViewControl: false,
  restriction: {
    latLngBounds: CABA_BOUNDS,
    strictBounds: false, // Impide que arrastren el mapa fuera de estas coordenadas
  },
  disableDefaultUI: true,
}