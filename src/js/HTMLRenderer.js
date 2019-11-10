import View from 'ol/View'
import {fromLonLat} from 'ol/proj'
import {mapBounds} from './Philadelphia'

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

	createStationInformationDiv(location, classes = {}) {
		const element = document.createElement('div')

		element.classList.add(...classes.div)
		
		const elementChildren = [
			this.createParagraph(location.properties.name, classes.title),
			this.createParagraph(location.properties.addressStreet, classes.paragraph),
			this.createParagraph(`${location.properties.bikesAvailable} Bikes Available`, classes.paragraph),
			this.createParagraph(`${location.properties.docksAvailable} Docks Available`, classes.paragraph)
		]
		elementChildren.forEach(child => element.appendChild(child))

		element.addEventListener('click', () => {
      this.map.set('view', new View({
        center: fromLonLat([location.geometry.coordinates[0], location.geometry.coordinates[1]]),
        zoom: 18,
        extent: mapBounds
      }))
    })
		return element
	}
}
