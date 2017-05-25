import React from 'react';
import { GeoJSON } from 'react-leaflet';

class Density extends React.Component {
    render() {
	const myStyle = {
	    "color": "#ff7800",
	    "stroke": false,
	    "fillOpacity": 0.9
	};

        // create a bunch of json from the features
        const features = this.props.features.map((feature, step) => {
            return (
                <GeoJSON key={step} data={feature} style={myStyle} />
            );
        });
        
        return (
            <div>
              {features}
            </div>
        );
    }
}

export default Density;
