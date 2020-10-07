export const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export const initialViewState = {
  longitude: -73.645,
  latitude: 45.56,
  zoom: 11,
  pitch: 0,
  bearing: -57.5,
};

export const testPath = [
  {
    path: [
      [-73.964792, 45.413806],
      [-73.587076, 45.503546],
      [-73.48159, 45.701829],
    ],
    name: "Montreal",
  },
];

export const positionGenerator = (arr: any) =>
  arr.map((vehicle: any) => {
    return {
      id: vehicle.id,
      timestamp: vehicle.timestamp,
      route: vehicle.routeId,
      position: [vehicle.position.longitude, vehicle.position.latitude],
    };
  });

export const getMetroColors = (str: string, filter: any) => {
  let colorValue = [];
  switch (str) {
    case "verte":
      colorValue = [0, 128, 0];
      break;
    case "orange":
      colorValue = [255, 140, 0];
      break;
    case "jaune":
      colorValue = [255, 215, 0];
      break;
    case "bleue":
      colorValue = [30, 144, 255];
      break;
    default:
      colorValue = filter ? [255, 99, 71] : [160, 160, 180];
  }
  return colorValue;
};
