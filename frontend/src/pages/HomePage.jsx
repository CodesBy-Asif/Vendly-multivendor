import React from 'react';
import HeroSection from "../components/Home/HeroSection.jsx";
import BrandingSection from "../components/Home/BrandingSection.jsx";
import BestDeals from "../components/Home/BestDeals.jsx";
import EventSections from "../components/Home/EventSections.jsx";
import FeaturedProducts from "../components/Home/FeaturedProduct.jsx";
import Sponsered from "../components/Home/Sponsered.jsx";

function HomePage() {
    return (
     <>
        <HeroSection/>
         <BrandingSection/>
         <BestDeals/>
         <EventSections/>
         <FeaturedProducts/>
         <Sponsered/>
     </>
    );
}

export default HomePage;