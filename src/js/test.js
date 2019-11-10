import Map from 'ol/Map';
import Overlay from 'ol/Overlay';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import {fromLonLat} from 'ol/proj';
import OSM from 'ol/source/OSM';
import Popup from 'ol-popup';
import HTMLRenderer from './HTMLRenderer'
import Station from './Station'
import {mapBounds} from './Philadelphia'

const map = new Map({
  layers: [
    new TileLayer({
      source : new OSM()
    })
  ],
  target: 'map',
  view: new View({
    center: fromLonLat([-75.16267, 39.95238]),
    zoom: 14,
    extent: mapBounds
  })
});

const renderer = new HTMLRenderer(map)

fetch('https://dkw6qugbfeznv.cloudfront.net/')
  .then(response => response.json())
  .then(results => {
    results.features.forEach(location => {
      const station = new Station(location)
      const sidebar = document.getElementById('sidebar')
      const stationInformation = renderer.createStationInformationDiv(station, {
        div: ['px-3', 'py-4', 'border-b', 'border-gray-300', 'flex', 'flex-col', 'hover:bg-gray-100', 'hover:cursor-pointer'],
        title: ['text-2xl', 'font-bold'],
        paragraph: ['text-lg']
      })
      sidebar.appendChild(stationInformation)
      map.addOverlay(new Overlay({
        position: fromLonLat([station.coordinates.longitude, station.coordinates.latitude]),
        positioning: 'top-left',
        element: document.createElement('div'),
        stopEvent: false,
        className: `marker ${station.status}`
      }))
    })
  })
