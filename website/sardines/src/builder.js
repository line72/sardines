import axios from 'axios';

class Builder {
    constructor() {
        this.geojson = null;
    }

    build(population, density, callback) {
        if (this.geojson != null) {
            console.log('already have geojson');
            let r = this.do_build(this.geojson, population, density);
            callback(r);
        } else {
            console.log('fetching geojson');
            // fetch first
            axios.get('/birmingham-hexgrid-with-priorities.geojson')
                .then((response) => {
                    console.log('fetch data ' + response);
                    this.geojson = response.data.features;
                    
                    let r = this.do_build(this.geojson, population, density);
                    callback(r);
                });
        }
    }

    do_build(features, population, density) {
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

        return results;
    }
}

export default Builder;
