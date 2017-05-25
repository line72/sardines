import React from 'react';

class CityList extends React.Component {
    render() {
        const cities = this.props.cities.map((city, step) => {
            return (
                <li key={city.name}>
                  <a href='#' onClick={() => this.props.onClick(city)}>{city.name}</a>
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
