import React from "react";
import commercial3 from "../images/commercial_3.jpg"; // Đảm bảo đường dẫn đúng
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section
      className="flex flex-col items-center justify-center text-center text-white py-16 px-4"
      style={{
        backgroundImage: `url(${commercial3})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay",
        backgroundColor: "rgba(26, 26, 26, 0.7)",
      }}
    >
      <h1 className="text-5xl font-bold mb-4">Your One-stop Tech Shop</h1>
      <p className="text-xl max-w-2xl mb-8">
        Discover the latest and greatest in tech products.
      </p>
    <Link
        to="/shop"
        className="bg-white text-[#DC2626] font-bold rounded-full py-3 px-8
                   hover:bg-gray-200 transition duration-300"
      >
        Shop Now
      </Link>
    </section>
  );
};

export default HeroSection;
