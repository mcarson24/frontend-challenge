import $ from 'jquery'
import 'ol/ol.css'
import {Map, View} from 'ol'
import {fromLonLat} from 'ol/proj';
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'

const coord = fromLonLat([-75.16394, 39.95230])

console.log(fromLonLat(coord))
const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({
		center: coord,
		zoom: 13
	})
});
