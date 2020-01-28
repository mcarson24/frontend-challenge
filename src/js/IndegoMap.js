import Map from 'ol/Map'
import View from 'ol/View';
import OSM from 'ol/source/OSM';
import Overlay from 'ol/Overlay';
import {fromLonLat} from 'ol/proj';
import TileLayer from 'ol/layer/Tile';

export default class IndegoMap {
	constructor(center, mapBounds) {
		this.map = new Map({
	    layers: [
	      new TileLayer({
	        source: new OSM()
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
		this.currentPopup = ''
	}

	addNewMarker(coordinates, markerType) {
		const newMarker = new Overlay({
      position: fromLonLat([coordinates.longitude, coordinates.latitude]),
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
	    // positioning: 'top-center',
	    element: document.createElement('div'),
	    stopEvent: false,
	    className: `marker user`
		})
		this.userMarker = newMarker
    this.map.addOverlay(newMarker)	
	}

	moveTo(coordinates) {
		this.map.values_.view.animate({
	      center: fromLonLat([coordinates.longitude, coordinates.latitude]),
	      zoom: 17
	    })
	}

	defaultView(coordinates) {
		this.removeMarker(this.userMarker)
		this.map.values_.view.animate({
			center: fromLonLat(coordinates),
			zoom: 14
		})
	}

	removeMarker(marker) {
		this.map.removeOverlay(marker)
	}

	removeAllMarkers() {
		this.currentMarkers.forEach(marker => this.removeMarker(marker))
		this.removeMarker(this.currentPopup)
		this.currentMarkers = []
		this.currentPopup = ''
	}

	removeLastPopup() {
		this.removeMarker(this.currentPopup)
	}

	reset() {
		this.removeAllMarkers()
		this.nextStationToShow = 0
	}
}
