import React, { useState } from "react";
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from "react-places-autocomplete";
import { TextField, List, ListItem, ListItemText } from "@mui/material";

/**
 * Helper to parse out typical address fields from a Google geocode result.
 * Adjust or expand for your own needs (country, route, etc.)
 */
function parseAddressComponents(addressComponents) {
    let streetNumber = "";
    let route = "";
    let city = "";
    let state = "";
    let zip = "";

    addressComponents.forEach((component) => {
        const types = component.types;

        if (types.includes("street_number")) {
            streetNumber = component.long_name;
        }
        if (types.includes("route")) {
            route = component.long_name;
        }
        if (types.includes("locality")) {
            // city
            city = component.long_name;
        }
        if (types.includes("administrative_area_level_1")) {
            // state
            state = component.short_name; // or long_name if you want full state name
        }
        if (types.includes("postal_code")) {
            // ZIP code
            zip = component.long_name;
        }
    });

    const street = [streetNumber, route].filter(Boolean).join(" ");
    return { street, city, state, zip };
}

/**
 * Reusable address auto-suggest input with full parse of city, state, zip, etc.
 */
const AddressAutocomplete = ({
    addressValue,
    onChange, // called when user types in the text field
    onSelect, // called when user SELECTS an address, returns full parse
    label = "Address",
}) => {
    const [suggestions, setSuggestions] = useState([]);

    // On user picking a suggestion
    const handleSelect = async (val) => {
        try {
            const results = await geocodeByAddress(val);
            const firstResult = results[0];
            const latLng = await getLatLng(firstResult);

            // Extract the city, street, zip, etc. from address components
            const parsed = parseAddressComponents(firstResult.address_components);

            // Return a combined object to the parent
            onSelect({
                // The full text user sees
                fullAddress: val,
                // The parsed fields
                street: parsed.street,
                city: parsed.city,
                state: parsed.state,
                zip: parsed.zip,
                // lat/lng
                coords: latLng,
            });
        } catch (error) {
            console.error("Error with geocodeByAddress:", error);
        }
    };

    return (
        <PlacesAutocomplete
            value={addressValue}
            onChange={(val) => onChange(val)}
            onSelect={handleSelect}
            onSuggestionsClearRequested={() => setSuggestions([])}
            onSuggestionsFetchRequested={(data) => setSuggestions(data.suggestions)}
        >
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div style={{ position: "relative" }}>
                    <TextField
                        label={label}
                        fullWidth
                        variant="outlined"
                        {...getInputProps()}
                    />
                    {suggestions?.length > 0 && (
                        <List
                            dense
                            sx={{
                                position: "absolute",
                                top: "100%",
                                left: 0,
                                right: 0,
                                bgcolor: "background.paper",
                                boxShadow: 3,
                                zIndex: 10,
                                borderRadius: 1,
                            }}
                        >
                            {loading && (
                                <ListItem>
                                    <ListItemText primary="Loading..." />
                                </ListItem>
                            )}
                            {suggestions.map((suggestion, index) => {
                                const style = {
                                    backgroundColor: suggestion.active ? "#f1f1f1" : "#fff",
                                    cursor: "pointer",
                                };
                                return (
                                    <ListItem
                                        key={index}
                                        {...getSuggestionItemProps(suggestion, { style })}
                                    >
                                        <ListItemText primary={suggestion.description} />
                                    </ListItem>
                                );
                            })}
                        </List>
                    )}
                </div>
            )}
        </PlacesAutocomplete>
    );
};

export default AddressAutocomplete;
