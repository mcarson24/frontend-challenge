import {fromLonLat} from 'ol/proj'
import Popup from 'ol-popup'
import pluralize from 'pluralize'

const classes = {
	div: ['px-3', 'py-4', 'w-full', 'border-b', 'border-gray-300', 'flex', 'flex-col', 'hover:bg-gray-100', 'hover:cursor-pointer'],
	title: ['text-xl', 'font-bold', 'mx-auto', 'md:m-0'],
	paragraph: ['text-base', 'mx-auto', 'md:m-0']	
}

export default class HTMLRenderer {
	constructor(map) {
		this.indegoMap = map
	}

	createParagraph(text, classes = []) {
		const paragraphElement =  document.createElement('p')
		paragraphElement.classList.add(...classes)
		const textNode = document.createTextNode(text)
		paragraphElement.appendChild(textNode)

		return paragraphElement
	}

	createPopUpFor(station, popup) {
		return `
			<div id="popup">
				<div class="text-center font-bold">${station.name}</div>
				<div class="w-3/4 mx-auto mb-2 flex justify-center">
					<div class="mr-6 text-center text-gray-900">
						<div class="text-2xl">${station.bikeTypes.classic}</div>
						<div class="text-sm">Classic ${pluralize('Bikes', station.bikeTypes.classic)}</div>
					</div>
					<div class="text-center text-gray-900">
						<div class="text-2xl">${station.bikeTypes.electric}</div>
						<div class="text-sm">Electric ${pluralize('Bikes', station.bikeTypes.electric)}</div>
					</div>
				</div>
			</div>
		`
	}

	createStationInfoDiv(station) {
		const element = document.createElement('div')

		element.classList.add(...classes.div)
		
		const elementChildren = [
			this.createParagraph(station.name, classes.title),
			this.createParagraph(station.address, classes.paragraph),
			this.createParagraph(`${station.bikesAvailable} Bikes Available`, classes.paragraph),
			this.createParagraph(`${station.docksAvailable} Docks Available`, classes.paragraph)
		]
		elementChildren.forEach(child => element.appendChild(child))
		element.addEventListener('click', () => {
			this.indegoMap.map.values_.view.animate({
				center: fromLonLat([station.coordinates.longitude, station.coordinates.latitude]),
				zoom: 18
			})
			const popup = new Popup()
			this.indegoMap.removeLastPopup()
			this.indegoMap.map.addOverlay(popup)
			this.indegoMap.currentPopup = popup
			popup.show(
				fromLonLat([station.coordinates.longitude, station.coordinates.latitude]), 
				this.createPopUpFor(station, popup)
			);
    	})
		return element
	}
}
