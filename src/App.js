import {Component} from 'react'
import axios from 'axios'
import SelectUnits from './SelectUnits'

const apiKey = process.env.REACT_APP_WEATHER_API_KEY

class App extends Component {

  state = {
    city: '',
    units: 'metric',
    weatherInfo: '',
    errorMessage: ''
  }

  changeUnits = (unitsNew) => {
    this.setState({units: unitsNew})
  }

  currentWeather = () => {
    this.setState({
      weatherInfo: '',
      errorMessage: ''
    })
    axios.get('https://api.openweathermap.org/data/2.5/weather?q=' + this.state.city + '&units=' + this.state.units + '&appid=' + apiKey)
    .then(response => {
      this.setState({
        weatherInfo: `${response.data.main.temp}, ${response.data.weather[0].main}`
      }) 
    })
    .catch((error) => {
      if (error.response.status === 404) {
        this.setState({
          errorMessage: 'Sorry, unknown city!',
        })
      } else {
        this.setState({
          errorMessage:'Did you forget to fill in something?',
        })
      }
    })
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
          <span>{this.state.weatherInfo || this.state.errorMessage }</span>
        </div>
       </div>
    )
  }
}

export default App;
