import 'ol/ol.css'
import 'ol-popup/src/ol-popup.css';

import $ from 'jquery'
import {Map, View} from 'ol'
import {fromLonLat, toLonLat, transform} from 'ol/proj'
import Popup from 'ol-popup';
import {toStringHDMS} from 'ol/coordinate'
import {Vector} from 'ol/source'
import Overlay from 'ol/Overlay'
import VectorLayer from 'ol/layer/Vector'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import Popper from 'popper.js'

const coord = fromLonLat([-75.16394, 39.95230])
const coordNY = fromLonLat([-74.006,40.7127])

const marker = new Feature({
  geometry: new Point(
    coordNY
  ), 
})
marker.setProperties({
	style: 'hello'
});

const vectorSource = new Vector({
  features: [marker]
});

const markerVectorLayer = new VectorLayer({
  source: vectorSource,
});


const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({
		center: coord,
		zoom: 5
	})
});
map.addLayer(markerVectorLayer);
const viennaPos = fromLonLat([16.3725, 48.208889]);
var viennaMarker = new Overlay({
  position: viennaPos,
  positioning: 'center-center',
  element: document.getElementById('marker'),
  stopEvent: false
});
map.addOverlay(viennaMarker);
const vienna = new Overlay({
  position: viennaPos,
  // element: document.getElementById('vienna')
});
map.addOverlay(vienna);

var popup = new Popup();

let showingPopUP = false

// map.on('singleclick', function(evt) {
// 	if (showingPopUP) {
// 		popup.hide()
// 		showingPopUP = false
// 	} else {
//     var prettyCoord = toStringHDMS(transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326'), 2);
//     showingPopUP = true
//     popup.show(coordNY, '<div class="popup"><h2>New York City Hall</h2><p>Is here</p></div>');
// 	}
// });

map.on('click', function(evt) {
  var element = popup.getElement();
  var coordinate = evt.coordinate;
  var hdms = toStringHDMS(toLonLat(coordinate));

  $(element).popover('destroy');
  popup.setPosition(coordinate);
  $(element).popover({
    placement: 'top',
    animation: false,
    html: true,
    content: '<p>The location you clicked was:</p><code>' + hdms + '</code>'
  });
  $(element).popover('show');
});

map.addOverlay(popup);

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

