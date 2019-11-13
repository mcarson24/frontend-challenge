import Station from './Station'
import IndegoMap from './IndegoMap'
import HTMLRenderer from './HTMLRenderer'
import {center, boundaries} from './Philadelphia'
import Weather from './Weather'

const DEFAULT_ADDRESS = '1168 E. Passyunk Ave.'

document.addEventListener('DOMContentLoaded', () => {
  const indegoMap           = new IndegoMap(center, boundaries)
  const renderer            = new HTMLRenderer(indegoMap)
  const addressInput        = document.querySelector('#address')
  const sidebar             = document.querySelector('#sidebar_content')
  const showMoreButton      = document.querySelector('#more')
  const emptyCheckbox       = document.querySelector('#empty')
  const fullCheckbox        = document.querySelector('#full')
  const weatherIceon        = document.querySelector('#weatherIcon')
  const weatherDetails      = document.querySelector('#details')
  const weatherTemperature  = document.querySelector('#temp')
  const weatherMessage      = document.querySelector('#message')

  let getStationsWithAvailableBikes = false
  let getStationsWithAvailableDocks = false

  fullCheckbox.checked = false
  emptyCheckbox.checked = false
  addressInput.value = ''

  // Get weather information from OpenWeatherMap
  fetch('https://api.openweathermap.org/data/2.5/weather?q=Philadelphia,PA,US&units=imperial&appid=280846fd1decf39edf467bfc652a7e92')
    .then(response => response.json())
    .then(({main, weather, wind}) => {
      const weatherCenter = new Weather(main.temp, weather[0], wind)
      weatherTemperature.prepend(renderer.createParagraph(weatherCenter.temperature))
      weatherDetails.appendChild(renderer.createParagraph(weather[0].main))
      weatherIcon.src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`
      weatherMessage.innerHTML = weatherCenter.message
    })

  // Get bike share information from 'https://www.rideindego.com/stations/json/'
  // Setup map markers and sidebar information for each station
  fetch('https://dkw6qugbfeznv.cloudfront.net/')
    .then(response => response.json())
    .then(results => {
      results.features.forEach(station => indegoMap.stations.push(new Station(station)))
      indegoMap.stations.forEach(station => {
        sidebar.appendChild(renderer.createStationInfoDiv(station))
        indegoMap.addNewMarker(station.coordinates, station.status)
      })
      showMoreButton.classList.add('hidden')
    })

  addressInput.addEventListener('keydown', ({key, target}) => {
    if (key == 'Enter') {
      if (!target.value.trim()) target.value = DEFAULT_ADDRESS
      const address = target.value.trim().replace(/\s/g, '+')
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
            showMoreButton.classList.add('hidden')
          } else {
            showMoreButton.classList.remove('hidden')
          }
        })    
    }
  })

  showMoreButton.addEventListener('click', () => {
    indegoMap.paginatedStations().forEach(station => {
      sidebar.appendChild(renderer.createStationInfoDiv(station))
      indegoMap.addNewMarker(station.coordinates, station.status)
    })
    if (indegoMap.noMoreStationsToDisplay) {
      showMoreButton.classList.add('hidden')
    } else {
      showMoreButton.classList.remove('hidden')
    }
  })

  emptyCheckbox.addEventListener('change', event => {
    let amountToShow = null
    if (indegoMap.nextStationToShow > 0) {
      amountToShow = indegoMap.nextStationToShow
    } else {
      amountToShow = 140
    }
    indegoMap.reset()
    indegoMap.removeAllMarkers()
    sidebar.innerHTML = ''
    if (event.target.checked) {
      fullCheckbox.checked = false
      fullCheckbox.disabled = true
    } else {
      fullCheckbox.disabled = false
    }
    getStationsWithAvailableBikes = !getStationsWithAvailableBikes
   
    if (getStationsWithAvailableBikes) {
      indegoMap.orderedStations = indegoMap.stations.filter(station => {
        return station.hasAvailableBikes
      })
    }
    indegoMap.paginatedStations(amountToShow).forEach(station => {
      sidebar.appendChild(renderer.createStationInfoDiv(station))
      indegoMap.addNewMarker(station.coordinates, station.status)
    })

    if (amountToShow == 0) {
      moreButton.classList.add('hidden')
    }
  })

  fullCheckbox.addEventListener('change', event => {
    let amountToShow = null
    if (indegoMap.nextStationToShow > 0) {
      amountToShow = indegoMap.nextStationToShow
    } else {
      amountToShow = 140
    }
    indegoMap.reset()
    indegoMap.removeAllMarkers()
    sidebar.innerHTML = ''
    if (event.target.checked) {
      empty.checked = false
      empty.disabled = true
    } else {
      empty.disabled = false
    }
    getStationsWithAvailableDocks = !getStationsWithAvailableDocks
   
    if (getStationsWithAvailableDocks) {
      indegoMap.orderedStations = indegoMap.stations.filter(station => {
        return station.hasAvailableDocks
      })
    }
    indegoMap.paginatedStations(amountToShow).forEach(station => {
      sidebar.appendChild(renderer.createStationInfoDiv(station))
      indegoMap.addNewMarker(station.coordinates, station.status)
    })

    if (amountToShow == 0) {
      moreButton.classList.add('hidden')
    }
  })
})
