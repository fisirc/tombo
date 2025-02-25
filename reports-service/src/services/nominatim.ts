/*
{
  "place_id": 230191821,
  "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright",
  "osm_type": "node",
  "osm_id": 9901006052,
  "lat": "20.4130369",
  "lon": "80.5056023",
  "class": "place",
  "type": "village",
  "place_rank": 19,
  "importance": 0.14670416800183103,
  "addresstype": "village",
  "name": "Katezari",
  "display_name": "Katezari, Dhanora Taluka, Gadchiroli, Maharashtra, India",
  "address": {
    "village": "Katezari",
    "state_district": "Gadchiroli",
    "state": "Maharashtra",
    "ISO3166-2-lvl4": "IN-MH",
    "country": "India",
    "country_code": "in"
  },
  "boundingbox": [
    "20.3930369",
    "20.4330369",
    "80.4856023",
    "80.5256023"
  ]
}

*/

interface NominatimResponse {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    lat: string;
    lon: string;
    class: string;
    type: string;
    place_rank: number;
    importance: number;
    addresstype: string;
    name: string;
    display_name: string;
    address: {
        village: string;
        state_district: string;
        state: string;
        country: string;
        country_code: string;
    };
    boundingbox: string[];
}

export async function reverseGeocode(lat: number, lon: number): Promise<NominatimResponse | null> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

    try {
        const response = await fetch(url, {
            headers: { 'User-Agent': 'tombo-geocoder' }
        });
        const data = await response.json();

        if (data.error) {
            console.error('Error:', data.error);
            return null;
        }
        return data;
    } catch (error) {
        console.error('Failed to fetch data:', error);
        return null;
    }
}
