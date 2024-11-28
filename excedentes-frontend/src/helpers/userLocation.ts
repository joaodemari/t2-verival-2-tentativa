import { useState, useEffect } from 'react';
import http from '../config/axios.config';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const apiKey = import.meta.env.VITE_GOOGLE_API_KEY

interface GeoLocationResponse {
    results: {
        formatted_address: string;
        address_components: {
            long_name: string;
            short_name: string;
            types: string[];
        }[];
    }[];
}

export const useGeoLocation = () => {
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');
    const getLocation = async () => {
        try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const response = await http.get<GeoLocationResponse>(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
            );
            setAddress(response.data.results[0].address_components[1].long_name);
        } catch (error) {
            setError('Não foi possível obter o endereço');
        }
    };

    useEffect(() => {
        void getLocation();
    }, []);
    return { address, error };
};