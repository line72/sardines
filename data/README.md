# Sardines/data

## Birmingham-3058.json

This is a geojson representing the greater Birmingham, AL metro area. This is the initial dataset that was used for generating the hex grid.

This data set came from:
http://theplacename.com/place/birmingham/3058

## birmingham-metro-city-boundaries.geojson

This is a geojson representing the political boundaries of the whole Birmingham, AL Metro area. This dataset is used when display Birmingham in Metro mode. The "Metro" is pretty losely defined, so not all municipalities are listed.

This data set came from:
https://mapzen.com/data/metro-extracts/your-extracts/a12adc322fd0

## QGIS

The webservice expects our hexgrid to have a `priority` value associated with each hexagon. The `priority` value is used to sort the hexagons, so the visualization knows which to fill in first. A lower value indicates the first hexagon to be filled in.

To create this, I used the opensource [QGIS][http://qgis.org/en/site/]. I loaded in the original `Birmingham-3058.json` dataset AND the `hexgrid.geojson` generated from the `build_hex_grid.py` script. I also found it useful to bring in the individual neighborhoods in Birmingham, so I pulled in the `birmingham-neighborhoods.geojson` file too.

**Please be aware, that QGIS will modify these geojson files directly, which is why I have copies of everything in this directory!**

Using QGIS, I added a new feature column called priority to the `hexgrid` data source, and then selected groups of hexagons and gave them priorities.
