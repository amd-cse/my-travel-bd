import Image from "next/image";
import Link from "next/link";
const DIST = ['Dhaka', "Cox's Bazar"];


export default function Home() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-semibold mb-6 text-center">Explore Bangladesh</h1>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {DIST.map((dist) => <Link key={dist} href={`/district/${encodeURIComponent(dist.replace(/ /g, "_"))}`}
          className="block p-4 bg-black text-white border-blue-900 rounded-md">{dist}</Link>
        )}
      </div>
    </div>
  );
}
