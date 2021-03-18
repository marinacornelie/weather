import {Component} from 'react'
import axios from 'axios';

const apiKey = process.env.REACT_APP_WEATHER_API_KEY

class App extends Component {

state = {
    city: '',
    weatherTemp: '',
    mainWeather: '',
    showWeatherInfo: false
}

currentWeather = () => {
  axios.get('https://api.openweathermap.org/data/2.5/weather?q=' + this.state.city + '&units=metric&appid=' + apiKey)
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
