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

const haversine = require('haversine-distance')
const addressInput = document.querySelector('#address')
let stations = []
let markers = []


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
  const userMarker = new Overlay({
    position: '',
    positioning: 'top-center',
    element: document.createElement('div'),
    stopEvent: false,
    className: `marker input`
  })
  


  const renderer = new HTMLRenderer(map)
  const sidebar = document.getElementById('sidebar')

  fetch('https://dkw6qugbfeznv.cloudfront.net/')
    .then(response => response.json())
    .then(results => {
      stations = results.features
      results.features.forEach(location => {
        const station = new Station(location)
        sidebar.appendChild(renderer.createStationInfoDiv(station, {
          div: ['px-3', 'py-4', 'border-b', 'border-gray-300', 'flex', 'flex-col', 'hover:bg-gray-100', 'hover:cursor-pointer'],
          title: ['text-xl', 'font-bold'],
          paragraph: ['text-base']
        }))
        const newMarker = new Overlay({
          position: fromLonLat([station.coordinates.longitude, station.coordinates.latitude]),
          positioning: 'top-left',
          element: document.createElement('div'),
          stopEvent: false,
          className: `marker ${station.status}`
        })
        markers.push(newMarker)
        map.addOverlay(newMarker)
      })
    })

    addressInput.addEventListener('keydown', ({key, target}) => {
    if (key == 'Enter') {
      const address = target.value.replace(/\s/g, '+')
      markers.forEach(marker => map.removeOverlay(marker))
      fetch(`https://api.geocod.io/v1.4/geocode?api_key=596e1857bc5e3d3ad58c153b0e55d0abca91890&fields=&q=${address},+Philadelphia,+PA`)
        .then(response => response.json())
        .then(({results}) => {
         markers.forEach(marker => map.removeOverlay(marker))
          const location = results[0].location
          map.removeOverlay(userMarker)
          userMarker.setPosition(fromLonLat([location.lng, location.lat]))
          map.addOverlay(userMarker)
          map.values_.view.animate({
            center: fromLonLat([location.lng, location.lat]),
            zoom: 18
          })
          // Ordering by closest to user input:
          const orderedStations = stations.sort((a, b) => {
            return haversine({ lat: location.lat, lon: location.lng }, { lat: a.geometry.coordinates[1], lon: a.geometry.coordinates[0]}) > 
                   haversine({ lat: location.lat, lon: location.lng }, { lat: b.geometry.coordinates[1], lon: b.geometry.coordinates[0]})
          })
          sidebar.innerHTML = ''
          orderedStations.slice(0, 5).forEach(kiosk => {
            const station = new Station(kiosk)
            sidebar.appendChild(renderer.createStationInfoDiv(station, {
              div: ['px-3', 'py-4', 'border-b', 'border-gray-300', 'flex', 'flex-col', 'hover:bg-gray-100', 'hover:cursor-pointer'],
              title: ['text-xl', 'font-bold'],
              paragraph: ['text-base']
            }))
            const newMarker = new Overlay({
              position: fromLonLat([station.coordinates.longitude, station.coordinates.latitude]),
              positioning: 'top-left',
              element: document.createElement('div'),
              stopEvent: false,
              className: `marker ${station.status}`
            })
            markers.push(newMarker)
            map.addOverlay(newMarker)
          })
        })    
    }
  })
})




