import React, { useRef, useState } from 'react';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';
import { Input } from '@chakra-ui/react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface AddressInputProps {
    isInvalid: boolean
    register: UseFormRegisterReturn<"address.formattedName">
    onLoadLatLong: ((latitude: number, longitude: number) => void)
}

export default function AddressInput({ isInvalid = false, register, onLoadLatLong }: AddressInputProps) {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
        libraries: ["places"] as ("places")[],
    });


    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const [address, setAddress] = useState("");


    const handleLoad = (autocomplete: google.maps.places.Autocomplete) => {
        autocompleteRef.current = autocomplete;
    };

    const handlePlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            setAddress(place.formatted_address || '');
            onLoadLatLong(place.geometry?.location?.lat() ?? 0, place.geometry?.location?.lng() ?? 0)
        }
    };

    return (
        <div className='w-full'>
            {isLoaded ? (
                <Autocomplete
                    onLoad={handleLoad}
                    onPlaceChanged={handlePlaceChanged}

                >
                    <Input
                        type="text"
                        placeholder="Digite o endereço"
                        {...register}
                        style={{ width: "100%", padding: '16px', border: "1.0px solid #E2E8F0", borderRadius: "7px", height: "40px" }}
                        isInvalid={isInvalid}
                    />
                </Autocomplete>
            ) : (
                <div>Carregando..</div>
            )}
        </div>
    );
};
