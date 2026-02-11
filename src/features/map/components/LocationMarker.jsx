import React, { useEffect } from 'react';
import { useMapEvents } from 'react-leaflet';
import useStore from '../../../store/useStore';

const LocationMarker = () => {
  const { setSelectedLocation } = useStore();

  useMapEvents({
    click(e) {
      setSelectedLocation({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        name: ''
      });
    }
  });

  return null;
};

export default LocationMarker;
