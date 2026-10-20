import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Marker, Popup, type Map as MaplibreMap } from "maplibre-gl";
import { createMapPin } from "./mapPin";

export interface CanopMapMarker {
  id: string;
  lat: number;
  lng: number;
  popup?: ReactNode;
}

export interface MapMarkersProps {
  map: MaplibreMap;
  markers: CanopMapMarker[];
}

const POPUP_OFFSET = 14;
const POPUP_MAX_WIDTH = "min(20rem, 86vw)";

function positionKey(markers: CanopMapMarker[]): string {
  return markers.map((marker) => `${marker.id}:${marker.lat}:${marker.lng}`).join("|");
}

export function MapMarkers({ map, markers }: MapMarkersProps) {
  const [popupNodes, setPopupNodes] = useState<Record<string, HTMLElement>>({});
  const key = positionKey(markers);

  useEffect(() => {
    const nodes: Record<string, HTMLElement> = {};
    const instances = markers.map((marker) => {
      const instance = new Marker({
        element: createMapPin(),
        anchor: "bottom",
      }).setLngLat([marker.lng, marker.lat]);
      if (marker.popup) {
        const node = document.createElement("div");
        nodes[marker.id] = node;
        instance.setPopup(
          new Popup({
            offset: POPUP_OFFSET,
            closeButton: false,
            className: "canop-map-popup",
            maxWidth: POPUP_MAX_WIDTH,
          }).setDOMContent(node),
        );
      }
      return instance.addTo(map);
    });
    setPopupNodes(nodes);
    return () => {
      instances.forEach((instance) => instance.remove());
      setPopupNodes({});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, key]);

  return (
    <>
      {markers.map((marker) =>
        marker.popup && popupNodes[marker.id]
          ? createPortal(marker.popup, popupNodes[marker.id], marker.id)
          : null,
      )}
    </>
  );
}
