import {Component} from 'react'
import axios from 'axios'
import SelectUnits from './SelectUnits'

const apiKey = process.env.REACT_APP_WEATHER_API_KEY

class App extends Component {
  state = {
    city: '',
    units: 'metric',
    weatherInfo: '',
    forecastInfo: [ ],
    errorMessage: '',
    timezone: ''
  }

  changeUnits = (unitsNew) => {
    this.setState({units: unitsNew})
  }

  showError = (error) => {
    if (error.response.status === 404) {
      this.setState({
        errorMessage: 'Sorry, unknown city!',
      })
    } else {
      this.setState({
        errorMessage:'Did you forget to fill in something?',
      })
    }
  }

  resetState = () => {
    this.setState ({
      weatherInfo: '',
      forecastInfo: [ ],
      errorMessage: ''
    })
  }

  currentWeather = () => {
   this.resetState();
    axios.get('https://api.openweathermap.org/data/2.5/weather?q=' + this.state.city + '&units=' + this.state.units + '&appid=' + apiKey)
    .then(response => {
      this.setState({
        weatherInfo: `It's ${response.data.main.temp} degrees and the weather description is: ${response.data.weather[0].description}`
      }) 
    })
    .catch((error) => {
      this.showError(error);
    })
  } 

  forecastWeather = () => {
    this.resetState();
    axios.get('https://api.openweathermap.org/data/2.5/forecast?q=' + this.state.city + '&units=' + this.state.units + '&appid=' + apiKey)
    .then(response => {
      this.setState({
        forecastInfo: this.formatWeather(response.data)
      }) 
    })
    .catch((error) => {
      this.showError(error);
    })
  }

  formatWeather = (forecastInfo) => {
    this.setState({
      timezone: forecastInfo.city.timezone + new Date().getTimezoneOffset()*60
    }) 
    const datalist = forecastInfo.list
    const firstItem = new Date ((datalist[0].dt + this.state.timezone)*1000).getDate();
    const lastItem = new Date ((datalist[datalist.length-1].dt + this.state.timezone)*1000).getDate();
    var days = [];
    for (var i = firstItem; i <= lastItem; i++) {
        days.push(i);
    }
    const parsedForecastInfo = days.map((day) => {
      return datalist.filter((item) => {
        const date = new Date((item.dt + this.state.timezone)*1000).getDate();
        return day === date 
      })
    })
    return parsedForecastInfo
  }

  formatDate = (weatherItem) => {
    var date = new Date((weatherItem.dt + this.state.timezone)*1000);
    var month = date.getMonth()+1;
    var day = date.getDate();
    return day + '-' + month
  } 

  formatTime = (time) => {
    var date = new Date((time + this.state.timezone)*1000);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    
    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
      return formattedTime
  }
 
  render() {   
    return (
      <div className="container d-flex flex-column">
        <div className="mt-4">
          <div className="d-flex m-2">
            <span className="m-1">Show me the weather in</span>
            <input placeholder="city name" onChange={event => this.setState({city: event.target.value})}/>
          </div>
          <div className="d-flex m-2">
            <span className="m-1">I prefer</span>
            <SelectUnits changeUnits={this.changeUnits}/>
          </div> 
        </div>
        <div className="mb-4 m-2">
          <button className="m-1 btn btn-sm btn-outline-dark" onClick={this.currentWeather}>Show me the current weather!</button>
          <button className="m-1 btn btn-sm btn-outline-dark" onClick={this.forecastWeather}>Show me the 5 day weather forecast!</button>
        </div>
        <div> 
          <div className="card">{this.state.weatherInfo} {this.state.errorMessage}</div>
            <ul>
            {this.state.forecastInfo.map((itemList, index) => ( 
              <li key={index} className="card"> Date: {this.formatDate(itemList[0])}
                {itemList.map((item) => (
                  <div key={item.dt}>
                    <span className="m-1">Time: {this.formatTime(item.dt)}</span> 
                    <span className="m-1">Degrees: {item.main.temp}, Description: {item.weather[0].description}</span>
                  </div>
                ))}    
              </li> 
            ))} 
          </ul>  
        </div>
      </div>
    )
  }
}

export default App;
