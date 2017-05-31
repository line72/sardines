/* -*- Mode: rjsx -*- */

/*******************************************
 * Copyright (2017)
 *  Marcus Dillavou <line72@line72.net>
 *  http://line72.net
 *
 * Sardines:
 *  https://github.com/line72/sardines
 *  https://sardines.line72.net
 *
 * Licensed Under the GPLv3
 *******************************************/

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

            let key = this.props.useMetroPopulation ? 'metro' : 'city'

            return (
                <GeoJSON key={this.props.name+key+step} data={feature} style={myStyle} />
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
