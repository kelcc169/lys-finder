const shopsCoords = shops.map(function (shop) {
    return {
        lat: shop.latitude,
        lng: shop.longitude,
        address: shop.address,
        name: shop.name,
        ravId: shop.id
    }
});

mapboxgl.accessToken = 'pk.eyJ1Ijoia2VsY2MxNjkiLCJhIjoiY2p4YzFnODJhMGh4dDN5bWFkOHdpaGxkYSJ9.P05Jkczde1J1vx7262976A';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: {
        lng: shopsCoords[0].lng,
        lat: shopsCoords[0].lat
    },
    zoom: 11
});

map.on('load', function(){
    let layers = map.getStyle().layers;
    let labelLayerId;
    for (let i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
            labelLayerId = layers[i].id;
            break;
        }
    }
    map.addLayer({
        "id": "places",
        "source": "composite",
        "source-layer": "building",
        "filter": ["==", "extrude", "true"],
        "type": "fill-extrusion",
        "minzoom": 12,
        "paint": {
            "fill-extrusion-color": "#009e60",
            "fill-extrusion-height": [
                "interpolate",
                ["linear"],
                ["zoom"],
                12,
                0,
                12.05,
                ["get" , "height"]
            ],
            "fill-extrusion-base": [
                "interpolate",
                ["linear"],
                ["zoom"],
                12,
                0,
                12.05,
                ["get" , "min_height"]
            ],
            "fill-extrusion-opacity": 0.6
        }
    }, labelLayerId)
});

const geoJson = {
    "type": "FeatureCollection",
    "features": shopsCoords.map( function (coord) {
        let marker = {
            "type": "Feature",
            "properties": {
                "iconSize": [32, 32],
                "description": coord.address
            },
            "geometry": {
                "type": "Point",
                "coordinates": coord
            }
        }
        return marker
    })
}

geoJson.features.forEach(function (feature) {
    var el = document.createElement('div')
    el.id = 'marker';
    el.style.backgroundImage = 'url(../img/yarn.png)';
	el.style.width = feature.properties.iconSize[0] + 'px';
	el.style.height = feature.properties.iconSize[1] + 'px';

    var name = feature.geometry.coordinates.name;
    var address = feature.geometry.coordinates.address;
    var ravId = feature.geometry.coordinates.ravId;

    var description = '<h6>' + name + '</h6><p>' + address + '</p><a href="search/' + ravId + '">Learn More</a>'
    
    el.addEventListener('click', function () {
        console.log(feature)
    });
    
    var popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(description);

    // create the marker
    new mapboxgl.Marker({ element: el, anchor: "center"})
        .setLngLat(feature.geometry.coordinates)
        .setPopup(popup)
        .addTo(map)
})


