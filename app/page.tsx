
import BangladeshMap from "@/component/BangladeshMap";
import Link from "next/link";
const DIST = ['Dhaka', "Cox's_Bazar", "Chittagong", "Sylhet", "Bandarban", "Khulna"];


export default function Home() {
  return (
    // <div className="p-6 max-w-6xl mx-auto">
    //   <h1 className="text-4xl font-semibold mb-6 text-center">Explore Bangladesh</h1>
    //   <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
    //     {DIST.map((dist) => <Link key={dist} href={`/district/${encodeURIComponent(dist.replace(/ /g, "_"))}`}
    //       className="block p-4 bg-black text-white border-blue-900 rounded-md">{dist}</Link>
    //     )}
    //   </div>
    // </div>
    <div className="p-6 max-w-6xl mx-auto">
      <header className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Explore Bangladesh</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">Click on any district to discover! </p>
      </header>
      <div className="mb-10">
        <BangladeshMap />
      </div>
    </div>


  );
}
