import Head from "next/head";

import EEEcoursesSection from "./admin/dashboard/components/EEEcoursesSection";
import Banner from "./components/Banner";
import UpcomingEvents from "./components/UpcomingEvents";
import GalleryPage from "./gallery/page";
import NewsPage from "./news/page";
import PassedStudentsSection from "./passed-students/components/PassedStudentsSection";
import PaymentSection from "./components/PaymentSection";

export default function Home() {
  return (
    <>
      <Head>
        <title>
          EEE Department BRUR | Begum Rokeya University Rangpur
        </title>

        <meta
          name="description"
          content="EEE Department of Begum Rokeya University (BRUR). Department Management System for students, faculty, courses, notices, and academic activities."
        />

        <meta
          name="keywords"
          content="BRUR, EEE Department BRUR, Begum Rokeya University, EEE BRUR, department management system, BRUR project"
        />
      </Head>

      <div>
        {/* Hidden SEO Text */}
        <div style={{ display: "none" }}>
          EEE Department of BRUR - Begum Rokeya University Rangpur.
          Department management system for students and faculty.
        </div>

        <Banner />
        <UpcomingEvents />
        <PaymentSection/>
        <EEEcoursesSection />
        <NewsPage />
        <GalleryPage />
        <PassedStudentsSection />
      </div>
    </>
  );
}