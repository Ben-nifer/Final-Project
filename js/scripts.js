





mapboxgl.accessToken = 'pk.eyJ1IjoiYmVubmlmZXIiLCJhIjoiY2t6bmZpaTB4MmNyMjJucXIyM2s2a3M5OCJ9.yfIClB9zes7RF2saxS5JlA'

var NYCenter = [-73.935242, 40.73061] //approximating city center


var map = new mapboxgl.Map({
  container: 'mapContainer', // HTML container id
  style: 'mapbox://styles/mapbox/dark-v9', // look for something that can better display transit routes/ stops. Contextualize the numbers
  center: NYCenter, // starting position as [lng, lat]
  zoom: 10,
  minzoom: 9.5

});

map.on('load', function() {

  map.addSource('ModeShare20', {
    type: 'geojson',
    data: './data/ModeShare20.geojson',
  });

  map.addSource('ModeShare14', {
    type: 'geojson',
    data: './data/ModeShare14.geojson',
  });

  map.addLayer({
    id: 'ModeShare20-fill',
    type: 'fill',
    source: 'ModeShare20',
    paint: {
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', 'modeShare2020_bikePerc20'],
        // blue/purp graidient from QGIS
        .000000,
        '#edf8fb',
        .009378,
        '#b3cde3',
        .029268,
        '#8c96c6',
        .058527,
        '#8856a7',
        .106700,
        '#810f7c',
      ],
      'fill-opacity': .5
    }
  });

  map.addLayer({
    id: 'ModeShare14-fill',
    type: 'fill',
    source: 'ModeShare14',
    paint: {
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', 'modeShare2014_bikePerc14'],
        // blue/purp graidient from QGIS
        .000000,
        '#edf8fb',
        .009378,
        '#b3cde3',
        .029268,
        '#8c96c6',
        .058527,
        '#8856a7',
        .106700,
        '#810f7c',
      ],
      'fill-opacity': .5
    }
  })

  map.on('click', function(e) {
    var features = map.queryRenderedFeatures(e.point)
    var featureOfInterestProperties = features[0].properties


    var ctNum = featureOfInterestProperties['NAMELSAD']
    var percBike = featureOfInterestProperties['modeShare2020_bikePerc20']
    var percSub = featureOfInterestProperties['modeShare2020_subwayPerc20']
    var percBus = featureOfInterestProperties['modeShare2020_busPerc20']
    var percWalk = featureOfInterestProperties['modeShare2020_walkPerc20']

    $('#sidebar-content-area').html(`
      <h4>${ctNum}</h4>
      <p> Share of commuters biking: ${numeral(percBike).format('0%')}</p>
      <p> Share of commuters using the subway: ${numeral(percSub).format('0%')}</p>
      <p> Share of commuters using the bus: ${numeral(percBus).format('0%')}</p>
      <p> Share of commuters walking: ${numeral(percWalk).format('0%')}</p>
    `)

  })

  // Add layer toggle functionality to radio buttons
      // Source: https://hannahrosey.github.io/section8-flood-risk/
      $('.layertoggle').on('click', function(e) {
        if (this.id == '100'){
          var selectedLayer = "floodplain-100"
          var unselectedLayer = "floodplain-500"
          var unselectedId = "#500"
          $('#floodplainStat').html(stat100);

        } else if (this.id == '500'){
          var selectedLayer = "floodplain-500"
          var unselectedLayer = "floodplain-100"
          var unselectedId = "#100"
          $('#floodplainStat').html(stat500);
        }
        if (this.id == 'moderate'){
          var selectedLayer = "stormwater-moderate"
          var unselectedLayer = "stormwater-extreme"
          var unselectedId = "extreme"
          $('#stormsurgeStat').html(statMod);
        } else if (this.id == 'extreme'){
          var selectedLayer = "stormwater-extreme"
          var unselectedLayer = "stormwater-moderate"
          var unselectedId = "moderate"
          $('#stormsurgeStat').html(statExtr);
        }


        // get and toggle radio button checked status for unselected layer
        $(unselectedId).prop('checked', false);

        // get and toggle visibility on for selected layer
        var visibility = map.getLayoutProperty(
          selectedLayer,'visibility'
        );

        if (visibility == 'none'){
          map.setLayoutProperty(selectedLayer, 'visibility', 'visible');
        };

        // get and toggle visibility off for unselected layer
        var visibility = map.getLayoutProperty(
          unselectedLayer,'visibility'
        );

        if (visibility != 'none'){
          map.setLayoutProperty(unselectedLayer, 'visibility', 'none');
        };
      });

})
