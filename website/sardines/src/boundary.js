import React from 'react'
import { GeoJSON } from 'react-leaflet';
import axios from 'axios';

class Boundary extends React.Component {
    constructor() {
	super();

	this.state = {
	    city: null,
	    metro: null,
	};
    }

    fetchCity() {
	console.log('fetch city boundary');
	axios.get('/birmingham-city-boundary.geojson')
	    .then((response) => {
		console.log('got response ' + response.data);
		this.setState({
		    city: response.data
		});
	    });
    }

    fetchMetro() {
	console.log('fetch metro boundary');
	axios.get('/birmingham-metro-city-boundaries.geojson')
	    .then((response) => {
		console.log('got response ' + response.data);
		this.setState({
		    metro: response.data
		});
	    });
	
    }
    
    render() {
	let r = '';
	if (this.props.useMetroPopulation) {
	    if (this.state.metro == null) {
		this.fetchMetro();
	    } else {
		let style = {"color": "#000000",
			     "stroke": true,
			     "fill": true,
			     "fillOpacity": 0.2,
			     "fillColor": "#555555",
			     "weight": 1
			    };

		r = <GeoJSON key="metro-boundary" data={this.state.metro} style={style} />
	    }
	} else {
	    if (this.state.city == null) {
		this.fetchCity();
	    } else {
		let style = {"color": "#000000",
			     "stroke": true,
			     "fill": true,
			     "fillOpacity": 0.2,
			     "fillColor": "#555555",
			     "weight": 6
			    };

		r = <GeoJSON key="city-boundary" data={this.state.city} style={style} />
	    }
	}

	console.log('rendering ' + r);
	return (
	    <div>
	      {r}
	    </div>
	);
    }
}

export default Boundary;
