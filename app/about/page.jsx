"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { Loader } from "lucide-react";

const About = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen bg-black">
          <Loader size={50} className="animate-spin text-gray-400" />
        </div>
      ) : (
        <main className="bg-white min-h-screen text-gray-900 font-sans">
          {/* Hero Section */}
          <header className="flex flex-col justify-center items-center min-h-screen text-center bg-black text-white px-6 md:px-20">
            <h1 className="text-5xl font-extrabold mb-8 tracking-tight">
              About Webwiz Creation
            </h1>
            <p className="max-w-3xl text-lg leading-relaxed mb-6">
              At Webwiz Creation, we transform your ideas into exceptional digital experiences. Our expert team combines creativity and technical expertise to deliver tailored web solutions that empower your business.
            </p>
            <p className="max-w-3xl text-lg leading-relaxed mb-10">
              Our mission is to turn your vision into reality through innovative solutions and relentless dedication. Partner with us for digital products designed to exceed expectations.
            </p>
            <p className="text-gray-400 text-sm">
              Are you a developer seeking collaboration?{" "}
              <Link href="/registration">
                <p className="text-white underline hover:text-gray-300 transition">
                  Register now
                </p>
              </Link>{" "}
              to join the Webwiz team.
            </p>
          </header>

          {/* Services Section */}
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto max-w-7xl px-6">
              <h2 className="text-4xl font-bold text-center mb-14 tracking-wide">
                What Sets Us Apart
              </h2>
              <div className="grid gap-10 md:grid-cols-3">
                {[
                  {
                    title: "Responsive Web Design",
                    desc:
                      "Crafting visually stunning, mobile-optimized websites that adapt flawlessly across devices.",
                  },
                  {
                    title: "SEO Optimization",
                    desc:
                      "Boosting your brand's visibility with strategic and ethical search engine optimization.",
                  },
                  {
                    title: "User-Centric Development",
                    desc:
                      "Designing intuitive interfaces focused on user engagement and satisfaction.",
                  },
                ].map(({ title, desc }) => (
                  <div
                    key={title}
                    className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-2xl font-semibold mb-4">{title}</h3>
                    <p className="text-gray-700 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Journey Section */}
          <section className="py-16 bg-gray-900 text-white">
            <div className="container mx-auto max-w-5xl px-6">
              <h2 className="text-4xl font-bold text-center mb-14 tracking-wide">
                Our Journey
              </h2>
              <div className="grid gap-10 md:grid-cols-2">
                <div className="bg-gray-800 rounded-lg p-8 shadow-lg">
                  <h3 className="text-3xl font-semibold mb-3">2024</h3>
                  <p className="leading-relaxed">
                    Founded with a vision to revolutionize web design and deliver value-driven, client-focused solutions.
                  </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-8 shadow-lg">
                  <h3 className="text-3xl font-semibold mb-3">2025</h3>
                  <p className="leading-relaxed">
                    Expanded our global footprint, serving clients across 10+ countries with diverse industry expertise.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto max-w-7xl px-6 text-center">
              <h2 className="text-4xl font-bold mb-14 tracking-wide text-gray-900">
                What Our Clients Say
              </h2>
              <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
                <blockquote className="bg-white p-8 rounded-lg shadow-md italic text-gray-700">
                  “Webwiz Creation turned our ideas into an incredible website! Their attention to detail and creativity exceeded our expectations.”
                  <footer className="mt-6 font-semibold text-gray-900">— Sarah A.</footer>
                </blockquote>
                <blockquote className="bg-white p-8 rounded-lg shadow-md italic text-gray-700">
                  “The team was professional, timely, and a pleasure to work with. Highly recommended!”
                  <footer className="mt-6 font-semibold text-gray-900">— Mike T.</footer>
                </blockquote>
              </div>
            </div>
          </section>
        </main>
      )}
      <Footer />
    </>
  );
};

export default About;
