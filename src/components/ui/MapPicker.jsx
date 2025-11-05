import React, { useState, useCallback, useRef, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, useMapsLibrary } from '@vis.gl/react-google-maps';
import { MapPin, Search } from 'lucide-react';

const PlacesAutocomplete = ({ onPlaceSelect, mapCenter }) => {
  const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
  const inputRef = useRef(null);
  const places = useMapsLibrary('places');

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ['geometry', 'name', 'formatted_address'],
      types: ['geocode', 'establishment']
      // No country restriction - search worldwide
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener('place_changed', () => {
      const place = placeAutocomplete.getPlace();
      if (place.geometry?.location) {
        onPlaceSelect(place);
      }
    });
  }, [onPlaceSelect, placeAutocomplete]);

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-slate-400" />
      </div>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search for any location worldwide..."
        className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm"
      />
    </div>
  );
};

const MapPickerContent = ({ value, onChange, apiKey }) => {
  // Default to Doha, Qatar
  const defaultLocation = { lat: 25.2854, lng: 51.5310 };
  const [markerPosition, setMarkerPosition] = useState(
    value?.lat && value?.lng ? value : defaultLocation
  );
  const [mapCenter, setMapCenter] = useState(markerPosition);
  const [mapZoom, setMapZoom] = useState(13);
  const mapRef = useRef(null);

  const handleMapClick = useCallback((event) => {
    const lat = event.detail.latLng.lat;
    const lng = event.detail.latLng.lng;
    const newPosition = { lat, lng };
    setMarkerPosition(newPosition);
    if (onChange) {
      onChange(newPosition);
    }
  }, [onChange]);

  const handlePlaceSelect = useCallback((place) => {
    const location = place.geometry.location;
    const newPosition = {
      lat: location.lat(),
      lng: location.lng()
    };
    
    setMarkerPosition(newPosition);
    setMapCenter(newPosition);
    setMapZoom(16);
    
    if (onChange) {
      onChange(newPosition);
    }
  }, [onChange]);

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <PlacesAutocomplete onPlaceSelect={handlePlaceSelect} mapCenter={mapCenter} />
      
      {/* Map */}
      <div className="h-[400px] w-full rounded-xl overflow-hidden border-2 border-slate-200 shadow-lg">
        <Map
          center={mapCenter}
          zoom={mapZoom}
          mapId="DEMO_MAP_ID"
          onClick={handleMapClick}
          gestureHandling="greedy"
          disableDefaultUI={false}
          clickableIcons={false}
          styles={[]}
          onCameraChanged={(ev) => {
            setMapCenter(ev.detail.center);
            setMapZoom(ev.detail.zoom);
          }}
        >
          <AdvancedMarker position={markerPosition}>
            <Pin
              background="#10b981"
              borderColor="#059669"
              glyphColor="#ffffff"
            />
          </AdvancedMarker>
        </Map>
      </div>
      
      {/* Coordinates Display */}
      <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg">
        <MapPin className="h-4 w-4 text-emerald-600" />
        <span className="font-medium">Selected Location:</span>
        <span className="font-mono">
          {markerPosition.lat.toFixed(6)}, {markerPosition.lng.toFixed(6)}
        </span>
      </div>
      
      {/* Help Text */}
      <p className="text-xs text-slate-500 text-center">
        Search for a location or click on the map to set your location
      </p>
    </div>
  );
};

const MapPicker = ({ value, onChange, apiKey }) => {
  if (!apiKey) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
        <MapPin className="h-8 w-8 text-amber-600 mx-auto mb-2" />
        <p className="text-sm text-amber-800 font-medium">Map feature not configured</p>
        <p className="text-xs text-amber-600 mt-1">Please add Google Maps API key to environment variables</p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey} libraries={['places']}>
      <MapPickerContent value={value} onChange={onChange} apiKey={apiKey} />
    </APIProvider>
  );
};

export default MapPicker;

