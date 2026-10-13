"use client";

import { useEffect, useRef } from "react";

const campusCoordinates: [number, number] = [-6.1663, 106.834];

export function CampusMap() {
  const mapElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: import("leaflet").Map | undefined;
    let cancelled = false;

    void import("leaflet").then(({ default: L }) => {
      if (cancelled || !mapElement.current) return;

      map = L.map(mapElement.current, {
        scrollWheelZoom: false,
        zoomControl: true,
        attributionControl: true
      }).setView(campusCoordinates, 16);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      L.marker(campusCoordinates, {
        icon: L.divIcon({
          className: "campus-map-marker-icon",
          html: '<span aria-hidden="true"></span>',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        }),
        title: "SMK Negeri 1 Jakarta"
      }).addTo(map).bindPopup("SMK Negeri 1 Jakarta");
    });

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, []);

  return <div className="campus-map-frame">
    <div className="campus-leaflet-map" ref={mapElement} role="application" aria-label="Peta interaktif lokasi SMK Negeri 1 Jakarta" />
    <p className="campus-map-coordinates">Koordinat referensi: -6.1663, 106.8340</p>
    <a className="campus-map-link" href="https://www.openstreetmap.org/?mlat=-6.1663&mlon=106.8340#map=16/-6.1663/106.8340" target="_blank" rel="noreferrer">Buka peta berdasarkan koordinat ↗</a>
  </div>;
}
