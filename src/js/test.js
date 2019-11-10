import Map from 'ol/Map';
import Overlay from 'ol/Overlay';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import {fromLonLat} from 'ol/proj';
import OSM from 'ol/source/OSM';
import Popup from 'ol-popup';
import HTMLRenderer from './HTMLRenderer'
import Station from './Station'
import {center, boundaries} from './Philadelphia'
import debounce from 'lodash'

const haversine = require('haversine-distance')

const addressInput = document.querySelector('#address')
addressInput.addEventListener('keydown', ({key, target}) => {
  if (key == 'Enter') {
    const address = target.value
  }
})

// Ordering by closest to City Hall:
// const orderedStations = results.features.sort((a, b) => {
//   return haversine({ lat: 39.95238, lon: -75.16267 }, { lat: a.geometry.coordinates[1], lon: a.geometry.coordinates[0]}) > 
//          haversine({ lat: 39.95238, lon: -75.16267 }, { lat: b.geometry.coordinates[1], lon: b.geometry.coordinates[0]})
// })
// console.log(orderedStations)

document.addEventListener('DOMContentLoaded', () => {
  const map = new Map({
    layers: [
      new TileLayer({
        source : new OSM()
      })
    ],
    target: 'map',
    view: new View({
      center: fromLonLat(center),
      zoom: 14,
      extent: boundaries
    })
  });

  const renderer = new HTMLRenderer(map)
  const sidebar = document.getElementById('sidebar')

  fetch('https://dkw6qugbfeznv.cloudfront.net/')
    .then(response => response.json())
    .then(results => {
      results.features.forEach(location => {
        const station = new Station(location)
        sidebar.appendChild(renderer.createStationInfoDiv(station, {
          div: ['px-3', 'py-4', 'border-b', 'border-gray-300', 'flex', 'flex-col', 'hover:bg-gray-100', 'hover:cursor-pointer'],
          title: ['text-xl', 'font-bold'],
          paragraph: ['text-base']
        }))
        map.addOverlay(new Overlay({
          position: fromLonLat([station.coordinates.longitude, station.coordinates.latitude]),
          positioning: 'top-left',
          element: document.createElement('div'),
          stopEvent: false,
          className: `marker ${station.status}`
        }))
      })
    })
})




