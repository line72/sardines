import axios from 'axios';

class Builder {
    constructor() {
        this.geojson = null;
    }

    build(population, density, callback) {
        if (this.geojson != null) {
            console.log('already have geojson');
            let r = this.doBuild(this.geojson, population, density);
            callback(r);
        } else {
            console.log('fetching geojson');
            // fetch first
            axios.get('/birmingham-hexgrid-with-priorities.geojson')
                .then((response) => {
                    console.log('fetch data ' + response);
                    this.geojson = response.data.features;
                    
                    let r = this.doBuild(this.geojson, population, density);
                    callback(r);
                });
        }
    }

    doBuild(features, population, density) {
        const areaPerHex = 0.025980762;
	const peoplePerHex = 1.0 / areaPerHex;

	const densityPerHex = density / peoplePerHex;
	
	const desired = population / densityPerHex;
	let count = 0;

        features.sort(function(a, b) {
            // !mwd - todo, if priority is the same
	    //  sort by the closest to the city center.
	    
	    if (a.properties.priority == null) {
		return 1;
	    } else if (b.properties.priority == null) {
		return -1;
	    } else {
		return a.properties.priority - b.properties.priority;
	    }
	});

        let results = [];
        for (let key in features) {
	    var feature = features[key];
	    //console.log("feature = " + feature);
	    //if (count < desired && feature.properties.priority == 1) {
	    if (count < desired) {
		count += 1;

                results.push(feature);
	    }
	}

        // now just find a boundary to create a single
        //  representation

        // create a list of all the points and their count
        let pointToFeatures = {};
        for (let i in results) {
            let result = results[i];
            for (let j in result["geometry"]["coordinates"][0]) {
                let coord = this.roundKey(result["geometry"]["coordinates"][0][j]);
                if (coord in pointToFeatures) {
                    if (pointToFeatures[coord].indexOf(result) === -1) {
                        //console.log('updating pointCount ' + coord + ' with ' + result + ': ' + pointToFeatures[coord].length);
                        pointToFeatures[coord].push(result);
                    }
                } else {
                    //console.log('new coord ' + coord);
                    pointToFeatures[coord] = [result];
                }
            }
        }

        // filter out any results that
        //  don't have any edges
        let filteredResults = results.filter((r) => {
            //console.log('filtering ' + r);
            for (let i in r["geometry"]["coordinates"][0]) {
                let c = r["geometry"]["coordinates"][0][i];
                let key = this.roundKey(c);

                //console.log(pointToFeatures[c].length);
                if (pointToFeatures[key].length <= 2) {
                    // found an edge
                    return true;
                }
            }
            return false;
        });

        console.log('all results = ' + results.length);
        console.log('filtered results = ' + filteredResults.length);

        let boundaries = []
        // now walk the filtered results, to find a boundary
        while (filteredResults.length > 0) {
            console.log('starting new boundary: ' + filteredResults.length);
            let boundary = []
            let startingKey = null;
            
            let toVisit = []

            // remove this item from filteredResults
            let r = filteredResults[0];
            
            toVisit.push([r, 0]);

            while (toVisit.length > 0) {
                // pop this off
                let [n, startingIndex] = toVisit.pop();
                console.log('visiting ' + n + ' at index ' + startingIndex);
                
                // remove from our filteredResults
                let index = filteredResults.indexOf(n);
                if (index !== -1) {
                    filteredResults.splice(index, 1);
                }
                
                let found = false;
                // start at the starting index, and loop through
                //  the coordinates. The 7th coordinate (index 6) is always
                //  a duplicate of the 1st coordinate (index 0), so we skip
                //  it, and drop back to the beginning.
                for (let i = startingIndex; i < startingIndex + 6; i++) {
                    let c = n["geometry"]["coordinates"][0][i % 6];
                    let key = this.roundKey(c);

                    if (key === startingKey) {
                        console.log('finished this boundary');
                        break;
                    }
                    
                    if (pointToFeatures[key].length === 1) {
                        found = true;
                        
                        if (boundary.length === 0) {
                            startingKey = key;
                        }
                        
                        boundary.push(c);
                    } else if (pointToFeatures[key].length === 2) {
                        found = true;
                        
                        if (boundary.length === 0) {
                            startingKey = key;
                        }
                        
                        boundary.push(c);
                        // find the other polygon to visit
                        let o = this.getOtherAndOffset(pointToFeatures[key], n, key);
                        if (o != null) {
                            toVisit.push(o);
                        } else {
                            console.log('ERROR: unable to find other');
                        }

                        // end our loop and go to the next polygon
                        break;
                    } else if (found) {
                        // we are all done?
                        break;
                    } else {
                        // we started off on an internal
                        //  node. Keep going through our
                        //  coordinates until we find a
                        //  boundary point.
                    }
                }
            }
            boundaries.push(boundary);
        }

        console.log('found boundaries=' + boundaries.length);
        //console.log('boundaries=' + boundaries);
        console.log('filteredResults=' + filteredResults.length);

        // generate the GeoJSON geometry based on the boundaries
        let geoJSON = this.buildGeoJSON(boundaries);
        //console.log('geoJSON=' + geoJSON);
        
        return geoJSON;
    }

    /**
     * Generate a string key
     * rounding the numbers a little
     */
    roundKey(point) {
        return point[0].toFixed(11) + 'x' + point[1].toFixed(11);
    }

    /**
     * Get the other polygon and
     *  find the index of the matching
     *  coordinate
     */
    getOtherAndOffset(items, n, key) {
        let match = items.find((i) => i !== n);
        if (match) {
            for (let i in match["geometry"]["coordinates"][0]) {
                let c = match["geometry"]["coordinates"][0][i];
                let k = this.roundKey(c);

                if (k === key) {
                    return [match, ++i];
                }
            }
        }
        return null;
    }

    buildGeoJSON(boundaries) {
        return boundaries.map((boundary) => {
            return {type: "Feature",
                    properties: {
                        priority: 0
                    },
                    geometry: {
                        type: "Polygon",
                        coordinates: [boundary]
                    }
                   };
        });
    }
}

export default Builder;
