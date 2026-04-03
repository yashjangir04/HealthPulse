const axios = require("axios");

const getCoordinates = async (address) => {
    const res = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
            params: {
                q: address,
                format: "json",
                limit: 1
            },
            headers: {
                "User-Agent": "healthpulse-app"
            }
        }
    );

    if (res.data.length === 0) {
        throw new Error("Address not found");
    }

    const place = res.data[0];
    return [parseFloat(place.lon), parseFloat(place.lat)];
};

module.exports = getCoordinates;