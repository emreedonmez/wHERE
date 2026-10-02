export type Coordinate = {
  latitude: number;
  longitude: number;
};

const EARTH_RADIUS_KM = 6371;

/**
 * Calculates the great-circle distance between two coordinates
 * using the Haversine formula.
 */
export function calculateDistance(
  pointA: Coordinate,
  pointB: Coordinate,
): number {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

  const latitudeDifference = toRadians(
    pointB.latitude - pointA.latitude,
  );

  const longitudeDifference = toRadians(
    pointB.longitude - pointA.longitude,
  );

  const latitudeA = toRadians(pointA.latitude);
  const latitudeB = toRadians(pointB.latitude);

  const a =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(latitudeA) *
      Math.cos(latitudeB) *
      Math.sin(longitudeDifference / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}

/**
 * Converts distance into a score.
 *
 * 0-50 km   -> 100 points
 * 50-500 km -> gradually decreases from 100 to 10
 * 500+ km   -> 10 points
 */
export function calculateScore(distanceKm: number): number {
  if (distanceKm <= 50) {
    return 100;
  }

  if (distanceKm >= 500) {
    return 10;
  }

  const score =
    100 - ((distanceKm - 50) / 450) * 90;

  return Math.max(10, Math.round(score));
}