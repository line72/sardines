
function initMap() {
    var mymap = L.map('mapid').setView([33.5084801,-86.8006611], 13);
    
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
	    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
	    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
	id: 'mapbox.streets'
    }).addTo(mymap);


    $.get("data/birmingham-hexgrid-with-priorities.geojson", function(response) {
	var myStyle = {
	    "color": "#ff7800",
	    "stroke": false,
	    "fillOpacity": 0.9
	};

	var birminghamPopulation = 212461;
	//var birminghamPopulation = 1200000;
	
	var parisDensity = 21603;
	var manhattanDensity = 18903;
	var londonDensity = 5164;
	var chicagoDensity = 4614;
	var munichDensity = 4700;
	var copenhagenDensity = 2052;
	var amsterdamDensity = 3320;
	var austinDensity = 1208;
	var birminghamDensity = 562;
	var nashvilleDensity = 512;
	var atlantaDensity = 1345;
	var density = amsterdamDensity;
	
	var areaPerHex = 0.025980762;
	var peoplePerHex = 1.0 / areaPerHex;

	var densityPerHex = density / peoplePerHex;
	
	var desired = birminghamPopulation / densityPerHex;
	var count = 0;

	console.log("densityPerHex=" + densityPerHex);
	console.log("desired=" + desired);

	// sort our features by priority
	var features = response.features;
	// 
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
	
	for (key in features) {
	    var feature = features[key];
	    //console.log("feature = " + feature);
	    //if (count < desired && feature.properties.priority == 1) {
	    if (count < desired) {
		count += 1;
		//console.log("found layer: " + feature);
		L.geoJSON(feature, {style: myStyle}).addTo(mymap);
	    }
	}
    });

    // var geojsonLayer = new L.GeoJSON.AJAX("hexgrid.geojson");
    // for (key in geojsonLayer) {
    // 	console.log("key=" + key);
    // }
    // var geoJson = geojsonLayer.toGeoJSON();
    // console.log("geoJson=" + geoJson);
    // for (key in geoJson) {
    // 	console.log("key=" + key);
    // }
    // var features = geoJson.type;
    // console.log("features=" + features);
    // for (key in features) {
    // 	console.log("key=" + key);
    // }
    // for (i = 0; i < features.length; i++) {
    // 	console.log("checking " + i);
    // 	var priority = features['priority'];
    // 	if (priority == 1) {
    // 	    L.geoJSON(feature).addTo(mymap);
    // 	}
    // }
    //geojsonLayer.addTo(mymap);
    //var grid = new L.LayerGroup();
    //console.log(hexgrid);
    //L.geoJson(hexgrid).addTo(mymap);
    //grid.addTo(mymap);
}
