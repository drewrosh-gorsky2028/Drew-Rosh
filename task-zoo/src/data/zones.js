// Zones are the terrains a category can live in. Add a new zone here and a
// matching <Terrain> case in components/scenery/Terrain.jsx.
export const ZONES = {
  savanna: { id: 'savanna', name: 'Savanna', color: '#f4c55c', ink: '#8a5a12' },
  arctic: { id: 'arctic', name: 'Arctic', color: '#bfe4f5', ink: '#2e6c8c' },
  jungle: { id: 'jungle', name: 'Jungle', color: '#8fd17a', ink: '#2f6b2a' },
  ocean: { id: 'ocean', name: 'Ocean', color: '#6cc3e8', ink: '#1d5a83' },
};

export const ZONE_LIST = Object.values(ZONES);
