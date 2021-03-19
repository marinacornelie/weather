import {Component} from 'react'
import axios from 'axios'
import SelectUnits from './SelectUnits'

const apiKey = process.env.REACT_APP_WEATHER_API_KEY

class App extends Component {

  state = {
    city: '',
    units: 'metric',
    weatherTemp: '',
    mainWeather: ''
  }

  changeUnits = (unitsNew) => {
    this.setState({units: unitsNew})
  }

  currentWeather = () => {
    axios.get('https://api.openweathermap.org/data/2.5/weather?q=' + this.state.city + '&units=' + this.state.units + '&appid=' + apiKey)
    .then(response => {
      this.setState({
        weatherTemp: response.data.main.temp,
        weatherMain: response.data.weather[0].main,
        showWeatherInfo: true,
        showCityErrorInfo: false,
        showErrorInfo: false
      }) 
    })
    .catch((error) => {
        if (error.response.status === 404) {
          this.setState({
            showCityErrorInfo: true,
            showWeatherInfo: false,
            showErrorInfo: false
          })
        } else {
        this.setState({
          showErrorInfo: true,
          showWeatherInfo: false,
          showCityErrorInfo: false
        })
      }
    })
  }

  renderOutput = () => {
    if (this.state.showWeatherInfo) {
      return (
      <div>
        <span>{this.state.weatherTemp}, {this.state.weatherMain}</span>
      </div>
      )
    } else if (this.state.showErrorInfo) {
      return (
        <div>
        <span>Did you forget something to fill in?</span>
      </div>
      )
    } else if (this.state.showCityErrorInfo) {
      return (
        <div>
        <span>Sorry, unknown city!</span>
      </div>
      )
    }
  }

  render() {   
    return (
      <div>
        <div>
          <span>Show me the weather in</span>
          <input onChange={event => this.setState({city: event.target.value})}/>
          <SelectUnits changeUnits={this.changeUnits}/>
          <button onClick={this.currentWeather}>Go!</button>
        </div>
        <div>
          {this.renderOutput()}
        </div>
       </div>
    )
  }
}

export default App;
