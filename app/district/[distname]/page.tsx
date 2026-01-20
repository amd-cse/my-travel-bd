import DistrictMap from "@/component/DistrictMap";
import { notFound } from 'next/navigation';
import { FeatureCollection, Point } from 'geojson';
import fs from 'fs/promises';
import path from 'path';

const DIST = ['Dhaka', 'Faridpur', 'Gazipur', 'Gopalganj', 'Kishoreganj', 'Madaripur',
    'Manikganj', 'Munshiganj', 'Narayanganj', 'Narsingdi', 'Rajbari', 'Shariatpur',
    'Tangail', 'Barguna', 'Barisal', 'Bhola', 'Jhalokati', 'Patuakhali', 'Pirojpur',
    'Bandarban', 'Brahmanbaria', 'Chandpur', 'Chittagong', 'Comilla', "Cox's Bazar",
    'Feni', 'Khagrachhari', 'Lakshmipur', 'Noakhali', 'Rangamati', 'Mymensingh',
    'Netrokona', 'Jamalpur', 'Sherpur', 'Bogura', 'Joypurhat', 'Naogaon', 'Natore',
    'Chapainawabganj', 'Pabna', 'Rajshahi', 'Sirajganj', 'Dinajpur', 'Gaibandha',
    'Kurigram', 'Lalmonirhat', 'Nilphamari', 'Panchagarh', 'Rangpur', 'Thakurgaon',
    'Habiganj', 'Moulvibazar', 'Sunamganj', 'Sylhet', 'Bagerhat', 'Chuadanga',
    'Jessore', 'Jhenaidah', 'Khulna', 'Kushtia', 'Magura', 'Meherpur', 'Narail', 'Satkhira'
];

export default async function DistPage({ params }: { params: Promise<{ distname: string }> }) {
    const dName = await params;
    const distName = decodeURIComponent(dName.distname);

    if (!DIST.includes(distName)) {
        notFound()
    }

    // Normalize filename: "Cox's Bazar" -> "Cox's_Bazar.geojson"
    const fileName = distName.replace(/\s+/g, '_') + '.geojson';
    const filePath = path.join(process.cwd(), 'public', 'geojson', fileName);

    let geojsonData: FeatureCollection<Point>;
    try {
        const fileContent = await fs.readFile(filePath, 'utf8');
        geojsonData = JSON.parse(fileContent);
    }
    catch (err) {
        console.error("Local Read Error: ", err);
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