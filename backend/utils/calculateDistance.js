/**
 * Calculates the distance between two points on Earth using the Haversine formula.
 * * @param {Number[]} coords1 - Array representing the first user's location [longitude, latitude]
 * @param {Number[]} coords2 - Array representing the second user's location [longitude, latitude]
 * @returns {Number} - The distance in kilometers, rounded to 2 decimal places
 */
function calculateDistance(coords1, coords2) {
    // Destructure the arrays assuming MongoDB GeoJSON order: [longitude, latitude]
    const [lon1, lat1] = coords1;
    const [lon2, lat2] = coords2;

    // Helper function to convert degrees to radians
    const toRadians = (degree) => (degree * Math.PI) / 180;

    const R = 6371; // Earth's mean radius in kilometers

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const radLat1 = toRadians(lat1);
    const radLat2 = toRadians(lat2);

    // Haversine formula
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;

    // Return the distance rounded to 2 decimal places
    return parseFloat(distance.toFixed(2));
}

module.exports = { calculateDistance };