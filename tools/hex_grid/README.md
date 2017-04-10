# Build Hex Grid

This is a script to generate a hex grid of known sizes
across the region of Birmingham. This script is tied very closely to
the data/Birmingham-3058.json file. However, it *could* be used in a
more generic way.

## Calculate distance

First, I used the build_hex_grid to find the min and max longitude
(east-west) values. I then copied those into the following website:

http://www.nhc.noaa.gov/gccalc.shtml

with a common longitude to compute a distance.

Lat1: 33.469196 N Lon1: 87.042746 W
Lat2: 33.469196 N Lon2: 86.559762 W

This gave me a distance of approximately 45km. If you are working with
a different dataset, please modify the `build_hex_grid.py` and edit
the `LON_IN_KM` variable. This variable indicates the distance in
kilometers of our bounding box from east to west.

## Generating a Hex Grid

In Birmingham, 1km is about 8 city blocks (University to the rail road
tracks). For the resolution I wanted, I decided to create a hexgrid
with the radius of each hexagon being 0.1km.

If you would like a different radius, please change the `RADIUS` value
in the `build_hex_grid.py` script. Radius should be in kilometers.

Properties of a hexagon:

Sides = 6
Interior Angles = 120°
Radius = 1
Side Length = 1
Apothem = 0.866 (½√3)
Area = 2.598 ((3/2)√3)

Area equation (for a regular hexagon) is:

A = (3*√3*s^2) / 2
