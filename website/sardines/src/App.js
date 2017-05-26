import React, { Component } from 'react';
import SMap from './smap';
import CityList from './citylist';
import Overlay from './overlay';

import './App.css';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

class App extends Component {
    constructor() {
        super();

        this.worker = null;
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
            geojson: null,
            loading: false,
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

        if (this.geojson != null) {
            console.log('already have geojson');
            this.doBuild(city, this.geojson, this.getPopulation(), city.density);
        } else {
            console.log('fetching geojson');
            // fetch first
            axios.get('/birmingham-hexgrid-with-priorities.geojson')
                .then((response) => {
                    console.log('fetch data ' + response);
                    this.geojson = response.data.features;

                    this.doBuild(city, this.geojson, this.getPopulation(), city.density);
                });
        }

    }

    doBuild(city, geojson, population) {
        // if we don't have a webworker, create one
        if (this.worker != null) {
            console.log('terminating old worker');
            this.worker.terminate();
            this.worker = null;
        }
        this.worker = new Worker("./builder.js");

        this.worker.onmessage = (e) =>  {
            console.log('received results for ' + e.data.city.name);
            this.setState({
                currentCity: e.data.city.name,
                features: e.data.results,
                loading: false,
            });

            this.worker.terminate();
        };

        // send a message to the worker, asking
        //  them to build the new city
        this.worker.postMessage({city: city,
                                 geojson: geojson,
                                 population: population,
                                 density: city.density});

        this.setState({
            loading: true
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
                <Overlay visible={this.state.loading} />
              </div>
              <div className="navBar">
                <CityList cities={this.state.cities} onClick={(city) => this.handleCityClick(city)}/>
              </div>
            </div>
        );
    }
}

export default App;
