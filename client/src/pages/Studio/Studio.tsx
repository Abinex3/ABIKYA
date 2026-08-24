// src/pages/Studio.tsx

import StudioHero from "../../components/studio/StudioHero";
import StudioIntro from "../../components/studio/StudioIntro";
import StudioGallery from "../../components/studio/StudioGallery";
import TattooExperience from "../../components/studio/TattooExperience";
import TattooGallery from "../../components/studio/TattooGallery";
import PiercingExperience from "../../components/studio/PiercingExperience";
import StudioLocation from "../../components/studio/StudioLocation";
import StudioCTA from "../../components/studio/StudioCTA";








const Studio = () => {
  return (
    <main>
      <StudioHero />
      <StudioIntro />
      <StudioGallery />
      <TattooExperience />
      <TattooGallery />
      <PiercingExperience />
      <StudioLocation />
            <StudioCTA />

    </main>
  );
};

export default Studio;