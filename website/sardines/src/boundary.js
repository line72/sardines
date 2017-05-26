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

    }
    
    render() {
	const style = {
	    "color": "#000000",
	    "stroke": true,
	    "fillOpacity": 0.0
	};
	let r = '';
	if (this.props.useMetroPopulation) {
	    if (this.state.metro == null) {
		this.fetchMetro();
	    } else {
		r = <GeoJSON key="metro-boundary" data={this.state.metro} style={style} />
	    }
	} else {
	    if (this.state.city == null) {
		this.fetchCity();
	    } else {
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
