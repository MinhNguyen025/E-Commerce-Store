// src/components/AboutUs.jsx
import React from "react";
import commercial3 from "../images/commercial_3.jpg"; // Ensure the path is correct

const AboutUs = () => {
  return (
    <section
      id="about-us" // Unique ID for navigation
      className="bg-[#1a1a1a] text-white py-16 px-4"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center">
        <div className="md:w-1/2">
          <h2 className="text-4xl font-bold mb-4">About Us</h2>
          <p className="text-lg mb-6">
            We are a leading technology store offering the latest and greatest products from reputable brands. Our goal is to provide an exceptional experience for our customers, continuously striving to improve and expand our services.
          </p>
          <button
            className="bg-[#dc2626] text-white font-semibold py-2 px-6 rounded-full
                       hover:bg-red-700 transition duration-300"
          >
            Learn More
          </button>
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0 md:pl-12">
          <img
            src={commercial3}
            alt="About Us"
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
