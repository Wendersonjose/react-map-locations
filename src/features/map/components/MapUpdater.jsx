import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import useStore from '../../../store/useStore';

const MapUpdater = () => {
  const map = useMap();
  const { mapCenter, mapZoom } = useStore();

  useEffect(() => {
    if (mapCenter) {
      map.flyTo(mapCenter, mapZoom || 13, {
        duration: 1.2
      });
    }
  }, [mapCenter, mapZoom, map]);

  return null;
};

export default MapUpdater;
