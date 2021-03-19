import {Component} from 'react'
import axios from 'axios'
import SelectUnits from './SelectUnits'

const apiKey = process.env.REACT_APP_WEATHER_API_KEY

class App extends Component {

  state = {
    city: '',
    units: 'metric',
    weatherTemp: '',
    mainWeather: '',
    showWeatherInfo: false
  }

  changeUnits = (unitsNew) => {
    this.setState({units: unitsNew})
  }

  currentWeather = () => {
    axios.get('https://api.openweathermap.org/data/2.5/weather?q=' + this.state.city + '&units=' + this.state.units + '&appid=' + apiKey)
    .then(response => {
      console.log(response.data.main.temp)
      console.log(response.data.weather[0].main)
      this.setState({
        weatherTemp: response.data.main.temp,
        weatherMain: response.data.weather[0].main,
        showWeatherInfo: true
      }) 
    })
  }

  renderOutput = () => {
    if (this.state.showWeatherInfo) {
      return (
      <div>
        <span>{this.state.weatherTemp}, {this.state.weatherMain}</span>
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
