"use client";
export default function FeatureSection() {
  const features = [
    "Free Random Video Chat",
    "No Signup Required",
    "Secure & Fast",
    "Real-Time Connection",
    "Mobile Friendly",
    "Audio + Video + Text",
  ];

  return (
    <section className="px-6 md:px-20 py-12 bg-white">
      <h2 className="text-3xl font-bold text-center mb-10 text-green-800">Why Choose Hello?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <div
            key={i}
            className="bg-gradient-to-r from-blue-100 to-green-100 p-6 rounded-xl text-center shadow-md"
          >
            <h3 className="text-xl font-semibold">{feature}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
