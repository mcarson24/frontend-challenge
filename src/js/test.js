import 'ol/ol.css';
import Map from 'ol/Map';
import Overlay from 'ol/Overlay';
import View from 'ol/View';
import {toStringHDMS} from 'ol/coordinate';
import TileLayer from 'ol/layer/Tile';
import {fromLonLat, toLonLat} from 'ol/proj';
import OSM from 'ol/source/OSM';

import 'ol-popup/src/ol-popup.css';
import Popup from 'ol-popup';
import { transform } from 'ol/proj';

const locations = [
  {
    coord: [-75.16374, 39.95378],
    address: '1401 John F. Kennedy Blvd.',
    name:  "Municipal Services Building Plaza",
    docksAvailable:  16,
    bikesAvailable:  14
  },
  {
    coord: [-75.14403, 39.94733],
    address: '191 S. 2nd St.',
    name:  "Welcome Park, NPS",
    bikesAvailable:  7,
    docksAvailable:  6
  },
  {
    coord: [-75.20311, 39.9522],
    address: '246 S. 40th St.',
    name: '40th & Spruce',
    bikesAvailable:  4,
    docksAvailable:  12
  }
]

const map = new Map({
  layers: [
    new TileLayer({
      source : new OSM()
    })
  ],
  target: 'map',
  view: new View({
    center: fromLonLat(locations[0].coord),
    zoom: 12
  })
});

locations.forEach(location => {
  const markerElement = document.createElement('div')
  markerElement.classList.add('marker')
  var marker = new Overlay({
    position: fromLonLat(location.coord),
    positioning: 'top-left',
    element: markerElement,
    stopEvent: false
  });
  map.addOverlay(marker);

  var popup = new Popup();
  map.addOverlay(popup);
  const content = `
    <h5>${location.name}</h5>
    <span class="italics">${location.address}</span>
    <span>Bikes Available: ${location.bikesAvailable}</span>
    <span>Docks Available: ${location.docksAvailable}</span>
  `
  popup.show(fromLonLat(location.coord), content);
})

const els = document.getElementsByClassName('marker');
[].forEach.call(els, el => {
  el.addEventListener('click', () => console.log('clicked'))
  // Can't figure this one out right now
})
