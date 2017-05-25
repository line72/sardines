import React, { Component } from 'react';
import SMap from './smap';
import CityList from './citylist';
import Builder from './builder';

import './App.css';
import 'leaflet/dist/leaflet.css';

class App extends Component {
    constructor() {
        super();

        this.state = {
            cities: [
                {name: 'Paris', density: 21603},
                {name: 'Manhattan', density: 18903},
                {name: 'Copenhagen', density: 2052},
            ],
            population: {city: 212461,
                         metro: 1200000
                        },
            useMetroPopulation: false,
            features: null,
            builder: new Builder(),
        }
    }

    getPopulation() {
        if (this.state.useMetroPopulation) {
            return this.state.population.metro;
        } else {
            return this.state.population.city;
        }
    }
         
    handleCityClick(city) {
        console.log("city was clicked " + city.name + " " + city.density);
        console.log("using birmingham population: " + this.getPopulation());

        // do a build
        this.state.builder.build(this.getPopulation(), city.density, (features) => {
            this.setState({
                features: features
            });
        });
    }
    
    render() {
        return (
            <div className="App">
              <SMap features={this.state.features} />
              <CityList cities={this.state.cities} onClick={(city) => this.handleCityClick(city)}/>
            </div>
        );
    }
}

export default App;
