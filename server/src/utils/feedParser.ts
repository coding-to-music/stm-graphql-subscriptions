export const feedParser = (response: any) => {
  const timestamp = response.header.timestamp.low;
  const count = response.entity.length;
  const feed = response.entity.map((entity: any) => {
    const id = entity.id;
    const isDeleted = entity.isDeleted;
    const tripId = entity.vehicle.trip.tripId;
    const startTime = entity.vehicle.trip.startTime;
    const startDate = entity.vehicle.trip.startDate;
    const routeId = entity.vehicle.trip.routeId;
    const latitude = entity.vehicle.position.latitude;
    const longitude = entity.vehicle.position.longitude;
    const currentStopSequence = entity.vehicle.trip.currentStopSequence;
    const currentStatus = entity.vehicle.trip.currentStatus;
    const vehicleTimestamp = entity.vehicle.timestamp.low;
    const vehicleId = entity.vehicle.vehicle.id;
    return {
      id: id,
      isDeleted: isDeleted,
      tripId: tripId,
      startTime: startTime,
      startDate: startDate,
      routeId: routeId,
      position: {
        latitude: latitude,
        longitude: longitude,
      },
      currentStopSequence: currentStopSequence,
      currentStatus: currentStatus,
      timestamp: vehicleTimestamp,
      vehicleId: vehicleId,
    };
  });
  return {
    timestamp: timestamp,
    count: count,
    feed: feed,
  };
};
