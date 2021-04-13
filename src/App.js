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
        forecastInfo: this.formatWeather(response.data.list)
      }) 
    })
    .catch((error) => {
      this.showError(error);
    })
  }

  formatWeather = (forecastInfo) => {
    const days = Array.from(Array(32).keys())
    return days.map((day) => {
      return forecastInfo.filter((item) => {
        const date = new Date(item.dt*1000).getDate();
        return day === date
      })
    })
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
              <li key={index} className="card">
                {itemList.map((item) => (
                  <div key={item.dt}>
                    <span className="m-1">Date and time: {item.dt_txt}</span> 
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
