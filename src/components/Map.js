import React, { useEffect, useRef, useState } from "react";
import { FaDirections } from 'react-icons/fa';
import './Map.css';
import FetchLatLng from './FetchLatLng';
import { useNavigate } from "react-router-dom"; 

const mapsApiKey = process.env.REACT_APP_MAPS_API_KEY;

const Map = () => {
    const [places, setPlaces] = useState([]); // State for managing places
    const [selectedPlace, setSelectedPlace] = useState({});
    const [address, setAddress] = useState(""); // State for address
    const [searchMarker, setSearchMarker] = useState(null);
    const [userMarker, setUserMarker] = useState(null);
    const [directionsRenderer, setDirectionsRenderer] = useState(null);
    const [directionsService, setDirectionsService] = useState(null);
    const [popupVisible, setPopupVisible] = useState(false);
    const [geocoder, setGeocoder] = useState(null); // State for geocoder
    const mapRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadScript = (src) => {
            const script = document.createElement("script");
            script.src = src;
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);
        };

        window.initMap = () => {
            const map = new window.google.maps.Map(mapRef.current, {
                center: { lat: 20.5937, lng: 78.9629 },
                zoom: 5,
            });

            // Set user marker to current location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };

                    const userMarkerInstance = new window.google.maps.Marker({
                        position: userLocation,
                        map,
                        icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                    });
                    setUserMarker(userMarkerInstance);
                    map.setCenter(userLocation);
                });
            } else {
                alert("Geolocation is not supported by this browser.");
            }

            const geocoderInstance = new window.google.maps.Geocoder();
            setGeocoder(geocoderInstance);

            const service = new window.google.maps.places.PlacesService(map);
            setDirectionsService(new window.google.maps.DirectionsService());
            const renderer = new window.google.maps.DirectionsRenderer();
            renderer.setMap(map);
            setDirectionsRenderer(renderer);

            const input = document.getElementById("pac-input");
            const autocomplete = new window.google.maps.places.Autocomplete(input);
            autocomplete.bindTo("bounds", map);

            autocomplete.addListener("place_changed", () => {
                const place = autocomplete.getPlace();
                if (!place.geometry) {
                    window.alert("No details available for input: '" + place.name + "'");
                    return;
                }

                map.setCenter(place.geometry.location);
                map.setZoom(15);

                if (searchMarker) {
                    searchMarker.setMap(null);
                }

                const newSearchMarker = new window.google.maps.Marker({
                    position: place.geometry.location,
                    map,
                    title: place.name,
                });
                setSearchMarker(newSearchMarker);

                setSelectedPlace({
                    name: place.name,
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                });
                setPopupVisible(true);

                geocoderInstance.geocode({ location: place.geometry.location }, (results, status) => {
                    if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
                        setAddress(results[0].formatted_address);
                    } else {
                        setAddress("Address not found");
                    }
                });
            });

            // Set markers for fetched places
            places.forEach(place => {
                const marker = new window.google.maps.Marker({
                    position: { lat: place.lat, lng: place.lng },
                    map: map,
                    title: place.id,
                });

                marker.addListener("click", () => {
                    setSelectedPlace({
                        name: place.id,
                        lat: place.lat,
                        lng: place.lng,
                    });
                    setPopupVisible(true);

                    const placeLocation = { lat: place.lat, lng: place.lng };
                    geocoderInstance.geocode({ location: placeLocation }, (results, status) => {
                        if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
                            setAddress(results[0].formatted_address);
                        } else {
                            setAddress("Address not found");
                        }
                    });
                });
            });
        };

        loadScript(`https://maps.googleapis.com/maps/api/js?key=${mapsApiKey}&callback=initMap&libraries=places`);
    }, [places]);

    const searchNearbyPlaces = () => {
        const searchInput = document.getElementById("pac-input").value;
        const travelMode = document.getElementById("travel-mode").value;

        const request = {
            location: userMarker.getPosition(),
            radius: "500",
            query: searchInput,
        };

        const service = new window.google.maps.places.PlacesService(mapRef.current);
        service.textSearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                const place = results[0];
                const destination = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() };

                if (searchMarker) {
                    searchMarker.setMap(null);
                }

                const newSearchMarker = new window.google.maps.Marker({
                    position: destination,
                    map: mapRef.current,
                    title: place.name,
                });
                setSearchMarker(newSearchMarker);

                setSelectedPlace({
                    name: place.name,
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                });
                setPopupVisible(true);

                geocoder.geocode({ location: destination }, (results, status) => {
                    if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
                        setAddress(results[0].formatted_address);
                    } else {
                        setAddress("Address not found");
                    }
                });

                const requestDirections = {
                    origin: userMarker.getPosition(),
                    destination: destination,
                    travelMode: window.google.maps.TravelMode[travelMode],
                };

                directionsService.route(requestDirections, (result, status) => {
                    if (status === window.google.maps.DirectionsStatus.OK) {
                        directionsRenderer.setDirections(result);
                        document.getElementById("directions-panel").innerHTML =
                            "<h3>Directions</h3>" +
                            result.routes[0].legs[0].steps.map((step) => `<p>${step.instructions}</p>`).join("");
                    } else {
                        window.alert("Directions request failed due to " + status);
                    }
                });
            }
        });
    };

    const proceedToBook = () => {
        navigate('/reservation', {
            state: {
                address: address,
                place: selectedPlace.name,
            }
        });
    };

    const getDirections = () => {
        if (directionsService && userMarker) {
            const requestDirections = {
                origin: userMarker.getPosition(),
                destination: { lat: selectedPlace.lat, lng: selectedPlace.lng },
                travelMode: window.google.maps.TravelMode.DRIVING,
            };

            directionsService.route(requestDirections, (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    directionsRenderer.setDirections(result);
                    document.getElementById("directions-panel").innerHTML =
                        "<h3>Directions</h3>" +
                        result.routes[0].legs[0].steps.map((step) => `<p>${step.instructions}</p>`).join("");
                } else {
                    window.alert("Directions request failed due to " + status);
                }
            });
        }
    };

    return (
        <div>
            <input
                id="pac-input"
                type="text"
                placeholder="Search for places"
                style={{ margin: "10px", padding: "5px", width: "200px" }}
            />
            <button onClick={searchNearbyPlaces} style={{ margin: "10px", padding: "5px" }}>Search</button>
            <select id="travel-mode">
                <option value="DRIVING">Driving</option>
                <option value="WALKING">Walking</option>
                <option value="BICYCLING">Bicycling</option>
                <option value="TRANSIT">Transit</option>
            </select>

            <div ref={mapRef} className="map" style={{ height: "500px", width: "100%" }} />

            {popupVisible && (
                <div className="popup">
                    <h3>{selectedPlace.name}</h3>
                    <p>Address: {address}</p>
                    <button onClick={proceedToBook}>Book Now</button>
                    <button onClick={() => setPopupVisible(false)}>Close</button>
                    <button onClick={getDirections}><FaDirections /> Get Directions</button>
                </div>
            )}

            <div id="directions-panel" style={{ marginTop: "20px" }}></div>

            <input id="place-lat" type="hidden" />
            <input id="place-lng" type="hidden" />
        </div>
    );
};

export default Map;
