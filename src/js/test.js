import Station from './Station'
import IndegoMap from './IndegoMap'
import HTMLRenderer from './HTMLRenderer'
import {center, boundaries} from './Philadelphia'

document.addEventListener('DOMContentLoaded', () => {
  const indegoMap     = new IndegoMap(center, boundaries)
  const renderer      = new HTMLRenderer(indegoMap.map)
  const addressInput  = document.querySelector('#address')
  const sidebar       = document.querySelector('#sidebar_content')
  const moreButton    = document.querySelector('#more')
  const emptyCheckbox = document.querySelector('#empty')
  const fullCheckbox  = document.querySelector('#full')

  let getEmptyStationsOnly = false
  let getFullStationsOnly = false

  fetch('https://dkw6qugbfeznv.cloudfront.net/')
    .then(response => response.json())
    .then(results => {
      results.features.forEach(station => indegoMap.stations.push(new Station(station)))
      indegoMap.stations.forEach(station => {
        sidebar.appendChild(renderer.createStationInfoDiv(station))
        indegoMap.addNewMarker(station.coordinates, station.status)
      })
    })

  addressInput.addEventListener('keydown', ({key, target}) => {
    if (key == 'Enter') {
      const address = target.value.replace(/\s/g, '+')
      fetch(`https://api.geocod.io/v1.4/geocode?api_key=596e1857bc5e3d3ad58c153b0e55d0abca91890&fields=&q=${address},+Philadelphia,+PA`)
        .then(response => response.json())
        .then(({results}) => {
          indegoMap.removeAllMarkers()
          const location = { latitude: results[0].location.lat, longitude: results[0].location.lng }
          indegoMap.addUserMarker(location)
          indegoMap.moveTo(location)
          // Clear sidebar of previous stations
          sidebar.innerHTML = ''
          console.log(getEmptyStationsOnly)
          if (getEmptyStationsOnly) {
            console.log('hello')
            indegoMap.getEmptyStationsOnly()
          }

          if (getFullStationsOnly) {
            indegoMap.getFullStationsOnly()
          }

          indegoMap.paginatedStations().forEach(station => {
            sidebar.appendChild(renderer.createStationInfoDiv(station))
            indegoMap.addNewMarker(station.coordinates, station.status)
          })
        })    
    }
  })

  moreButton.addEventListener('click', () => {
    indegoMap.paginatedStations().forEach(station => {
      sidebar.appendChild(renderer.createStationInfoDiv(station))
      indegoMap.addNewMarker(station.coordinates, station.status)
    })
  })

  emptyCheckbox.addEventListener('change', event => {
    if (event.target.checked) {
      fullCheckbox.checked = false
      fullCheckbox.disabled = true
    } else {
      fullCheckbox.disabled = false
    }
    getEmptyStationsOnly = !getEmptyStationsOnly
  })

  fullCheckbox.addEventListener('change', event => {
    if (event.target.checked) {
      emptyCheckbox.checked = false
      emptyCheckbox.disabled = true
    } else {
      emptyCheckbox.disabled = false
    }
    getFullStationsOnly = !getFullStationsOnly
  })
})
