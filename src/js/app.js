import Station from './Station'
import IndegoMap from './IndegoMap'
import HTMLRenderer from './HTMLRenderer'
import {center, boundaries} from './Philadelphia'
import Weather from './Weather'
document.addEventListener('DOMContentLoaded', () => {
  const indegoMap     = new IndegoMap(center, boundaries)
  const renderer      = new HTMLRenderer(indegoMap.map)
  const addressInput  = document.querySelector('#address')
  const sidebar       = document.querySelector('#sidebar_content')
  const moreButton    = document.querySelector('#more')
  const emptyCheckbox = document.querySelector('#empty')
  const fullCheckbox  = document.querySelector('#full')

  let getStationsWithAvailableBikes = false
  let getStationsWithAvailableDocks = false
  const weather = new Weather
  fullCheckbox.checked = false
  emptyCheckbox.checked = false


  fetch('https://dkw6qugbfeznv.cloudfront.net/')
    .then(response => response.json())
    .then(results => {
      results.features.forEach(station => indegoMap.stations.push(new Station(station)))
      indegoMap.stations.forEach(station => {
        sidebar.appendChild(renderer.createStationInfoDiv(station))
        indegoMap.addNewMarker(station.coordinates, station.status)
      })
      moreButton.classList.add('hidden')
    })

  addressInput.addEventListener('keydown', ({key, target}) => {
    if (key == 'Enter') {
      const address = target.value.replace(/\s/g, '+')
      fetch(`https://api.geocod.io/v1.4/geocode?api_key=596e1857bc5e3d3ad58c153b0e55d0abca91890&fields=&q=${address},+Philadelphia,+PA`)
        .then(response => response.json())
        .then(({results}) => {
          indegoMap.reset()
          indegoMap.removeAllMarkers()
          const location = { latitude: results[0].location.lat, longitude: results[0].location.lng }
          indegoMap.addUserMarker(location)
          indegoMap.moveTo(location)
          // Clear sidebar of previous stations
          sidebar.innerHTML = ''
          
          if (getStationsWithAvailableBikes) {
            indegoMap.getStationsWithAvailableBikes()
          }

          if (getStationsWithAvailableDocks) {
            indegoMap.getStationsWithAvailableDocks()
          }

          indegoMap.paginatedStations().forEach(station => {
            sidebar.appendChild(renderer.createStationInfoDiv(station))
            indegoMap.addNewMarker(station.coordinates, station.status)
          })
          if (indegoMap.noMoreStationsToDisplay) {
            moreButton.classList.add('hidden')
          } else {
            moreButton.classList.remove('hidden')
          }
        })    
    }
  })

  moreButton.addEventListener('click', () => {
    indegoMap.paginatedStations().forEach(station => {
      sidebar.appendChild(renderer.createStationInfoDiv(station))
      indegoMap.addNewMarker(station.coordinates, station.status)
    })
    if (indegoMap.noMoreStationsToDisplay) {
      moreButton.classList.add('hidden')
    } else {
      moreButton.classList.remove('hidden')
    }
  })

  emptyCheckbox.addEventListener('change', event => {
    if (event.target.checked) {
      fullCheckbox.checked = false
      fullCheckbox.disabled = true
    } else {
      fullCheckbox.disabled = false
    }
    getStationsWithAvailableBikes = !getStationsWithAvailableBikes
  })

  fullCheckbox.addEventListener('change', event => {
    if (event.target.checked) {
      emptyCheckbox.checked = false
      emptyCheckbox.disabled = true
    } else {
      emptyCheckbox.disabled = false
    }
    getStationsWithAvailableDocks = !getStationsWithAvailableDocks
  })
})
