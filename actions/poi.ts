'use server';

export interface POIResult {
    place: string;
    placeLabel: string;
    description?: string;
    image?: string;
    dist: string;
    source: 'Foursquare' | 'Wikidata';
}

// Alias for backward compatibility if needed
export type WikidataResult = POIResult;

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
            cache: 'no-store'
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

export async function fetchNearestPOIData(
    lat: number,
    lon: number,
    radius: number = 1
): Promise<POIResult | null> {
    // Exclusively fetch from Wikidata as requested
    console.log("Fetching POI data from Wikidata...");
    return await fetchWikidata(lat, lon, radius);
}
