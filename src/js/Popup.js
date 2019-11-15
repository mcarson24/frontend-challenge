import Popup from 'ol-popup'
import Pluralize from 'pluralize'
import {fromLonLat} from 'ol/proj'

export default class PopupGenerator {
	constructor(station) {
		this.station = station
		this.popup = new Popup
	}

	html() {
		return `
			<div id="popup">
				<div class="text-center font-bold">${this.station.name}</div>
				<div class="w-3/4 mx-auto mb-2 flex justify-center">
					<div class="mr-6 text-center text-gray-900">
						<div class="text-2xl">${this.station.bikeTypes.classic}</div>
						<div class="text-sm">Classic ${Pluralize('Bikes', this.station.bikeTypes.classic)}</div>
					</div>
					<div class="text-center text-gray-900">
						<div class="text-2xl">${this.station.bikeTypes.electric}</div>
						<div class="text-sm">Electric ${Pluralize('Bikes', this.station.bikeTypes.electric)}</div>
					</div>
				</div>
			</div>
		`
	}

	show() {
		this.popup.show(
			fromLonLat([this.station.coordinates.longitude, this.station.coordinates.latitude]), 
			this.html()
		)
	}
}
