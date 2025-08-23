"use client";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Link from "next/link";
import {
  HeartIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const Home = () => {
  const [antenatal, setAntenatal] = useState(null);

  useEffect(() => {
    async function fetchAntenatal() {
      try {
        const res = await fetch("/api/predict/Antenatal");
        const data = await res.json();
        setAntenatal(data);
      } catch (error) {
        console.error("Error fetching antenatal article:", error);
      }
    }
    fetchAntenatal();
  }, []);

  const features = [
    {
      icon: UserGroupIcon,
      title: "Ante-Natal Care",
      description:
        "Learn about the importance of ante-natal care and how it helps pregnant women stay healthy.",
      href: "/antenatal",
      color: "from-green-500 to-teal-600",
      buttonText: "Read",
    },
    {
      icon: HeartIcon,
      title: "Ectopic Pregnancy Risk Assessment",
      description:
        "AI model to evaluate risk factors for ectopic pregnancy with comprehensive patient data analysis.",
      href: "/ectopic",
      color: "from-red-500 to-pink-600",
      buttonText: "Start",
    },
    {
      icon: UserGroupIcon,
      title: "Molar Pregnancy Risk Assessment",
      description:
        "Specialized prediction model for molar pregnancy risk based on clinical symptoms and laboratory findings.",
      href: "/molar",
      color: "from-blue-500 to-purple-600",
      buttonText: "Start",
    },
  ];

  const benefits = [
    {
      icon: ShieldCheckIcon,
      title: "AI-Powered Accuracy",
      description:
        "Trained on comprehensive datasets for reliable risk assessment",
    },
    {
      icon: ChartBarIcon,
      title: "Evidence-Based",
      description:
        "Built on clinical guidelines and validated medical research",
    },
    {
      icon: ClockIcon,
      title: "Quick Results",
      description:
        "Get instant risk assessment to aid clinical decision-making",
    },
  ];

  return (
    <Header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            PregnancyCare AI
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            AI-powered risk assessment tools for early detection and
            prevention of pregnancy complications. Supporting healthcare
            professionals with data-driven insights.
          </p>

          {/* Important Notice */}
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-8 max-w-4xl mx-auto">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-5 w-5 text-amber-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-amber-700">
                  <strong>Medical Disclaimer:</strong> This tool is designed to
                  assist healthcare professionals and should not replace
                  clinical judgment or professional medical consultation. Always
                  consult with qualified medical personnel for diagnosis and
                  treatment decisions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Assessment Tools */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link
                key={index}
                href={feature.href}
                className="group relative bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {feature.description}
                </p>
                <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                  {feature.buttonText}
                  <svg
                    className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Benefits Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose PregnancyCare AI?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our AI models provide healthcare professionals with
            reliable tools for early risk assessment and intervention planning.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="text-center">
                <div className="inline-flex p-4 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 mb-4">
                  <Icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-6 opacity-90">
            Choose an assessment tool to begin your risk evaluation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/ectopic"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Ectopic Pregnancy Assessment
            </Link>
            <Link
              href="/molar"
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors"
            >
              Molar Pregnancy Assessment
            </Link>
          </div>
        </div>
      </div>
    </Header>
  );
};

export default Home;
