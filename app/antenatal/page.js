"use client";
import { useEffect, useState } from "react";
import Header from "../../components/Header"; // Adjust path

export default function AntenatalPage() {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await fetch("/api/predict/antenatal");
        const data = await res.json();
        setArticle(data);
      } catch (error) {
        console.error("Error fetching antenatal article:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, []);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  if (!article)
    return (
      <div className="text-center py-20 text-red-600">
        Failed to load article.
      </div>
    );

  return (
    <Header>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Article Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-900">
          {article.title}
        </h1>

        {/* Article Sections */}
        {article.sections.map((section, idx) => (
          <div key={idx} className="mb-8">
            {section.heading && (
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                {section.heading}
              </h2>
            )}

            {section.paragraphs &&
              section.paragraphs.map((para, pIdx) => (
                <p key={pIdx} className="text-gray-700 mb-3 leading-relaxed">
                  {para}
                </p>
              ))}

            {section.list && (
              <ul className="list-disc list-inside text-gray-700 ml-4">
                {section.list.map((item, lIdx) => (
                  <li key={lIdx} className="mb-2">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

      </div>
    </Header>
  );
}
