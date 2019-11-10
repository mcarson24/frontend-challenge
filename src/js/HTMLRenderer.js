import View from 'ol/View'
import {fromLonLat} from 'ol/proj'

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

	createStationInformationDiv(station, classes = {}) {
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
    })
		return element
	}
}
