import React, { Component } from 'react';
import SMap from './smap';
import CityList from './citylist';
import Overlay from './overlay';

import './App.css';
import './w3.css';
import 'leaflet/dist/leaflet.css';
import 'font-awesome/css/font-awesome.min.css';
import axios from 'axios';
import pako from 'pako';

class App extends Component {
    constructor() {
        super();

        this.worker = null;
	this.geoJson = {
            loaded: false,
            low: {
		areaPerHex: 0.649519052838329,
		geoJson: null
            },
            high: {
		areaPerHex: 0.025980762,
		geoJson: null
            }
	}
        this.state = {
            cities: [
		{name: 'Manila, Philippines', density: 41515},
		{name: 'Mumbai, India', density: 28508},
                {name: 'Paris', density: 21603},
                {name: 'Manhattan', density: 18903},
		{name: 'Cairo', density: 18071},
                {name: 'San Francisco', density: 7124},
                {name: 'Tokyo', density: 6225},
                {name: 'Boston', density: 5335},
                {name: 'London', density: 5164},
                {name: 'Munich', density: 4700},
                {name: 'Chicago', density: 4614},
                {name: 'Amsterdam', density: 3320},
                {name: 'Los Angeles, CA', density: 3272},
                {name: 'Copenhagen', density: 2052},
                {name: 'Dallas, TX', density: 1474},
                {name: 'Atlanta, GA', density: 1345},
                {name: 'Austin, TX', density: 1208},
                {name: 'Birmingham, AL', density: 655}, /* !mwd - my calculated density */
                //{name: 'Birmingham, AL', density: 562},
                {name: 'Nasvhille, TN', density: 512},
            ],
            currentCity: null,
            population: {city: 212461,
                         metro: 1200000
                        },
            useMetroPopulation: false,
            features: null,
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

    handlePopulationChanged(useMetroPopulation) {
	this.setState({
            useMetroPopulation: useMetroPopulation,
	    currentCity: null,
	    features: null
	});
    }
    
    handleCityClick(city) {
	console.log('handleCityClick ' + city);
        console.log("city was clicked " + city.name + " " + city.density);
        console.log("using birmingham population: " + this.getPopulation());

        this.setState({
            loading: true
        });

	let population = this.getPopulation();
	
        if (this.geoJson.loaded) {
            console.log('already have geojson');
            this.doBuild(city, this.geoJson, population, city.density);
        } else {
            axios.all([this.fetchHexGrid('/birmingham-hexgrid-with-priorities.geojson.gz'),
		       this.fetchHexGrid('/birmingham-hexgrid-with-priorities-0.5km.geojson.gz')])
		.then(axios.spread((highRes, lowRes) => {

		    this.geoJson.high.geoJson = highRes;
		    this.geoJson.low.geoJson = lowRes;
		    this.geoJson.loaded = true;

		    this.doBuild(city, this.geoJson, population, city.density);
		}));
	}
    }

    fetchHexGrid(name) {
        console.log('fetching geojson: ' + name);
        // fetch first the high res
        return axios.get(name, {
            responseType: 'arraybuffer'
        }).then((response) => {
            // decompress
            return JSON.parse(pako.ungzip(response.data, {to: 'string'}));
        });
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
                currentCity: e.data.city,
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

    }
    
    render() {
	let population = this.getPopulation();

	let currentCity = null;
	if (this.state.currentCity != null) {
            currentCity = this.state.currentCity.name;
	}
	
        return (
            <div className="App">
              {/* NavBar */}
              <CityList cities={this.state.cities}
			current={currentCity}
			useMetroPopulation={this.state.useMetroPopulation}
			birminghamPopulation={population}
			onCityChanged={(useMetro) => this.handlePopulationChanged(useMetro)}
		        onClick={(city) => this.handleCityClick(city)}
		/>
		
		{/* Main Content with Header */}
		<div className="w3-main sardine-main">
		  {/* Push content down on small screens */}
		  <div className="w3-hide-large sardine-header-margin">
		  </div>

		  <div className="w3-hide-medium w3-hide-small sardine-header">
		    <h1 className="sardine-h1">If Birmingham Were As Dense As {currentCity || '...'}</h1>
		    {currentCity && <h3 className="sardine-h3">then all the residents would have to live in this block</h3>}
		  </div>

		  <div className="w3-container">
                    <SMap features={this.state.features} city={currentCity} useMetroPopulation={this.state.useMetroPopulation} />
                    <Overlay visible={this.state.loading} />
		  </div>
		</div>
            </div>
        );
    }
}

export default App;
