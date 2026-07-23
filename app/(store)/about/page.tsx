"use client";

import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2">
            Our Story
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            About NXT
          </h1>
          <p className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto leading-relaxed">
            Defining style through modern luxury, premium materials, and minimal design.
          </p>
        </motion.div>

        <div className="space-y-12">
          {/* Section 1 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
          >
            <div>
              <h2 className="text-2xl font-bold mb-4">Modern Minimalism</h2>
              <p className="text-gray-500 leading-relaxed text-sm">
                At NXT, we believe that style is a reflection of identity. We design
                garments that strip away the noise to focus on clean lines, flawless fits,
                and premium construction. Every piece in our collection is crafted to
                be an essential building block of the modern wardrobe.
              </p>
            </div>
            <div className="aspect-[4/3] relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-zinc-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop"
                alt="Minimalist design aesthetic"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Section 2 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
          >
            <div className="order-2 md:order-1 aspect-[4/3] relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-zinc-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=800&auto=format&fit=crop"
                alt="Premium materials"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-2xl font-bold mb-4">Uncompromising Quality</h2>
              <p className="text-gray-500 leading-relaxed text-sm">
                We source only the finest fabrics—from extra-long staple cottons to
                sustainable technical fibers. By partnering with responsible manufacturers
                who share our dedication to craftsmanship, we ensure that every garment is
                built to last and feel exceptional on your skin.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
