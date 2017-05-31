import React from 'react';
import { GeoJSON } from 'react-leaflet';

class Density extends React.Component {
    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    
    render() {
        // create a bunch of json from the features
        const features = this.props.features.map((feature, step) => {
            let myStyle = {
	        "color": "#362261",
	        "stroke": true,
	        "fillOpacity": 0.5
	    };

            return (
                <GeoJSON key={this.props.name+step} data={feature} style={myStyle} />
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
