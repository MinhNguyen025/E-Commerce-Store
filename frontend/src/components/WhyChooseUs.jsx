import React from "react";
import { FaMoneyBillWave, FaShieldAlt, FaHeadphones, FaRocket } from "react-icons/fa";

const WhyChooseUs = () => {
  const features = [
    {
      icon: <FaMoneyBillWave size={40} />,
      title: "Competitive Pricing",
      desc: "We offer the best deals and frequent promotions."
    },
    {
      icon: <FaShieldAlt size={40} />,
      title: "Authorized Warranty",
      desc: "Clear warranty policies, shop with peace of mind."
    },
    {
      icon: <FaHeadphones size={40} />,
      title: "Dedicated Support",
      desc: "Our team is here 24/7 for any inquiries."
    },
    {
      icon: <FaRocket size={40} />,
      title: "Fast Delivery",
      desc: "We ship nationwide, quickly and reliably."
    },
  ];

  return (
    <section className="py-16 px-4 text-white" style={{ backgroundColor: "#1A1A1A" }}>
      <h2 className="text-4xl font-bold text-center mb-8">Why Choose Us?</h2>
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-[#262626] p-6 rounded-lg shadow-md"
          >
            <div className="mb-4 text-red-500">{item.icon}</div>
            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
            <p className="text-sm text-center">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
