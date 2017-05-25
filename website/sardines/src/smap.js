import React from 'react';
import { Map, TileLayer } from 'react-leaflet';
import Density from './density';

class SMap extends React.Component {
    constructor() {
        super();
        
        this.state = {
            /*center: [33.5084801,-86.8006611],*/
            center: [33.177885708504988,-86.827013146666374],
            zoom: 13
        };
    }

    render() {
        const position = this.state.center;

        return (
            <div>
                <Map center={position} zoom={this.state.zoom}>
                  <TileLayer
                    attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                    />
                  {this.props.features != null && 
                  <Density features={this.props.features} />}
                </Map>
            </div>
        );
    }
}

export default SMap;
