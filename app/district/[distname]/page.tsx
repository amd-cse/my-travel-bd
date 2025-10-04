import DistrictMap from "@/component/DistrictMap";
import { notFound } from 'next/navigation';
import { FeatureCollection, Point } from 'geojson';

const DIST = ['Dhaka', "Cox's_Bazar", "Chittagong", "Sylhet", "Bandarban", "Khulna"];

export default async function DistPage({ params }: { params: { distname: string } }) {
    const dName = await params;
    const distName = decodeURIComponent(dName.distname);
    console.log(distName);
    if (!DIST.includes(distName)) {
        notFound()
    }
    let theAbsURL = '';
    if (process.env.VERCEL_URL) {
        theAbsURL = process.cwd();
    }
    else {
        theAbsURL = 'http://localhost:3000'
    }
    const geojsonUrl = theAbsURL + `/geojson/${distName}.geojson`;
    let geojsonData: FeatureCollection<Point>;
    try {
        console.log(geojsonUrl);
        const res = await fetch(geojsonUrl, { next: { revalidate: 3600 } })
        if (!res.ok) throw new Error("Failed to load GEOJSON Data");
        geojsonData = await res.json();
    }
    catch (err) {
        console.error("Fetch Error: ", err);
        notFound();
    }
    console.log("GEOJSON LOADED: ", geojsonData.features.length, ' features');
    return (
        <div className="p-6 max-w 3xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-gray-900">Attractions in {distName}</h1>
            <DistrictMap geojsonData={geojsonData} />

        </div>
    )
}