





mapboxgl.accessToken = 'pk.eyJ1IjoiYmVubmlmZXIiLCJhIjoiY2t6bmZpaTB4MmNyMjJucXIyM2s2a3M5OCJ9.yfIClB9zes7RF2saxS5JlA'

var NYCenter = [-74.042503, 40.708733] //approximating city center
// 40.708733, -74.042503

var map = new mapboxgl.Map({
  container: 'mapContainer', // HTML container id
  style: 'mapbox://styles/mapbox/dark-v9', // look for something that can better display transit routes/ stops. Contextualize the numbers
  center: NYCenter, // starting position as [lng, lat]
  zoom: 9.8,
  minzoom: 9.5,

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

  map.addSource('Stations2019', {
    type: 'geojson',
    data: './data/Stations2019.geojson',
  });

  map.addSource('Stations2013', {
    type: 'geojson',
    data: './data/Stations2013.geojson',
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
    },
    layout: {
      visibility: "none"
    }
  });

  map.on('click', 'ModeShare20-fill', function(e) {
    var features20 = map.queryRenderedFeatures(e.point)
    var featureOfInterestProperties20 = features[0].properties


    var ctNum20 = featureOfInterestProperties['NAMELSAD']
    var percBike20 = featureOfInterestProperties20['modeShare2020_bikePerc20']
    var percSub20 = featureOfInterestProperties20['modeShare2020_subwayPerc20']
    var percBus20 = featureOfInterestProperties20['modeShare2020_busPerc20']
    var percWalk20 = featureOfInterestProperties20['modeShare2020_walkPerc20']

    $('#sidebar-content-area').html(`
      <h4>${ctNum20}</h4>
      <p> Share of commuters biking: ${numeral(percBike20).format('0%')}</p>
      <p> Share of commuters using the subway: ${numeral(percSub20).format('0%')}</p>
      <p> Share of commuters using the bus: ${numeral(percBus20).format('0%')}</p>
      <p> Share of commuters walking: ${numeral(percWalk20).format('0%')}</p>
    `)



  });

  map.on('click', 'ModeShare14-fill', function(e) {
    var features14 = map.queryRenderedFeatures(e.point)
    var featureOfInterestProperties14 = features[0].properties


    var ctNum14 = featureOfInterestProperties14['NAMELSAD']
    var percBike14 = featureOfInterestProperties14['modeShare2014_bikePerc14']
    var percSub14 = featureOfInterestProperties14['modeShare2014_subwayPerc14']
    var percBus14 = featureOfInterestProperties14['modeShare2014_busPerc14']
    var percWalk14 = featureOfInterestProperties14['modeShare2014_walkPerc14']

    $('#sidebar-content-area').html(`
      <h4>${ctNum14}</h4>
      <p> Share of commuters biking: ${numeral(percBike14).format('0%')}</p>
      <p> Share of commuters using the subway: ${numeral(percSub14).format('0%')}</p>
      <p> Share of commuters using the bus: ${numeral(percBus14).format('0%')}</p>
      <p> Share of commuters walking: ${numeral(percWalk14).format('0%')}</p>
    `)

  })

  // Add layer toggle functionality to radio buttons
      // Source: https://hannahrosey.github.io/section8-flood-risk/
      $('.layertoggle').on('click', function(e) {
        if (this.id == '2020'){
          var selectedLayer = "ModeShare20-fill"
          var unselectedLayer = "ModeShare14-fill"
          // var unselectedId = "#500"
          // $('#floodplainStat').html(stat100);

        } else if (this.id == '2014'){
          var selectedLayer = "ModeShare14-fill"
          var unselectedLayer = "ModeShare20-fill"
          // var unselectedId = "#100"
          // $('#floodplainStat').html(stat500);
        }


        // get and toggle radio button checked status for unselected layer
        // $(unselectedId).prop('checked', false);

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
