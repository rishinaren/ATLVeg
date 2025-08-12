export function haversineKm(a: {lat:number,lng:number}, b: {lat:number,lng:number}) {
  const R = 6371; // km
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const lat1 = a.lat * Math.PI / 180;
  const lat2 = b.lat * Math.PI / 180;
  const sinDLat = Math.sin(dLat/2);
  const sinDLng = Math.sin(dLng/2);
  const h = sinDLat*sinDLat + Math.cos(lat1)*Math.cos(lat2)*sinDLng*sinDLng;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}
