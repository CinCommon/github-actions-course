class PolylineDecoder {
    constructor() {
        this.DEFAULT_PRECISION = 1E5;
    }

    decode(encoded, precision = this.DEFAULT_PRECISION) {
        const track = [];
        let index = 0;
        let lat = 0, lng = 0;

        while (index < encoded.length) {
            let b, shift = 0, result = 0;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
            lat += dlat;

            shift = 0;
            result = 0;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
            lng += dlng;

            const p = { lat: lat / precision, lng: lng / precision };
            track.push(p);
        }
        return track;
    }
}
const decoder = new PolylineDecoder()
//const decoder = new PolylineDecoder();
//const encodedPolyline = "your_encoded_polyline_here";
//const decodedPoints = decoder.decode(encodedPolyline);
//console.log(decodedPoints);
export const decode = (encoded) => decoder.decode(atob(encoded));

export default PolylineDecoder;