import Map from 'ol/Map';
import Overlay from 'ol/Overlay';
import View from 'ol/View';
import {toStringHDMS} from 'ol/coordinate';
import TileLayer from 'ol/layer/Tile';
import {fromLonLat, toLonLat} from 'ol/proj';
import OSM from 'ol/source/OSM';

import Popup from 'ol-popup';
import { transform } from 'ol/proj';

const philaBounds = {
  minX: -8384524.877077205,
  maxX: -8355485.252209761,
  minY: 4842805.670883484,
  maxY: 4884589.480190991
}

const mapBounds = [philaBounds.minX, philaBounds.minY, philaBounds.maxX, philaBounds.maxY]

console.log(fromLonLat([-75.4093, 39.9696]))

const view = new View({
  center: fromLonLat([-75.16267, 39.95238]),
  zoom: 14,
  extent: mapBounds
})

const map = new Map({
  layers: [
    new TileLayer({
      source : new OSM()
    })
  ],
  target: 'map',
  view
});
let locations = []
fetch('https://dkw6qugbfeznv.cloudfront.net/')
  .then(response => response.json())
  .then(results => {
    results.features.forEach(location => {
      const markerElement = document.createElement('div')
      var marker = new Overlay({
        position: fromLonLat([location.geometry.coordinates[0], location.geometry.coordinates[1]]),
        positioning: 'top-left',
        element: markerElement,
        stopEvent: false,
        className: 'marker'
      });
      map.addOverlay(marker);
      locations.push(location)

      let element = document.createElement('div')
      element.classList.add('px-3', 'py-4', 'border-b', 'border-gray-300', 'flex', 'flex-col', 'hover:bg-gray-100')
      let title = document.createElement('div')
      let titleText = document.createTextNode(location.properties.name)
      title.classList.add('text-2xl', 'font-bold')
      title.appendChild(titleText)
      element.appendChild(title)
      const sidebar = document.getElementById('sidebar')
      sidebar.appendChild(element)
      element.addEventListener('click', () => {
        map.set('view', new View({
          center: fromLonLat([location.geometry.coordinates[0], location.geometry.coordinates[1]]),
          zoom: 18,
          extent: mapBounds
        }))
      })
    })
  })

// Don't render the popups for now:

// locations.forEach(location => {
//   console.log(location)
//   const markerElement = document.createElement('div')
//   var marker = new Overlay({
//     position: fromLonLat(location.coord),
//     positioning: 'top-left',
//     element: markerElement,
//     stopEvent: false,
//     className: 'marker'
//   });
//   map.addOverlay(marker);

//   var popup = new Popup();
//   map.addOverlay(popup);
//   const content = `
//     <h5>${location.name}</h5>
//     <span class="italics">${location.address}</span>
//     <span>Bikes Available: ${location.bikesAvailable}</span>
//     <span>Docks Available: ${location.docksAvailable}</span>
//   `
//   popup.show(fromLonLat(location.coord), content);
// })
