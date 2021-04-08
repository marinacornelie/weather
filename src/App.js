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
    errorMessage: ''
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
        weatherInfo: `${response.data.main.temp}, ${response.data.weather[0].main}`
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
        forecastInfo: response.data.list
      }) 
    })
    .catch((error) => {
      this.showError(error);
    })
  }
  
  render() {   
    return (
      <div>
        <div>
          <span>Show me the weather in</span>
          <input placeholder="city name" onChange={event => this.setState({city: event.target.value})}/>
          <SelectUnits changeUnits={this.changeUnits}/>
          <button onClick={this.currentWeather}>Show me the current weather!</button>
          <button onClick={this.forecastWeather}>Show me the 5 day weather forecast!</button>
        </div>
        <div>{this.state.weatherInfo}</div>
        <ul>
          {this.state.forecastInfo.map((item) => ( 
            <li key={item.dt}>{item.dt_txt}, {item.main.temp}, {item.weather[0].main}</li>
          ))}       
        </ul>
        <div>{this.state.errorMessage}</div>
      </div>
    )
  }
}

export default App;
