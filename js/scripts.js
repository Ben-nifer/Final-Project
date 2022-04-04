





mapboxgl.accessToken = 'pk.eyJ1IjoiYmVubmlmZXIiLCJhIjoiY2t6bmZpaTB4MmNyMjJucXIyM2s2a3M5OCJ9.yfIClB9zes7RF2saxS5JlA'

var NYCenter = [-73.982740, 40.751000] //approximating city center
// 40.751000, -73.982740

var map = new mapboxgl.Map({
  container: 'mapContainer', // HTML container id
  style: 'mapbox://styles/mapbox/dark-v9', // look for something that can better display transit routes/ stops. Contextualize the numbers
  center: NYCenter, // starting position as [lng, lat]
  zoom: 10.5,
  minzoom: 9.5,

});

// https://docs.mapbox.com/mapbox-gl-js/example/hover-styles/
let hoveredMS20Id = null;
let hoveredMS14Id = null;
let clickedMS20Id = null;
let clickedMS14Id = null;



map.on('load', function() {

  map.addSource('ModeShare20', {
    type: 'geojson',
    data: './data/ModeShare20.geojson',
    generateId: true,
  });

  map.addSource('ModeShare14', {
    type: 'geojson',
    data: './data/ModeShare14.geojson',
    generateId: true,
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
      'fill-outline-color': '#ccc',
      'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          .7,
          0.5
        ],
    },
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
      'fill-outline-color': '#ccc',
      'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          .7,
          0.5
        ],

    },
    layout: {
      visibility: "none"
    },
  });

  map.addLayer({
    id: 'stations2019-dots',
    type: 'circle',
    source: 'Stations2019',
    paint: {
      // make circles larger as you zoom from 9.8 to 22
      // https://docs.mapbox.com/mapbox-gl-js/example/data-driven-circle-colors/
      'circle-radius': {
        'base': 1.75,
        'stops': [
            [9.8, 2],
            [22, 180]
        ]
      },
      'circle-color': '#2d427b'
    },
  });

  map.addLayer({
    id: 'stations2013-dots',
    type: 'circle',
    source: 'Stations2013',
    paint: {
      // make circles larger as you zoom from 9.8 to 22
      // https://docs.mapbox.com/mapbox-gl-js/example/data-driven-circle-colors/
      'circle-radius': {
        'base': 1.75,
        'stops': [
            [9.8, 2],
            [30, 280]
        ]
      },
      'circle-color': '#2d427b'
    },
    layout: {
      visibility: "none"
    },
  });

// When the user moves their mouse over the fill layer, we'll update the
// feature state for the feature under the mouse.
// https://docs.mapbox.com/mapbox-gl-js/example/hover-styles/
// START MAP.ON MOUSEMOVE FOR 2020 FILL
  map.on('mousemove', 'ModeShare20-fill', (e) => {
    if (e.features.length > 0) {
      if (hoveredMS20Id !== null) {
        map.setFeatureState(
          { source: 'ModeShare20', id: hoveredMS20Id },
          { hover: false }
        );
      }
      hoveredMS20Id = e.features[0].id;
      map.setFeatureState(
        { source: 'ModeShare20', id: hoveredMS20Id },
        { hover: true }
      );
    }
  });

// When the mouse leaves the fill layer, update the feature state of the
// previously hovered feature.
  map.on('mouseleave', 'ModeShare20-fill', () => {
    if (hoveredMS20Id !== null) {
      map.setFeatureState(
        { source: 'ModeShare20', id: hoveredMS20Id },
        { hover: false }
      );
    }
    hoveredMS20Id = null;
  });
// END MAP.ON MOUSEMOVE FOR 2020 FILL

// START MAP.ON MOUSEMOVE FOR 2014 FILL

  map.on('mousemove', 'ModeShare14-fill', (e) => {
    if (e.features.length > 0) {
      if (hoveredMS14Id !== null) {
        map.setFeatureState(
          { source: 'ModeShare14', id: hoveredMS14Id },
          { hover: false }
        );
      }
      hoveredMS14Id = e.features[0].id;
      map.setFeatureState(
        { source: 'ModeShare14', id: hoveredMS14Id },
        { hover: true }
      );
    }
  });

// When the mouse leaves the fill layer, update the feature state of the
// previously hovered feature.
  map.on('mouseleave', 'ModeShare14-fill', () => {
    if (hoveredMS14Id !== null) {
      map.setFeatureState(
        { source: 'ModeShare14', id: hoveredMS14Id },
        { hover: false }
      );
    }
    hoveredMS14Id = null;
  });

// END MAP.ON MOUSEMOVE FOR 2014 FILL

// START MAP.ON CLICK OPACITY; https://stackoverflow.com/questions/60096104/change-polygon-color-on-click-with-mapbox
// As of now, not working - might be a problem with putting two opacity conditions in addLayer paint section
// So, commented out for now

  // map.on('click', 'ModeShare20-fill', function(e) {
  //         if (e.features.length > 0) {
  //             if (clickedMS20Id) {
  //                 map.setFeatureState(
  //                     { source: 'ModeShare20', id: clickedMS20Id },
  //                     { click: false }
  //                   );
  //                 }
  //                 clickedMS20Id = e.features[0].id;
  //                 map.setFeatureState(
  //                   { source: 'ModeShare20', id: clickedMS20Id },
  //                   { click: true }
  //                 );
  //               }
  // });
  //
  // map.on('click', 'ModeShare14-fill', function(e) {
  //         if (e.features.length > 0) {
  //             if (clickedMS14Id) {
  //                 map.setFeatureState(
  //                     { source: 'ModeShare14', id: clickedMS14Id },
  //                     { click: false }
  //                   );
  //                 }
  //                 clickedMS14Id = e.features[0].id;
  //                 map.setFeatureState(
  //                   { source: 'ModeShare14', id: clickedMS14Id },
  //                   { click: true }
  //                 );
  //               }
  // });

// END MAP.ON CLICK OPACITY

// click on census tracts to get mode share info
  map.on('click', 'ModeShare20-fill', function(e) {
    var features20 = map.queryRenderedFeatures(e.point)
    var featureOfInterestProperties20 = features20[0].properties


    var ctNum20 = featureOfInterestProperties20['NAMELSAD']
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
    var featureOfInterestProperties14 = features14[0].properties


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
          var selectedStationLayer = "stations2019-dots"
          var unselectedStationLayer = "stations2013-dots"

        } else if (this.id == '2014'){
          var selectedLayer = "ModeShare14-fill"
          var unselectedLayer = "ModeShare20-fill"
          var selectedStationLayer = "stations2013-dots"
          var unselectedStationLayer = "stations2019-dots"
        }

        // get and toggle visibility on for selected layer(s)
        var visibility = map.getLayoutProperty(
          selectedLayer,'visibility'
        );

        if (visibility == 'none'){
          map.setLayoutProperty(
            selectedLayer, 'visibility', 'visible');
        };

        var visibility = map.getLayoutProperty(
          selectedStationLayer,'visibility'
        );

        if (visibility == 'none'){
          map.setLayoutProperty(
            selectedStationLayer, 'visibility', 'visible');
        };

        // get and toggle visibility off for unselected layer
        var visibility = map.getLayoutProperty(
          unselectedLayer,'visibility'
        );

        if (visibility != 'none'){
          map.setLayoutProperty(
            unselectedLayer, 'visibility', 'none');
        };

        var visibility = map.getLayoutProperty(
          unselectedStationLayer,'visibility'
        );

        if (visibility != 'none'){
          map.setLayoutProperty(
            unselectedStationLayer, 'visibility', 'none');
        };
      });

})

$(document).ready(function(){
        $("#openModal").modal('show');
    });
