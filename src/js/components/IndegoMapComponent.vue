<template>
	<div id="map" class="map relative">
		<weather-widget></weather-widget>
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
    	this.shared.stations = this.shared.stations.map(station => {
    		return new Station(station)
    	})
    	this.shared.stations.map(station => {
    		this.shared.indegoMap.addNewMarker(station.coordinates, station.status)
    	})
		},
		methods: {

		},
		computed: {
		}
	}
</script>
