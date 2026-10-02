"use client";

import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";

import type { City } from "@/data/cities";

type MapComponentProps = {
  targetCity: City;
  onGuess: (latitude: number, longitude: number) => void;
  guessedLocation: {
    latitude: number;
    longitude: number;
  } | null;
  showAnswer: boolean;
  disabled: boolean;
  isDarkMode: boolean;
};

type MapClickHandlerProps = {
  onGuess: (latitude: number, longitude: number) => void;
  disabled: boolean;
};

function MapClickHandler({
  onGuess,
  disabled,
}: MapClickHandlerProps) {
  useMapEvents({
    click(event) {
      if (disabled) {
        return;
      }

      onGuess(
        event.latlng.lat,
        event.latlng.lng,
      );
    },
  });

  return null;
}

export default function MapComponent({
  targetCity,
  onGuess,
  guessedLocation,
  showAnswer,
  disabled,
  isDarkMode,
}: MapComponentProps) {
  const turkeyCenter: [number, number] = [
    39.0,
    35.2,
  ];

  const tileUrl = isDarkMode
    ? `https://basemaps.cartocdn.com/rastertiles/dark_nolabels/{z}/{x}/{y}{r}.png?key=${process.env.NEXT_PUBLIC_CARTO_KEY}`
    : `https://basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}{r}.png?key=${process.env.NEXT_PUBLIC_CARTO_KEY}`;

  return (
    <MapContainer
      center={turkeyCenter}
      zoom={5.6}
      minZoom={5}
      maxZoom={12}
      scrollWheelZoom={true}
      doubleClickZoom={true}
      dragging={true}
      zoomControl={true}
      className="h-full w-full"
    >
      <TileLayer
        key={isDarkMode ? "dark-map" : "light-map"}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url={tileUrl}
        maxZoom={20}
      />

      <MapClickHandler
        onGuess={onGuess}
        disabled={disabled}
      />

      {guessedLocation && (
        <CircleMarker
          center={[
            guessedLocation.latitude,
            guessedLocation.longitude,
          ]}
          radius={9}
          pathOptions={{
            color: "#2563eb",
            fillColor: "#3b82f6",
            fillOpacity: 0.85,
            weight: 3,
          }}
        >
          <Popup>
            <strong>Your Guess</strong>
            <br />
            You clicked here.
          </Popup>
        </CircleMarker>
      )}

      {showAnswer && (
        <CircleMarker
          center={[
            targetCity.latitude,
            targetCity.longitude,
          ]}
          radius={10}
          pathOptions={{
            color: "#dc2626",
            fillColor: "#ef4444",
            fillOpacity: 0.9,
            weight: 3,
          }}
        >
          <Popup>
            <strong>{targetCity.name}</strong>
            <br />
            Correct location
          </Popup>
        </CircleMarker>
      )}
    </MapContainer>
  );
}