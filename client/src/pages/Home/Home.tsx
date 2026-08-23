import HeroSection from "../../components/home/HeroSection";
import TrustStrip from "../../components/home/TrustStrip";
import ShopByPiercing from "../../components/home/ShopByPiercing";
import NewArrivals from "../../components/home/NewArrivals";
import FeaturedCollections from "../../components/home/FeaturedCollections";
import SpecialPrices from "../../components/home/SpecialPrices";
import MenSection from "../../components/home/MenSection";
import InstagramSection from "../../components/home/InstagramSection";
import BrandStory from "../../components/home/BrandStory";
import CustomerReviews from "../../components/home/CustomerReviews";


function Home() {
  return (
    <>
      <HeroSection />
      <TrustStrip />
      <ShopByPiercing />
      <NewArrivals />
      <MenSection />
      <FeaturedCollections />
      <SpecialPrices />
      
      
      <BrandStory />
      <InstagramSection />
      <CustomerReviews />
    </>
  );
}

export default Home;