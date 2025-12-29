'use client';
import React, { useState, useRef } from "react";
import { GoogleMap, Marker, useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import globalStyles from "@/globalStyles/InputStyles.module.css";
import styles from "./MapPicker.module.css";

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number, address?: string) => void;
  initialLat?: number;
  initialLng?: number;
}

export default function MapPicker({
  onLocationSelect,
  initialLat = 25.276987,
  initialLng = 55.296249
}: MapPickerProps) {
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    { lat: initialLat, lng: initialLng }
  );
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places']
  });

  if (!isLoaded) return <div>Loading map...</div>;

  const geocoder = new google.maps.Geocoder();

  const fetchAddressFromLatLng = (lat: number, lng: number) => {
    return new Promise<string | undefined>((resolve) => {
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          resolve(results[0].formatted_address);
        } else {
          resolve(undefined);
        }
      });
    });
  };

  const handleMapClick = async (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarker({ lat, lng });

      const address = await fetchAddressFromLatLng(lat, lng);
      onLocationSelect(lat, lng, address);
    }
  };

  const handleMarkerDragEnd = async (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarker({ lat, lng });

      const address = await fetchAddressFromLatLng(lat, lng);
      onLocationSelect(lat, lng, address);
    }
  };

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (place?.geometry?.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const address = place.formatted_address;

      setMarker({ lat, lng });
      map?.panTo({ lat, lng });
      onLocationSelect(lat, lng, address);
    }
  };

  return (
    <div>
      <label className={globalStyles.inputLabel}>Event Location</label>
      <Autocomplete
        onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
        onPlaceChanged={handlePlaceChanged}
      >
        <input
          type="text"
          placeholder="Search for a place"
          className={styles.locationSearchBar}
        />
      </Autocomplete>

      <GoogleMap
        mapContainerClassName={styles.map}
        center={marker ?? { lat: initialLat, lng: initialLng }}
        zoom={12}
        onClick={handleMapClick}
        onLoad={(mapInstance) => setMap(mapInstance)}
      >
        {marker && (
          <Marker
            position={marker}
            draggable
            onDragEnd={handleMarkerDragEnd}
          />
        )}
      </GoogleMap>

      <p className={styles.notice}>Hold & Drag the red pin to set the location of the event</p>
    </div>
  );
}
