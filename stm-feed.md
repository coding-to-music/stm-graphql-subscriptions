# STM GTFS Feed

```
FeedMessage {
  entity: [
    FeedEntity {
      id: '25204',
      isDeleted: false,
      vehicle: [VehiclePosition]
    },
    FeedEntity {
      id: '25212',
      isDeleted: false,
      vehicle: [VehiclePosition]
    },
    FeedEntity {
      id: '25245',
      isDeleted: false,
      vehicle: [VehiclePosition]
    },
    ...more items
  ],
header: FeedHeader {
    gtfsRealtimeVersion: '1.0',
    incrementality: 0,
    timestamp: Long { low: 1600923386, high: 0, unsigned: true }
  }
```

### Feed Entity

`feed.entity[0]`

```
FeedEntity {
  id: '25204',
  isDeleted: false,
  vehicle: VehiclePosition {
    trip: TripDescriptor {
      tripId: '221219656',
      startTime: '00:43:00',
      startDate: '20200924',
      routeId: '138'
    },
    position: Position {
      latitude: 45.4726676940918,
      longitude: -73.61949920654297
    },
    currentStopSequence: 24,
    currentStatus: 2,
    timestamp: Long { low: 1600923523, high: 0, unsigned: true },
    vehicle: VehicleDescriptor { id: '25204' }
  }
}
```
