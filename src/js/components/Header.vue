<template>
	<div class="header flex flex-col justify-center overflow-scroll items-center bg-purple-900">
		<div class="w-full md:w-3/5 flex flex-col items-center">
			<h1 class="mb-4 text-3xl md:text-4xl text-center text-gray-100">Find an Indego Station</h1>
			<div class="flex mb-4">
				<input class="flex-grow mr-2 px-2 w-1/2 h-10 rounded" 
							type="text" 
							placeholder="1168 E. Passyunk Ave"
							v-model="address"
							v-on:keydown.enter="gelocateAddress"
							>
				<button @click="gelocateAddress" class="px-2 rounded bg-purple-900 border border-white text-white">Go</button>
			</div>
			<div class="w-1/2 flex flex-col items-center text-gray-100">
				<div class="w-full mb-4 flex justify-between">
					<div class="flex flex-col items-center">
						<input type="checkbox" v-model="emptyIsClicked" @change="hasBikes" :disabled="fullIsClicked" class="h-5 w-5">
						<label for="empty" class="text-center">Stations with Bikes</label>
					</div>
					<div class="flex flex-col items-center">
						<input type="checkbox" v-model="fullIsClicked" @change="hasDocks" :disabled="emptyIsClicked" class="h-5 w-5">
						<label for="full" class="text-center">Stations with Open Docks</label>
					</div>
				</div>
				<button @click="reset" class="p-2 rounded bg-purple-900 border border-white">Reset Map</button>
			</div>
		</div>
	</div>
</template>

<script>
	import Haversine from 'haversine-distance'
	import { center } from '../Philadelphia'

	export default {
		data() {
			return {
				shared: this.$root.$data.sharedData,
				emptyIsClicked: false,
				fullIsClicked: false,
				address: '',
				geolocatedAddress: {}
			}
		},
		methods: {
			hasBikes() {
				this.shared.indegoMap.reset()

				if (this.emptyIsClicked) {
					this.removeEmptyStations()
					
				} else {
					this.shared.filteredStations = this.shared.stations
				}
			},
			hasDocks() {
				this.shared.indegoMap.reset()

				if (this.fullIsClicked) {
					this.removeFullStations();
					
				} else {
					this.shared.filteredStations = this.shared.stations
				}
			},
			gelocateAddress() {
				if (!this.escapedAddress.length) this.address = '1168 E. Passyunk Ave.'

				fetch(`/getAddress/${this.escapedAddress}`)
        .then(response => response.json())
        .then(({results}) => {
					this.geolocatedAddress = { latitude: results[0].location.lat, longitude: results[0].location.lng }
					this.shared.indegoMap.reset()
					this.shared.indegoMap.addUserMarker(this.geolocatedAddress)
					this.shared.indegoMap.moveTo(this.geolocatedAddress)
					this.shared.amountToShow = 5
					this.shared.filteredStations = this.orderByClosest()
					if (this.fullIsClicked) this.removeFullStations()
					if (this.emptyIsClicked) this.removeEmptyStations()
        })  
			},
			orderByClosest() {
				const address = this.geolocatedAddress
				return this.shared.stations.sort((a, b) => {
      		return Haversine({ lat: address.latitude, lon: address.longitude }, { lat: a.coordinates.latitude, lon: a.coordinates.longitude}) - 
      					 Haversine({ lat: address.latitude, lon: address.longitude }, { lat: b.coordinates.latitude, lon: b.coordinates.longitude})
		    	})
			},
			reset() {
				this.shared.indegoMap.reset()
				this.emptyIsClicked = this.fullIsClicked = false
				this.shared.filteredStations = this.shared.stations.filter(station => station.id)
				this.shared.amountToShow = 140
				this.shared.indegoMap.defaultView(center)
			},
			removeFullStations() {
				this.shared.filteredStations = this.shared.stations.filter(station => station.hasAvailableDocks)
			},
			removeEmptyStations() {
				this.shared.filteredStations = this.shared.stations.filter(station => station.hasAvailableBikes)
			}
		},
		computed: {
			escapedAddress() {
				return this.address.trim().replace(/\s/g, '+')
			}
		}
	}
</script>
