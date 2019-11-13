import {fromLonLat} from 'ol/proj'
import Popup from 'ol-popup'
import pluralize from 'pluralize'

const classes = {
	div: ['px-3', 'py-4', 'w-full', 'border-b', 'border-gray-300', 'flex', 'flex-col', 'hover:bg-gray-100', 'hover:cursor-pointer'],
	title: ['text-xl', 'font-bold', 'mx-auto', 'sm:m-0'],
	paragraph: ['text-base', 'mx-auto', 'sm:m-0']	
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
		const popupElement = document.createElement('div')
		const heading = document.createElement('h2')
		const availableDocksParagraph = document.createElement('p')
		this.indegoMap.removeLastPopup()

		heading.appendChild(document.createTextNode(`Station Information:`))
		popupElement.appendChild(heading)
		availableDocksParagraph.appendChild(document.createTextNode(`${station.docksAvailable} Open Docks`))
		popupElement.appendChild(availableDocksParagraph)

		for (let type in station.bikeTypes) {
			const paragraph = document.createElement('p')
			const numberOfBikesOfType = station.bikeTypes[type]
			paragraph.appendChild(document.createTextNode(`${numberOfBikesOfType} ${type} ${pluralize('bikes', numberOfBikesOfType)} `))
			popupElement.appendChild(paragraph)
		}

		this.indegoMap.currentPopup = popup
		
		return popupElement
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

			this.indegoMap.map.addOverlay(popup)
			popup.show(
				fromLonLat([station.coordinates.longitude, station.coordinates.latitude]), 
				this.createPopUpFor(station, popup)
			);
    	})
		return element
	}
}
