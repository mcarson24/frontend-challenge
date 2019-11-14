<template>
	<div id="map" class="map relative">
		<weather-widget></weather-widget>
		<p class="hidden" v-text="shared.filteredStations[0]"></p>
	</div>	
</template>

<script>
	import IndegoMap from '../IndegoMap'
	import Station from '../Station'
	import {center, boundaries} from '../Philadelphia'
	import WeatherWidget from './WeatherWidget.vue'
	
	export default {
		components: { WeatherWidget },
		data() {
			return {
				shared: this.$root.$data.sharedData,
			}
		},
		mounted() {
    	this.shared.indegoMap = new IndegoMap(center, boundaries)
    	this.updateStations()
		},
		updated() {
			this.renderMarkers()
		},
		methods: {
			renderMarkers() {
				this.shared.filteredStations.map(station => {
					this.shared.indegoMap.addNewMarker(station.coordinates, station.status)
				})
			},
			updateStations() {
				fetch('https://dkw6qugbfeznv.cloudfront.net/')
    		.then(response => response.json())
    		.then(results => {
    			let stations = results['features']
    			stations = stations.map(station => new Station(station))
    			this.shared.stations = stations
    			this.shared.filteredStations = stations
    		})
			}
		},
		computed: {
		}
	}
</script>
