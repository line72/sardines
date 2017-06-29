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
import { Map, TileLayer, ZoomControl } from 'react-leaflet';
import Density from './density';
import Boundary from './boundary';

class SMap extends React.Component {
    constructor() {
        super();

        // pulled from:
        //  https://leaflet-extras.github.io/leaflet-providers/preview/
        let tiles = {
            stamen_toner: {
                url: "https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png",
                subdomains: 'abcd',
                attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            },
            black_and_white: {
                url: 'https://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png',
                subdomains: null,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }
        }

        this.state = {
            center: [33.5084801,-86.8006611],
            zoom: 11,
            tile: tiles.stamen_toner,
        };
    }

    render() {
        const position = this.state.center;

        return (
            <div className="map-container">
                <Map center={position} zoom={this.state.zoom} zoomControl={false}>
                    <ZoomControl position="bottomleft" />
                    <TileLayer
                        attribution={this.state.tile.attribution}
                        url={this.state.tile.url}
                        subdomains={this.state.tile.subdomains}
                        />
                    <Boundary useMetroPopulation={this.props.useMetroPopulation} />
                    {this.props.features != null &&
                    <Density features={this.props.features} name={this.props.city} useMetroPopulation={this.props.useMetroPopulation} />}
                </Map>
            </div>
        );
    }
}

export default SMap;
