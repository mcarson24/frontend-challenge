<template>
	<div id="weather" class="weather-widget py-2 px-4 z-10 rounded-lg bg-gray-300 shadow-lg text-gray-700 absolute opacity-50 								 hover:opacity-100">
			<div class="flex">
				<img :src="weatherIcon">
				<div class="flex flex-col justify-center">
					<div class="text-3xl flex">{{ temperature }}&deg;</div>
					<!-- <div>{{ this.weather.wind.speed }}mph <span class="font-bold">{{cardinalDirection}}</span></div> -->
		      <span v-text="weather.weather.description"></span>
				</div>
			</div>
			<div v-show="weatherMessage" class="px-4 flex items-center">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="mr-2 h-8 w-8 fill-current">
          <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 5h2v6H9V5zm0 8h2v2H9v-2z"/>
        </svg>
        {{ weatherMessage}}
			</div>
		</div>
</template>

<script>
	const Windrose = require('windrose')

	export default {
		data() {
			return {
				weather: {
					main: '',
					weather: '',
					wind: '',
				}
			}
		},
		mounted() {
			this.getWeather()
		},
		methods: {
			getWeather() {
				fetch('https://api.openweathermap.org/data/2.5/weather?q=Philadelphia,PA,US&units=imperial&appid=280846fd1decf39edf467bfc652a7e92')				
					.then(response => response.json())
			    .then(({main, weather, wind}) => {
			    	this.weather.main = main
			    	this.weather.weather = weather[0]
			    	this.weather.wind = wind
			    })
			}
		},
		computed: {
			temperature() {
				return Math.round(this.weather.main.temp)
			},
			weatherIcon() {
				return `https://openweathermap.org/img/wn/${this.weather.weather.icon}@2x.png`
			},
			cardinalDirection() {
				return Windrose.getPoint(this.weather.wind.deg, { depth: 2}).symbol
			},
			weatherMessage() {
				if (this.weather.main.temp > 90) return "It's getting warm, make sure you stay hydrated out there."
				if (this.weather.main.temp < 32) return 'Watch out for ice!'
				if (this.weather.wind.speed > 25) return "It's really windy, be careful!"
				switch(this.weather.weather.main) {
					case 'Snow':
						return "It's cold and slippery out there, be careful!"
					case 'Rain':
					case 'Drizzle':
						return 'It might be slippery out there, be careful!'
					case 'Tornado':
						return "It's not worth it. Stay home, stay safe."
					case 'Fog':
						return 'Visibility is down, be careful!'
					case 'Thunderstorm':
						return "It's dangerous out there. Bike with extreme caution."
				}
			}
		}
	}
</script>
