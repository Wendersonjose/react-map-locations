import { useEffect, useRef } from "react";
import { Marker } from "react-leaflet";

const TemporaryMarker = ({ position, children }) => {
  const markerRef = useRef(null);

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [position]);

  return (
    <Marker ref={markerRef} position={position} opacity={0.8}>
      {children}
    </Marker>
  );
};

export default TemporaryMarker;
