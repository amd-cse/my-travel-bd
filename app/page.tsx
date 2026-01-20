'use client';

import BangladeshMap from "@/component/BangladeshMap";
import { Josefin_Sans } from "next/font/google";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Image from "next/image";

export const josefinSans = Josefin_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function Home() {
  return (
    <div className="relative">

      {/* ✅ SLIDER SECTION (TOP) */}
      <div className="relative max-w-7xl h-[400px] mx-auto">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          loop
          className="h-full"
        >
          {[
            "/variant.jpg",
            "/large-Paharpur_Buddhist_Monastery.jpg",
            "/cover-3.jpg",
            "/own-filters-znNOiICXyN4-unsplash.jpg",
            "/iraj-ishtiak-4hx4Tlg8iiI-unsplash.jpg",
            "/9b2ca3996079c3c0b501c8daafeceb5a-hd4.jpg",
            "/ashique-anan-abir-saEnr4oJ950-unsplash.jpg",
          ].map((src) => (
            <SwiperSlide key={src}>
              <div className="relative w-full h-full">
                <Image
                  src={src}
                  alt="Bangladesh slide"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* ✅ HEADER TEXT */}
      <header className="text-center my-8">
        <h1 className={`${josefinSans.className} text-2xl font-medium`}>
          Explore Bangladesh
        </h1>
        <p className={`${josefinSans.className} text-xl font-light`}>
          Click on any district to discover!
        </p>
      </header>

      {/* ✅ MAP SECTION */}
      <div className="max-w-6xl mx-auto mb-10">
        <BangladeshMap />
      </div>

      {/* ✅ FOOTER SECTION */}
      <footer className="bg-black mx-auto text-white w-full mt-16 shadow-[0_-8px_20px_rgba(0,0,0,0.6)]">
        <div className="max-w-7xl mx-auto px-6 py-12">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

            {/* Queries / Help */}
            <div>
              <h3 className={`${josefinSans.className} text-lg font-semibold mb-4`}>
                Queries
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Help Center</li>
                <li>FAQs</li>
                <li>Support</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className={`${josefinSans.className} text-lg font-semibold mb-4`}>
                Contact
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Email: support@mytrip.com</li>
                <li>Phone: +880 1234-567890</li>
              </ul>
            </div>

            {/* Office Location */}
            <div>
              <h3 className={`${josefinSans.className} text-lg font-semibold mb-4`}>
                Office
              </h3>
              <p className="text-sm text-gray-300">
                Dhaka, Bangladesh <br />
                Road 12, Dhanmondi
              </p>
            </div>

            {/* Social Media */}
            <div>
              <h3 className={`${josefinSans.className} text-lg font-semibold mb-4`}>
                Follow Us
              </h3>
              <div className="flex items-center space-x-2 social">
  <a
    href="#"
    className="p-4 rounded-full bg-[black] text-[white] text-xl transition-all duration-200 hover:bg-[white] hover:text-[black]"
  >
    <i className="bx bxl-facebook"></i>
  </a>
  <a
    href="#"
    className="p-4 rounded-full bg-[black] text-[white] text-xl transition-all duration-200 hover:bg-[white] hover:text-[black]"
  >
    <i className="bx bxl-instagram"></i>
  </a>
  <a
    href="#"
    className="p-4 rounded-full bg-[black] text-[white] text-xl transition-all duration-200 hover:bg-[white] hover:text-[black]"
  >
    <i className="bx bxl-twitter"></i>
  </a>
  <a
    href="#"
    className="p-4 rounded-full bg-[black] text-[white] text-xl transition-all duration-200 hover:bg-[white] hover:text-[black]"
  >
    <i className="bx bxl-youtube"></i>
  </a>
</div>

            </div>

          </div>

          {/* Bottom line */}
          <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-400">
            © {new Date().getFullYear()} My Trip. All rights reserved.
          </div>

        </div>
      </footer>

    </div>
  );
}
