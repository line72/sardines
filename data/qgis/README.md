# QGIS

The webservice expects our hexgrid to have a `priority` value associated with each hexagon. The `priority` value is used to sort the hexagons, so the visualization knows which to fill in first. A lower value indicates the first hexagon to be filled in.

Also, it expects each hexagon to have a `centroidLatitude` and `centroidLongitude` indicating the computed center of each hexagon, so it can quickly do distance calculations.

To create this, I used the opensource [QGIS][http://qgis.org/en/site/]. I loaded in the original `Birmingham-3058.json` dataset AND the `hexgrid.geojson` generated from the `build_hex_grid.py` script. I also found it useful to bring in the individual neighborhoods in Birmingham, so I pulled in the `birmingham-neighborhoods.geojson` file too.

**Please be aware, that QGIS will modify these geojson files directly, which is why I have copies of everything in this directory!**

Using QGIS, I added a new feature column called priority to the `hexgrid` data source, and then selected groups of hexagons and gave them priorities.

You can load the `birmingham_hex_grid_with_priorities.qgs` file directly into QGIS, which is a project file with all the layers and priorities already set up.

## Birmingham-3058.json

GeoJson representing a large portion of Birmingham as a single boundary. This is neither the true boundary for the Birmingham city limit, nor of the whole metro area. This is not currently being used.

## birmingham-city-boundary.geojson

GeoJson representing the political boundary of Birmingham City Limits.

This is also used in the webapp to display the city boundaries.

## birmingham_hex_grid_with_priorities.qgs

QGIS project file.

## birmingham-metro-city-boundaries.geojson

GeoJson with a bunch of polygons each representing the different political boundaries of the Birmingham Metro Area. The Metro area is not well defined, so this has a random outer boundary.

This is also used in the webapp to display the metro boundaries.

## birmingham-metro-city-hexgrid-0.5km.geojson

A hex grid covering the entire metro area at a lower resolution of 0.5 kilometers. This also embeds the priorities and centroids into the data.

This hex grid is used for showing large populations in the webapp.

## birmingham-metro-city-hexgrid.geojson

A hex grid covering the entire metro area at a higher resolution of 0.1 kilometers. This also embeds the priorities and centroids into the data.

This hex grid is used for showing dense populations in the webapp.

## birmingham-neighborhoods.geojson

GeoJson showing the birmingham neighborhoods
