import Map from 'ol/Map'
import View from 'ol/View';
import OSM from 'ol/source/OSM';
import Overlay from 'ol/Overlay';
import {fromLonLat} from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import Haversine from 'haversine-distance'

export default class IndegoMap {
	constructor(center, mapBounds) {
		this.map = new Map({
	    layers: [
	      new TileLayer({
	        source : new OSM()
	      })
	    ],
	    target: 'map',
	    view: new View({
	      center: fromLonLat(center),
	      zoom: 14,
	      extent: mapBounds
	    })
	  })
		this.currentMarkers = []
		this.userMarker = ''
		this.orderedStations = []
		this.stations = []
		this.nextStationToShow = 0
	}

	addNewMarker(coordinates, markerType) {
		const newMarker = new Overlay({
      position: fromLonLat([coordinates.longitude, coordinates.latitude]),
      positioning: 'top-left',
      element: document.createElement('div'),
      stopEvent: false,
      className: `marker ${markerType}`
    })
    this.currentMarkers.push(newMarker)
    this.map.addOverlay(newMarker)
	}

	addUserMarker(coordinates) {
		this.removeMarker(this.userMarker)
		const newMarker = new Overlay({
      position: fromLonLat([coordinates.longitude, coordinates.latitude]),
      positioning: 'top-left',
      element: document.createElement('div'),
      stopEvent: false,
      className: `marker user`
    })
		this.userMarker = newMarker
    this.map.addOverlay(newMarker)	
    this.orderStationsByClosestTo(coordinates)
	}

	moveTo(coordinates) {
		this.map.values_.view.animate({
      center: fromLonLat([coordinates.longitude, coordinates.latitude]),
      zoom: 17
    })
	}

	orderStationsByClosestTo(coordinates) {
		this.orderedStations = this.stations.sort((a, b) => {
      return Haversine({ lat: coordinates.latitude, lon: coordinates.longitude }, { lat: a.coordinates.latitude, lon: a.coordinates.longitude}) > 
             Haversine({ lat: coordinates.latitude, lon: coordinates.longitude }, { lat: b.coordinates.latitude, lon: b.coordinates.longitude})
    })
	}

	paginatedStations(amountToShow = 5) {
		const stations = this.orderedStations.slice(this.nextStationToShow, this.nextStationToShow + amountToShow)
		this.nextStationToShow += amountToShow
		return stations
	}

	getEmptyStationsOnly() {
		this.orderedStations = this.orderedStations.filter(station => {
      return station.bikesAvailable == 0
    })
	}

	getFullStationsOnly() {
		this.orderedStations = this.orderedStations.filter(station => {
      return station.docksAvailable == 0
    })
	}

	removeMarker(marker) {
		this.map.removeOverlay(marker)
	}

	removeAllMarkers() {
		this.currentMarkers.forEach(marker => this.removeMarker(marker))
		this.currentMarkers = []
	}
}
