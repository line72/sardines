import React from 'react';

class CityList extends React.Component {
    render() {
        const cities = this.props.cities.map((city, step) => {
            return (
                <li key={city.name}>
                  <button className="city" onClick={() => this.props.onClick(city)}>{city.name}</button>
		  <br /><span className="city-subtext"><b>{city.density}</b> people/km<sup>2</sup></span>
                </li>
            );
        });
        
        return (
            <ul>
              {cities}
            </ul>
        );
    }
}

export default CityList;
