export default class Station {
	constructor(station) {
		this.coordinates = {
			latitude: station.geometry.coordinates[1],
			longitude: station.geometry.coordinates[0]
		}
		this.id = station.properties.kioskId
		this.bikesAvailable = station.properties.bikesAvailable
		this.docksAvailable = station.properties.docksAvailable
		this.name = station.properties.name
		this.address = station.properties.addressStreet
		this.bikeTypes = {
			classic: station.properties.classicBikesAvailable,
			smart: station.properties.smartBikesAvailable,
			electric: station.properties.electricBikesAvailable
		}
	}

	get status() {
		if (this.bikesAvailable == 0) return 'empty'
		if (this.docksAvailable == 0) return 'full'
		return 'healthy'
	}

	get hasAvailableBikes() {
		return this.bikesAvailable > 0
	}

	get hasAvailableDocks() {
		return this.docksAvailable > 0
	}
}
