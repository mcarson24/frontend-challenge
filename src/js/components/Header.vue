<template>
	<div class="header flex flex-col justify-center overflow-scroll items-center bg-purple-900">
		<div class="w-full md:w-3/5 flex flex-col items-center">
			<h1 class="mb-4 text-3xl md:text-4xl text-center text-gray-100">Find an Indego Station</h1>
			<input class="mb-4 px-2 w-1/2 h-10 rounded" 
						 type="text" 
						 placeholder="1168 E. Passyunk Ave"
						 v-model="address"
						 v-on:keydown.enter="gelocateAddress"
						 >
			<div class="w-1/2 flex flex-col items-center text-gray-100">
				<div class="w-full flex justify-between">
					<div class="flex flex-col items-center">
						<input type="checkbox" v-model="emptyIsClicked" @change="hasBikes" :disabled="fullIsClicked" class="h-5 w-5">
						<label for="empty" class="text-center">Stations with Bikes</label>
					</div>
					<div class="flex flex-col items-center">
						<input type="checkbox" v-model="fullIsClicked" @change="hasDocks" :disabled="emptyIsClicked" class="h-5 w-5">
						<label for="full" class="text-center">Stations with Open Docks</label>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Haversine from 'haversine-distance'

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
				this.shared.indegoMap.removeAllMarkers()
				this.shared.indegoMap.reset()

				if (this.emptyIsClicked) {
					this.shared.filteredStations = this.shared.filteredStations.filter(station => station.hasAvailableBikes)
				} else {
					this.shared.filteredStations = this.shared.stations
				}
			},
			hasDocks() {
				this.shared.indegoMap.removeAllMarkers()
				this.shared.indegoMap.reset()

				if (this.fullIsClicked) {
					this.shared.filteredStations = this.shared.filteredStations.filter(station => station.hasAvailableDocks)
				} else {
					this.shared.filteredStations = this.shared.stations
				}
			},
			gelocateAddress() {
				if (!this.escapedAddress.length) this.address = '1168 E. Passyunk Ave.'
				fetch(`https://api.geocod.io/v1.4/geocode?api_key=596e1857bc5e3d3ad58c153b0e55d0abca91890&fields=&q=${this.escapedAddress},+Philadelphia,+PA`)
        .then(response => response.json())
        .then(({results}) => {
         this.geolocatedAddress = { latitude: results[0].location.lat, longitude: results[0].location.lng }
         this.shared.indegoMap.reset()
         this.shared.indegoMap.addUserMarker(this.geolocatedAddress)
         this.shared.indegoMap.moveTo(this.geolocatedAddress)
         this.shared.amountToShow = 5
         this.shared.filteredStations = this.orderByClosest()
        })  
			},
			orderByClosest() {
				const address = this.geolocatedAddress
				return this.shared.stations.sort((a, b) => {
      		return Haversine({ lat: address.latitude, lon: address.longitude }, { lat: a.coordinates.latitude, lon: a.coordinates.longitude}) - 
      					 Haversine({ lat: address.latitude, lon: address.longitude }, { lat: b.coordinates.latitude, lon: b.coordinates.longitude})
		    	})
			}
		},
		computed: {
			escapedAddress() {
				return this.address.trim().replace(/\s/g, '+')
			}
		}
	}
</script>
