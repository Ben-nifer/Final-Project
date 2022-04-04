# Bike Share Access and Commuter Behavior in NYC

## Census Tract Mode Share Relative to Citibike Station Network
<img width="1236" alt="Screen Shot 2022-04-04 at 12 43 46 AM" src="https://user-images.githubusercontent.com/98992153/161475349-5d295213-7455-4ccc-b38b-9b4754e20fb2.png">

## About
This map is meant to visualize Citi Bike's impact on commuter behavior. Citi Bike has expanded their network of stations since beginning in 2013, seeing a serious spike in demand during the COVID pandemic. Citi Bike is not the only factor that affects cycling behavior. Things like improved cycling infrastructure and plentiful secure bike parking will also encourage people to ride more. Therefore, this map is meant to show correlation, not causation.

Mode share data is taken from the American Community Survey 5 Year Estimates from 2020 and 2014.
Citi Bike stations shown on the map are from 2013 and 2019 to account for the time it may take for commuters to change their behavior. Some census tracts from 2020 have no data, so some tracts on the 2020 layer will show up blank.

## Methodology
I use the census API in R to get the mode share data I need, filter for subway, bus, biking, and walking, then add columns for percentages. This census data is tied to geo ids, which are then joined to tract geometries in QGIS. Citi Bike station data is filtered from Citi Bike's monthly ride data.


This project was submitted for an NYU Wagner web mapping class. It is still a work in progress and open to input.
