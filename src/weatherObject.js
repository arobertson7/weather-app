class weatherForecast {
    // 'sevenDayForecast' is an array of dayForecast objects
    constructor(location, currentWeatherConditions, currentTemp, sevenDayForecast) {
        this.location = location;
        this.currentWeatherConditions = currentWeatherConditions;
        this.currentTemp = currentTemp;
        this.sevenDayForecast = sevenDayForecast;
    }
}

class dayForecast {
    constructor(date, description, tempMax, tempMin, iconString) {
        this.date = date;
        this.description = description;
        this.tempMax = tempMax;
        this.tempMin = tempMin;
        this.iconString = iconString;
    }
}

export { weatherForecast, dayForecast };