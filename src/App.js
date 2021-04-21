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
        weatherInfo: `Degrees: ${response.data.main.temp} Weather description: ${response.data.weather[0].description}`
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
      <div className="container d-flex flex-column bg-color">
        <div className="mt-4">
          <div className="d-flex m-3">
            <input className="form-control p-3" placeholder="city name, state code, country code (ISO)" onChange={event => this.setState({city: event.target.value})}/>
          </div>
          <div className="d-flex m-3 mt-4 align-items-center">
            <span className="m-2 font-lg">I prefer</span>
            <SelectUnits changeUnits={this.changeUnits}/>
          </div> 
        </div>
        <div className="mb-4 m-3 mt-1">
          <button className="m-2 btn btn-lg" onClick={this.currentWeather}>Current weather</button>
          <button className="m-2 btn btn-lg" onClick={this.forecastWeather}>5 day weather forecast</button>
        </div>
        <div>   
          <div className="p-3 font-lg">{this.state.weatherInfo} {this.state.errorMessage}</div>
          <div>
            {this.state.forecastInfo.map((itemList, index) => ( 
              <li key={index} className="card m-3 p-3 fw-bold align-items-center">{this.formatDate(itemList[0])}
                {itemList.map((item) => (
                  <div className="d-flex font-df m-1 column align-self-baseline" key={item.dt}>
                    <div>{this.formatTime(item.dt)}</div> 
                    <div className="ms-3">Degrees: {item.main.temp}</div> 
                    <div className="ms-3">Weather description: {item.weather[0].description}</div>
                  </div>
                ))}    
              </li> 
            ))} 
          </div>  
        </div>
      </div>
    )
  }
}

export default App;
