import { DHR_STATIONS, DHRStation } from '../data/dhrStations';

export interface JourneyPosition {
  currentStation: DHRStation;
  nextStation: DHRStation | null;
  distanceToCurrentStationKm: number;
  distanceToNextStationKm: number;
  currentElevationM: number;
  currentSpeedKmh: number;
  progressPercentage: number;
  isSimulated: boolean;
}

// Haversine formula to calculate distance between two coordinates in kilometers
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function getNearestStation(lat: number, lng: number): { station: DHRStation; distanceKm: number; index: number } {
  let minDistance = Infinity;
  let nearestStation = DHR_STATIONS[0];
  let nearestIndex = 0;

  DHR_STATIONS.forEach((station, index) => {
    const dist = calculateDistanceKm(lat, lng, station.lat, station.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearestStation = station;
      nearestIndex = index;
    }
  });

  return { station: nearestStation, distanceKm: minDistance, index: nearestIndex };
}

export function computeJourneyState(
  lat: number,
  lng: number,
  simulatedIndex: number | null = null,
  simulatedProgress: number = 0
): JourneyPosition {
  if (simulatedIndex !== null) {
    const currentStation = DHR_STATIONS[simulatedIndex];
    const nextStation = simulatedIndex < DHR_STATIONS.length - 1 ? DHR_STATIONS[simulatedIndex + 1] : null;
    const totalKm = 88.0;
    const progressPercentage = Math.min(100, Math.max(0, (currentStation.distanceKm / totalKm) * 100));

    return {
      currentStation,
      nextStation,
      distanceToCurrentStationKm: 0,
      distanceToNextStationKm: nextStation ? +(nextStation.distanceKm - currentStation.distanceKm).toFixed(1) : 0,
      currentElevationM: currentStation.elevationM,
      currentSpeedKmh: 12, // DHR average mountain speed
      progressPercentage: simulatedProgress || progressPercentage,
      isSimulated: true
    };
  }

  const { station: currentStation, distanceKm, index } = getNearestStation(lat, lng);
  const nextStation = index < DHR_STATIONS.length - 1 ? DHR_STATIONS[index + 1] : null;
  const distToNext = nextStation
    ? calculateDistanceKm(lat, lng, nextStation.lat, nextStation.lng)
    : 0;
  
  const totalKm = 88.0;
  const progressPercentage = Math.min(100, Math.max(0, (currentStation.distanceKm / totalKm) * 100));

  return {
    currentStation,
    nextStation,
    distanceToCurrentStationKm: +distanceKm.toFixed(2),
    distanceToNextStationKm: +distToNext.toFixed(2),
    currentElevationM: currentStation.elevationM,
    currentSpeedKmh: 11,
    progressPercentage: +progressPercentage.toFixed(1),
    isSimulated: false
  };
}

