import React from "react";
import Image from "next/image";

const FeaturesSection = () => {
  return (
    <div id="features" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center space-x-8">
          {/* Feature-3 Image */}
          <div className="flex-1">
            <Image
              src="/images/feature-3.png"
              alt="Feature 3"
              width={300}
              height={150}
              className="w-full h-auto"
            />
          </div>

          {/* Export Image */}
          <div className="flex-1">
            <Image
              src="/images/export.png"
              alt="Export Feature"
              width={300}
              height={150}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
