interface Header {
  gtfsRealtimeVersion: string;
  incrementality: string;
  timestamp: string;
}

interface VehicleTrip {
  tripId: string;
  startTime: string;
  startDate: string;
  routeId: string;
}

interface Position {
  latitude: number;
  longitude: number;
  bearing: number;
  speed: number;
}

interface Vehicle {
  trip: VehicleTrip;
  position: Position;
  currentStopSequence: number;
  currentStatus: string;
  timestamp: string;
  vehicle: { id: string };
  occupancyStatus: string;
}

export interface Entity {
  id: string;
  vehicle: Vehicle;
}

export interface GTFS {
  header: Header;
  entity: Entity[];
}
