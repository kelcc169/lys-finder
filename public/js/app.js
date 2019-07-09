const shopsCoords = shops.map(function (shop) {
    return {
        lat: shop.latitude,
        lng: shop.longitude,
        address: shop.address
    }
});

console.log(shopsCoords)

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

const geoJson = {
    "type": "FeatureCollection",
    "features": shopsCoords.map( function (coord) {
        let marker = {
            "type": "Feature",
            "properties": {
                "iconSize": [60, 60],
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
    new mapboxgl.Marker({anchor: "center"})
        .setLngLat(feature.geometry.coordinates)
        .addTo(map)
})

