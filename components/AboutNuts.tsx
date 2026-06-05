"use client";
import { motion } from "framer-motion";
import { 
  Smartphone, 
  Shirt, 
  Armchair, 
  Watch, 
  Coffee, 
  Gift, 
  Dumbbell, 
  Sparkles 
} from "lucide-react";
import React from "react";

const departmentData = [
  { id: 1, title: "Electronics", color: "bg-[#d1e7d2]", icon: <Smartphone size={48} className="text-emerald-700" /> },
  { id: 2, title: "Apparel", color: "bg-[#e7decb]", icon: <Shirt size={48} className="text-amber-700" /> },
  { id: 3, title: "Furniture", color: "bg-[#d1e2e0]", icon: <Armchair size={48} className="text-teal-700" /> },
  { id: 4, title: "Accessories", color: "bg-[#e2d1d4]", icon: <Watch size={48} className="text-rose-700" /> },
  { id: 5, title: "Kitchenware", color: "bg-[#d1e7d2]", icon: <Coffee size={48} className="text-emerald-700" /> },
  { id: 6, title: "Lifestyle", color: "bg-[#e7decb]", icon: <Gift size={48} className="text-amber-700" /> },
  { id: 7, title: "Fitness", color: "bg-[#d1e2e0]", icon: <Dumbbell size={48} className="text-teal-700" /> },
  { id: 8, title: "Beauty", color: "bg-[#e2d1d4]", icon: <Sparkles size={48} className="text-rose-700" /> },
];

const AboutNutsSec = () => {
  const description = "Premium quality curation handpicked for your lifestyle.";

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl font-black text-black mb-4 tracking-tighter uppercase"
          >
            Shop by Department
          </motion.h2>
          <p className="text-gray-500 font-medium text-lg">
            Explore our curated collections across lifestyle, home, and tech
          </p>
        </div>

        {/* Redesigned Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-8">
          {departmentData.map((dept, index) => (
            <motion.div
              key={dept.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center group"
            >
              {/* Circular Background Container */}
              <div
                className={`relative w-48 h-48 rounded-full ${dept.color} flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-6 shadow-sm`}
              >
                <div className="relative w-32 h-32 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  {dept.icon}
                </div>
              </div>

              {/* Text Content */}
              <h3 className="text-2xl font-black text-black mb-3 tracking-tight uppercase">
                {dept.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-[200px] font-medium">
                {description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutNutsSec;
