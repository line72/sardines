#!/usr/bin/env python3
#
# This script reads in a geojson
#  boundary file and generates
#  a hex grid

import math
import geojson
import geojson_utils

# We need to convert 1 unit of longitude into km
#  for the latitude of this dataset.
LON_IN_KM=93
# Desired radius of each hexgrid in km.
RADIUS=.1

class HexGrid:
    def load(name):
        f = open(name)
        geo = geojson.loads(f.read())
        
        #!mwd - not sure the standard way to get this!
        return geo['features']

    def boundary(features):
        mins_maxes = []
        
        for feature in features:
            if feature['geometry']['type'] == 'MultiPolygon':
                for coord in feature['geometry']['coordinates'][0]:
                    mins_maxes.append(HexGrid.singleBoundary(coord))
            elif feature['geometry']['type'] == 'Polygon':
                mins_maxes.append(HexGrid.singleBoundary(feature['geometry']['coordinates'][0]))
            else:
                print('Unknown feature type: %s' % (feature['geometry']['type']))

        print('mins_maxes=%s' % mins_maxes)
        minimum_lat = min([x[0][1] for x in mins_maxes])
        minimum_lon = min([x[0][0] for x in mins_maxes])
        maximum_lat = max([x[1][1] for x in mins_maxes])
        maximum_lon = max([x[1][0] for x in mins_maxes])

        return ([minimum_lon, minimum_lat],
                [maximum_lon, maximum_lat])
    
    def singleBoundary(coords):
        #print('boundary for: %s' % coords)
        # find the min/max longitude
        min_lon = min(coords, key = lambda x: x[0])
        max_lon = max(coords, key = lambda x: x[0])
        min_lat = min(coords, key = lambda x: x[1])
        max_lat = max(coords, key = lambda x: x[1])

        # bottom left and top right coords
        return ([min_lon[0], min_lat[1]],
                [max_lon[0], max_lat[1]])

    def calculate_hex_radius():
        # find our latitude per km
        in_km = 1.0 / LON_IN_KM

        # find our desired step 
        #  based on the specified radius
        step = in_km * RADIUS

        return step

    def build_grid(bottom_left, top_right, radius):
        j0 = bottom_left[0]-radius
        j1 = top_right[0]+radius
        i0 = bottom_left[1]-radius
        i1 = top_right[1]+radius

        # our i step (up -- down) is the apothem * 2
        # apothem = R cos(π/n)
        istep = radius * math.cos(math.pi / 6.0) * 2.0
        ioffset = istep / 2.0

        # our j step (left -- right) is
        # radius * 3
        jstep = radius * 3
        joffset = jstep / 2.0

        grid = []
        for i in HexGrid.gen_range(i0, i1, istep):
            # first row
            row = []
            for j in HexGrid.gen_range(j0, j1, jstep):
                row.append([j, i])
            grid.append(row)

            # second row (offset)
            row = []
            for j in HexGrid.gen_range(j0 + joffset, j1, jstep):
                row.append([j, i+ioffset])
            grid.append(row)
        
        return grid

    def filter_outside_points(feature, coords):
        def is_inside(p):
            return geojson_utils.point_in_polygon(geojson.Point(p), feature)
        
        return list(filter(lambda x: is_inside(x), coords))
    
    def build_hex_grid(grid, radius):
        hexes = []
        for row in grid:
            for h in row:
                points = []

                # right
                points.append([h[0]+radius,h[1]])
                # up right
                points.append([h[0]+radius * math.cos(math.pi / 3.0),
                               h[1]+radius * math.sin(math.pi / 3.0)])

                # up left
                points.append([h[0]+radius * math.cos(math.pi / 3.0 * 2.0),
                               h[1]+radius * math.sin(math.pi / 3.0 * 2.0)])

                # left
                points.append([h[0]-radius,h[1]])

                # down left
                points.append([h[0]+radius * math.cos(math.pi / 3.0 * 4.0),
                               h[1]+radius * math.sin(math.pi / 3.0 * 4.0)])

                # down right
                points.append([h[0]+radius * math.cos(math.pi / 3.0 * 5.0),
                               h[1]+radius * math.sin(math.pi / 3.0 * 5.0)])

                # right (close)
                points.append(points[0])

                # generate a polygon
                #p = geojson.Polygon(points)
                hexes.append(points)

        return hexes
    
    def gen_range(mini, maxi, step):
        cur = mini
        while cur < maxi:
            yield cur
            cur += step
    
if __name__ == '__main__':
    features = HexGrid.load("../data/birmingham-metro-city-boundaries.geojson")

    # find the most min and most max of all the polygons
    min_max = HexGrid.boundary(features)

    radius = HexGrid.calculate_hex_radius()
    print('min_max: %s' % (min_max,))
    print('radius: %s' % radius)

    # buid a hex grid across the whole boundary
    grid = HexGrid.build_grid(min_max[0], min_max[1], radius)
    print('grid size=%d' % len(grid))

    # find only those that are inside the boundary
    # !mwd - I have temporarily removed this, and instead
    #  am just creating one large square grid. Then I'm using
    #  QGIS to prioritize hexagons inside the boundaries I want
    #  and filtering out the ones I don't.
    #inside = [HexGrid.filter_outside_points(features, x) for x in grid]
    inside = grid

    # create the hex shapes
    hexes = HexGrid.build_hex_grid(inside, radius)

    # A polygon takes in a list of a list of points!
    # For each hex, generate a polygon, then turn each
    #  polygon into a feature.
    # Then generate a feature collection, so each polygon
    #  is independent.
    hexes = [geojson.Polygon([x]) for x in hexes]
    features = [geojson.Feature(geometry=x) for x in hexes]
    gm = geojson.FeatureCollection(features)

    valid = geojson.is_valid(gm)
    print("valid?=%s" % valid)
    
    f = open("hexgrid.geojson", "w")
    geojson.dump(gm, f)
    f.close()
        
