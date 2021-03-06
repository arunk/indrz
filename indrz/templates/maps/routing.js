
var switchableLayers = [wmsUG01, wmsE00, wmsE01, wmsE02, wmsE03];
function hideLayers() {
    for (var i=0; i<switchableLayers.length; i++) {
        switchableLayers[i].setVisible(false);
    }
}
function setLayerVisible(index) {
    switchableLayers[index].setVisible(true);
}
function activateLayer(index) {
    hideLayers();
    setLayerVisible(index);
}


function switchBackgroundTo(backNum) {
    if (backNum === 1) // OSM
    {
        backgroundLayers[1].setVisible(true);
        backgroundLayers[0].setVisible(false);
    }
    else if (backNum === 0) // Mapquest OSM
    {
        backgroundLayers[0].setVisible(true);
        backgroundLayers[1].setVisible(false);
    }

}



var map = new ol.Map({
      interactions: ol.interaction.defaults().extend([
    new ol.interaction.DragRotateAndZoom()
  ]),
    //layers: [backgroundLayers[0], backgroundLayers[1], wmsUG01, wmsE00, wmsE01, wmsE02, wmsE03],
    layers: [
        new ol.layer.Group({
                'title': 'Background',
                layers: [mapQuestOsm, OsmBackLayer
                ]
            }),
            new ol.layer.Group({
                title: 'Etage',
                layers: [

                        wmsUG01, wmsE00, wmsE01, wmsE02, wmsE03
                ]
            })
    ],
    target: 'map',
    controls: ol.control.defaults({
        attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
            collapsible: false
        })
    }),
    view: new ol.View({
        center: [startCenterX, startCenterY],
        zoom: 18
    })
});

var routeLayer = null;

function addRoute(buildingId, fromNumber, toNumber, routeType) {
    var baseUrl = 'http://localhost:8000/api/v1/directions/';
    var geoJsonUrl = baseUrl + 'building=' +  buildingId + '&startid=' + fromNumber + '&endid=' + toNumber + '/?format=json';

    var startingLevel = fromNumber.charAt(0);
    switch(startingLevel) {
        case("9"):
            activateLayer(0);
            break;
        case("0"):
            activateLayer(0);
            break;
        case("1"):
            activateLayer(1);
            break;
        case("2"):
            activateLayer(2);
            break;
        case("3"):
            activateLayer(3);
            break;
        default:
            break;
    }

    if (routeLayer) {
      map.removeLayer(routeLayer);
        console.log("removing layer now");
        //map.getLayers().pop();
   }


    var source = new ol.source.Vector();
    $.ajax(geoJsonUrl).then(function(response) {
        //console.log("response", response);
        var geojsonFormat = new ol.format.GeoJSON();
        var features = geojsonFormat.readFeatures(response,
            {featureProjection: 'EPSG:4326'});
        source.addFeatures(features);
        //console.log("route layer source", source);
    });

    routeLayer = new ol.layer.Vector({
        //url: geoJsonUrl,
        //format: new ol.format.GeoJSON(),
        source: source,
        style:  new ol.style.Style({
            stroke: new ol.style.Stroke({
              color: 'red',
              width: 2
            })
          }),
        title: "Route",
        name: "Route",
        visible: true
            });
    //map.addLayer(routeLayer);

    map.getLayers().push(routeLayer);

}


