export interface POIResult {
    place: string;
    placeLabel: string;
    description?: string;
    image?: string;
    dist: string;
    source: 'Foursquare' | 'Wikidata';
}

// Alias for backward compatibility
export type WikidataResult = POIResult;

async function fetchFoursquareData(lat: number, lon: number): Promise<POIResult | null> {
    const apiKey = process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY;
    if (!apiKey) {
        console.warn("Foursquare API Key missing, skipping Foursquare fetch.");
        return null;
    }

    // Radius 100m for tight match
    const url = `https://api.foursquare.com/v3/places/search?ll=${lat},${lon}&radius=100&limit=1&fields=fsq_id,name,description,photos,distance`;

    try {
        const res = await fetch(url, {
            headers: {
                'Authorization': apiKey,
                'Accept': 'application/json'
            }
        });

        if (!res.ok) {
            console.error("Foursquare API error:", res.statusText);
            return null;
        }

        const data = await res.json();
        if (data.results && data.results.length > 0) {
            const place = data.results[0];
            let imageUrl = undefined;

            if (place.photos && place.photos.length > 0) {
                const photo = place.photos[0];
                // Construct Foursquare image URL: prefix + size + suffix
                // sizes: original, 300x300, etc.
                imageUrl = `${photo.prefix}original${photo.suffix}`;
            }

            return {
                place: place.fsq_id,
                placeLabel: place.name,
                description: place.description || undefined,
                image: imageUrl,
                dist: (place.distance / 1000).toString(), // meters to km
                source: 'Foursquare'
            };
        }
        return null;
    } catch (err) {
        console.error("Foursquare Fetch Error:", err);
        return null;
    }
}

async function fetchWikidata(lat: number, lon: number, radius: number = 1): Promise<POIResult | null> {
    const query = `
    SELECT ?place ?placeLabel ?description ?image ?dist WHERE {
      SERVICE wikibase:around {
        ?place wdt:P625 ?location .
        bd:serviceParam wikibase:center "Point(${lon} ${lat})"^^geo:wktLiteral .
        bd:serviceParam wikibase:radius "${radius}" . 
      }
      OPTIONAL { ?place schema:description ?description. FILTER(LANG(?description) = "en") }
      OPTIONAL { ?place wdt:P18 ?image. }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
      BIND(geof:distance("Point(${lon} ${lat})"^^geo:wktLiteral, ?location) as ?dist)
    } ORDER BY ASC(?dist) LIMIT 1
  `;

    const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(
        query
    )}&format=json`;

    try {
        const response = await fetch(url, {
            headers: {
                Accept: 'application/sparql-results+json',
                'User-Agent': 'MyTravelBD/1.0 (mailto:your-email@example.com)',
            },
        });

        if (!response.ok) {
            console.error('Wikidata fetch failed:', response.statusText);
            return null;
        }

        const data = await response.json();
        const results = data.results.bindings;

        if (results.length > 0) {
            const result = results[0];
            return {
                place: result.place.value,
                placeLabel: result.placeLabel.value,
                description: result.description?.value,
                image: result.image?.value,
                dist: result.dist.value,
                source: 'Wikidata'
            };
        }

        return null;
    } catch (error) {
        console.error('Error fetching Wikidata:', error);
        return null;
    }
}

export async function fetchNearestWikiData(
    lat: number,
    lon: number,
    radius: number = 1 // Default radius
): Promise<POIResult | null> {

    // 1. Try Foursquare
    try {
        const fsData = await fetchFoursquareData(lat, lon);
        if (fsData) {
            console.log("Found POI in Foursquare:", fsData.placeLabel);
            return fsData;
        }
    } catch (e) {
        console.error("Foursquare attempt failed, falling back...", e);
    }

    // 2. Fallback to Wikidata
    console.log("Checking Wikidata fallback...");
    return await fetchWikidata(lat, lon, radius);
}
