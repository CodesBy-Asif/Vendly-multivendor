import React from "react";

// Sample logos (replace with real sponsor logos)
const sponsors = [
    "https://logos-world.net/wp-content/uploads/2020/04/Sony-Logo.png",
    "https://logos-world.net/wp-content/uploads/2022/11/Acer-Logo.png",
    "https://logos-world.net/wp-content/uploads/2020/04/Samsung-Logo.png",
    "https://logos-world.net/wp-content/uploads/2023/12/CrossFit-Logo-120x67.png",
    "https://logos-world.net/wp-content/uploads/2020/04/Adidas-Logo.png",
    "https://logos-world.net/wp-content/uploads/2020/12/Nivea-Logo.png",
];

const SponsoredLogos = () => {
    return (
        <div className="w-full overflow-hidden bg-accent py-6">
            <div className="relative">
                <div className="animate-scroll whitespace-nowrap flex gap-14">
                    {[...sponsors, ...sponsors].map((logo, index) => (
                        <img
                            key={index}
                            src={logo}
                            alt={`Sponsor ${index}`}
                            className="h-24 w-auto object-contain"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SponsoredLogos;
