"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Instagram } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2">
            Get in Touch
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Contact Us
          </h1>
          <p className="text-gray-500 mt-3 text-lg">
            We&apos;re here to help. Reach out anytime.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {[
              {
                icon: Mail,
                label: "Email",
                value: "support@nxtstore.com",
                href: "mailto:support@nxtstore.com",
              },
              {
                icon: Phone,
                label: "Phone / WhatsApp",
                value: "+20 101 234 5678",
                href: "tel:+201012345678",
              },
              {
                icon: Instagram,
                label: "Instagram",
                value: "@nxtstore",
                href: "#",
              },
              {
                icon: MapPin,
                label: "Location",
                value: "Cairo, Egypt",
                href: null,
              },
            ].map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-medium">{label}</p>
                  {href ? (
                    <a
                      href={href}
                      className="font-semibold hover:opacity-60 transition-opacity"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="font-semibold">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Contact Form */}
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Message
              </label>
              <textarea
                rows={5}
                placeholder="How can we help you?"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none bg-white"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-black text-white rounded-xl font-semibold text-sm hover:bg-gray-900 transition-colors"
            >
              Send Message
            </button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
