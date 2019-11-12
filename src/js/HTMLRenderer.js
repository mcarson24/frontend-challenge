import {fromLonLat} from 'ol/proj'
import Popup from 'ol-popup'
import pluralize from 'pluralize'

const classes = {
	div: ['px-3', 'py-4', 'border-b', 'border-gray-300', 'flex', 'flex-col', 'hover:bg-gray-100', 'hover:cursor-pointer'],
	title: ['text-xl', 'font-bold'],
	paragraph: ['text-base']	
}

export default class HTMLRenderer {
	constructor(map) {
		this.map = map
	}

	createParagraph(text, classes = []) {
		const paragraphElement =  document.createElement('p')
		paragraphElement.classList.add(...classes)
		const textNode = document.createTextNode(text)
		paragraphElement.appendChild(textNode)

		return paragraphElement
	}

	createPopUpFor(station) {
		const popup = document.createElement('div')
		const heading = document.createElement('h2')
		heading.appendChild(document.createTextNode('Available Bikes:'))
		popup.appendChild(heading)
		for (let type in station.bikeTypes) {
			const paragraph = document.createElement('p')
			const numberOfType = station.bikeTypes[type]
			paragraph.appendChild(document.createTextNode(`${numberOfType} ${type} ${pluralize('bikes', numberOfType)} `))
			popup.appendChild(paragraph)
		}

		return popup
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
			this.map.values_.view.animate({
				center: fromLonLat([station.coordinates.longitude, station.coordinates.latitude]),
				zoom: 18
			})
			const popup = new Popup()

			this.map.addOverlay(popup)
			popup.show(
				fromLonLat([station.coordinates.longitude, station.coordinates.latitude]), 
				this.createPopUpFor(station)
			);
    	})
		return element
	}
}
