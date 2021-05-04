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
        weatherInfo: response.data,
        timezone: response.data.timezone + new Date().getTimezoneOffset()*60
      }) 
    })
    .catch((error) => {
      this.showError(error);
    })
  } 

 showWeather = () => {
    if (this.state.weatherInfo) {
      return (
        <div className="d-flex flex-column card p-2">
          <table className="table table-borderless ms-2">
            <tbody>
              <tr>
                <td className="text-start">{this.formatTime(this.state.weatherInfo.dt)}</td> 
                <td className="text-start">{this.state.weatherInfo.main.temp}°</td>
                <td className="text-end">{this.showIcon(this.state.weatherInfo.weather[0].icon)}</td>
                <td className="text-start">{this.state.weatherInfo.weather[0].description}</td>               
              </tr>
            </tbody>
          </table>
        </div>
      )
    }   
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
    const daylist = datalist.map((item) => {
      return new Date ((item.dt + this.state.timezone)*1000).getDate();
    })
    const days = daylist.filter((v, i, a) => a.indexOf(v) === i);  
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
    var weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    ]
    var n = weekday[date.getDay()];    
    var month = date.getMonth()+1;
    var day = date.getDate();
    return n + ' ' + day + '-' + month
  } 

  formatTime = (time) => {
    var date = new Date((time + this.state.timezone)*1000);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
      return formattedTime
  }
  
  showIcon = (icon) => {
    return (
    <img src={`http://openweathermap.org/img/w/${icon}.png`} alt="icon weather" />
    )
  }
 
  render() {   
    return (
      <div className="container d-flex flex-column bg-color">
        <div className="mt-4">
          <div className="d-flex m-3">
            <input className="form-control p-3" placeholder="city name, state code, country code (ISO)" onChange={event => this.setState({city: event.target.value})}/>
          </div>
          <div className="d-flex m-3 mt-4 align-items-center">
            <span className="m-3 p-3 font-lg fw-bold">I prefer</span>
            <SelectUnits changeUnits={this.changeUnits}/>
          </div> 
        </div>
        <div className="mb-4 m-3 mt-1">
          <button className="m-2 btn btn-lg" onClick={this.currentWeather}>Current weather</button>
          <button className="m-2 btn btn-lg" onClick={this.forecastWeather}>5 day weather forecast</button>
        </div>
        <div>   
          <div className="m-3 p-2 font-lg">{this.showWeather()} {this.state.errorMessage}</div>
          <div>
            {this.state.forecastInfo.map((itemList, index) => ( 
              <div key={index} className="card margin padding text-center pb-4">
                <span className="mt-4 mb-4 font-lg fw-bold">{this.formatDate(itemList[0])}</span>
                <table className="table table-borderless ms-2">
                {itemList.map((item) => (
                  <tbody>
                    <tr key={item.dt}>
                      <td className="text-start">{this.formatTime(item.dt)}</td> 
                      <td className="text-start">{item.main.temp}°</td>
                      <td className="text-end">{this.showIcon(item.weather[0].icon)}</td>
                      <td className="text-start">{item.weather[0].description}</td>               
                    </tr>
                  </tbody>
                ))}    
                </table>
              </div>
            ))} 
          </div>  
        </div>
      </div>
    )
  }
}

export default App;
