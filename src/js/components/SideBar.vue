<template>
	<div id="sidebar" class="sidebar overflow-scroll z-40 shadow-2xl md:w-2/5 md:w-1/3">
		<div id="sidebar_content" class="flex flex-col items-center">
			<div v-for="station in shared.stations" 
					 @click="goto(station)"
					 class="px-3 py-4 w-full border-b border-gray-300 flex flex-col hover:bg-gray-100 hover:cursor-pointer"
					 >
				<p class="text-xl font-bold mx-auto md:m-0" v-text="station.name"></p>
				<p class="text-base mx-auto md:m-0" v-text="station.address"></p>
				<p class="text-base mx-auto md:m-0">{{ bikesAvailableSentence(station) }} Available</p>
				<p class="text-base mx-auto md:m-0">{{ docksAvailableSentence(station) }} Available</p>
			</div>
		</div>
		<div class="flex justify-end py-3">
			<button id="more" class="mr-8 underline text-purple-900">More</button>
		</div>
	</div>
</template>

<script>
	import pluralize from 'pluralize'
	import Station from '../Station'
	import {fromLonLat} from 'ol/proj'

	export default {
		data() {
			return {
				shared: this.$root.$data.sharedData,
			}
		},
		created() {
			// fetch('https://dkw6qugbfeznv.cloudfront.net/')
			//   .then(response => response.json())
			//   .then(results => {
			//     results.features.forEach(station => this.shared.stations.push(new Station(station)))
			//   })
		},
		methods: {
			goto(station) {
				this.shared.map.map.values_.view.animate({
					center: fromLonLat([station.coordinates.longitude, station.coordinates.latitude]),
					zoom: 18
				})
			},
			bikesAvailableSentence(station) {
				return `${station.bikesAvailable} ${pluralize('Bikes', station.bikesAvailable)}`
			},
			docksAvailableSentence(station) {
				return `${station.docksAvailable} ${pluralize('Docks', station.docksAvailable)}`
			}
		}
	}
</script>
