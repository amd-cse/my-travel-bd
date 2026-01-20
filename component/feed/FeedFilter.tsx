"use client"

import { useRouter, useSearchParams } from "next/navigation"

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

export default function FeedFilter() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentDistrict = searchParams.get("district") || ""

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const dist = e.target.value
        if (dist) {
            router.push(`/feed?district=${dist}`)
        } else {
            router.push("/feed")
        }
    }

    return (
        <div className="mb-6">
            <select
                value={currentDistrict}
                onChange={handleChange}
                className="w-full md:w-64 p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            >
                <option value="">All Districts</option>
                {DIST.sort().map((dist) => (
                    <option key={dist} value={dist}>
                        {dist}
                    </option>
                ))}
            </select>
        </div>
    )
}
