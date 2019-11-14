<template>
	<div id="sidebar" class="sidebar overflow-scroll z-40 shadow-2xl md:w-2/5 md:w-1/3">
		<div id="sidebar_content" class="flex flex-col items-center">
			<div v-for="station in shared.filteredStations" 
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
			<button v-show="moreStationsToShow" class="mr-8 underline text-purple-900">More</button>
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
				stations: []
			}
		},
		created() {
			if (this.shared.indegoMap.nextStationToShow > 0) {
				this.shared.amountToShow = this.shared.indegoMap.nextStationToShow
			} else {
				this.shared.amountToShow = 140
			}
		},
		updated() {
			this.paginate()
		},
		methods: {
			goto(station) {
				this.shared.indegoMap.map.values_.view.animate({
					center: fromLonLat([station.coordinates.longitude, station.coordinates.latitude]),
					zoom: 18
				})
			},
			paginate() {
				// this.stations = this.shared.filteredStations.slice(0, this.shared.amountToShow)
				// this.shared.amountToShow += 5
			},
			bikesAvailableSentence(station) {
				return `${station.bikesAvailable} ${pluralize('Bikes', station.bikesAvailable)}`
			},
			docksAvailableSentence(station) {
				return `${station.docksAvailable} ${pluralize('Docks', station.docksAvailable)}`
			}
		},
		computed: {
			moreStationsToShow() {
				return this.shared.amountToShow == 0
			}
		}
	}
</script>
