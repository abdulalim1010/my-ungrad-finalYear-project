import EEEcoursesSection from "./admin/dashboard/components/EEEcoursesSection";
import Banner from "./components/Banner";
import UpcomingEvents from "./components/UpcomingEvents";
import GalleryPage from "./gallery/page";
import NewsPage from "./news/page";
import PassedStudentsSection from "./passed-students/components/PassedStudentsSection";



export default function Home() {
  return (
    <div>
      <Banner />
      <UpcomingEvents />
      <EEEcoursesSection/>
      <NewsPage/>

      <GalleryPage />
      
      <PassedStudentsSection/>
    </div>
  );
}
