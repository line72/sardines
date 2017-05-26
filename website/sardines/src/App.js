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
                {name: 'London', density: 5164},
                {name: 'Chicago', density: 4614},
                {name: 'Munich', density: 4700},
                {name: 'Copenhagen', density: 2052},
                {name: 'Amsterdam', density: 3320},
                {name: 'Austin, TX', density: 1208},
                {name: 'Birmingham, AL', density: 562},
                {name: 'Nasvhille, TN', density: 512},
                {name: 'Atlanta, GA', density: 1345},
            ],
            currentCity: null,
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
                currentCity: city.name,
                features: features
            });
        });
    }
    
    render() {
        return (
            <div className="App">
              <div className="header">
                <h1>If Birmingham Were As Dense As {this.state.currentCity || '...'}</h1>
                {this.state.currentCity && <h3>then all the residents would have to live in this block</h3>}
              </div>
              <div className="main">
                <SMap features={this.state.features} city={this.state.currentCity} />
              </div>
              <div className="navBar">
                <CityList cities={this.state.cities} onClick={(city) => this.handleCityClick(city)}/>
              </div>
            </div>
        );
    }
}

export default App;
