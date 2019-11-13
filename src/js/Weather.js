export default class Weather {
	constructor(temp, weather, wind) {
		this.temp = temp
		this.weather = weather
		this.wind = wind
	}

	get temperature() {
		return Math.ceil(this.temp)
	}

	get message() {
		if (this.temp > 90) return "It's getting warm, make sure you stay hydrated out there."
		if (this.temp < 32) return 'Watch out for ice!'
		if (this.wind.speed > 25) return "It's really windy, be careful!"
		switch(this.weather.main) {
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
