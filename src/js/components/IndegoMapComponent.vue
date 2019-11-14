<template>
	<div id="map" class="map relative">
		<div id="weather" class="weather-widget py-2 px-4 z-10 rounded-lg bg-gray-300 shadow-lg text-gray-700 absolute opacity-50 								 hover:opacity-100">
			<div class="flex">
				<img id="weatherIcon" src="">
				<div id="details" class="flex flex-col justify-center">
					<div id="temp" class="text-3xl flex">&deg;</div>
				</div>
			</div>
			<div id="message" class="px-4 flex items-center"></div>
		</div>
	</div>	
</template>

<script>
	import IndegoMap from '../IndegoMap'
	import {center, boundaries} from '../Philadelphia'
	
	export default {
		data() {
			return {
				shared: this.$root.$data.sharedData,
			}
		},
		mounted() {
    	this.shared.indegoMap = new IndegoMap(center, boundaries)

			this.shared.stations.map(station => {
				console.log(this.shared.stations)
			})
        // this.shared.indegoMap.addNewMarker(station.coordinates, station.status)
		}
	}
</script>
