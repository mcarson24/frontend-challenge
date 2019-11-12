export default class Weather {
	constructor() {
		this.weather = ''
		this.wind = ''
		this.main = ''
		this.get()
		this.message = ''
	}

	get() {
		fetch('https://api.openweathermap.org/data/2.5/weather?q=Philadelphia,PA,US&units=imperial&appid=280846fd1decf39edf467bfc652a7e92')
			.then(response => response.json())
			.then(({main, weather, wind}) => {
				this.weather = weather[0]
				this.wind = wind
				this.main = main
				this.setMessage()
			})
	}

	setMessage() {
		if (this.main.temp > 90) this.message = "It's getting warm, make sure you stay hydrated out there."
		if (this.main.temp < 32) this.message = 'Watch out for ice!'
		if (this.wind.speed > 25) this.message = "It's really windy, be careful!"

		switch(this.weather.main) {
			case 'Snow':
				this.message = "It's cold and slippery out there, be careful!"
				break
			case 'Rain':
			case 'Drizzle':
				this.message = 'It might be slippery out there, be careful!'
				break
			case 'Tornado':
				this.message = "It's not worth it. Stay home, stay safe."
				break
			case 'Fog':
				this.message = 'Visibility is down, be careful!'
				break
			case 'Thunderstorm':
				this.message = "It's dangerous out there. Bike with extreme caution."
				break
		}
	}
}
// temperature < 32
// 		it might be icy out there
// 	temperature > 80
// 		it's getting warm make sure you stay hydrated out there
// 	temperature > 100 
// 		it's too hot
// 	snow
// 		it's cold and slippery
// 	rain, drizzle
// 		it might be slippery
// 	thunderstorm
// 		its dangerous
// 	fog
// 		visibility is down
// tornado
// 	batten down the hatches, it's just not worth it
// wind speed > 25
// 	be careful it is windy out there
