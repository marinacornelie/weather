import React, {Component} from 'react'

class SelectUnits extends Component {

  render () {  
    return (
      <select className="p-2 form-select" onChange={event => this.props.changeUnits(event.target.value)}>
        <option value='metric'>Celsius</option>
        <option value='imperial'>Fahrenheit</option>
      </select>  
    );
  }
}

export default SelectUnits;