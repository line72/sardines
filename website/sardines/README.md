## Sardines

(C) 2017 - Marcus Dillavou <marcus.dillavou@line72.net>
```
https://line72.net
https://github.com/line72/sardines
```

This is a simple react app for viewing the Birmingham population based on other cities densities.

To run this:

(from this directory)
- npm install react react-scripts react-dom leaflet react-leaflet axios font-awesome pako
- npm start

(or for making a release)
- npm run build

You also need the following datasets:
 - birmingham-hexgrid-with-priorities-0.5km.geojson: Generated from the QGIS project using the low resolution grid, then compressed using gzip
 - birmingham-hexgrid-with-priorities.geojson: Generated from the QGIS project using the high resolution grid, then compressed using gzip
 - birmingham-city-boundary.geojson: Used to show the city boundary
 - birmingham-metro-city-boundaries.geojson: Used to show the metro cities boundaries
