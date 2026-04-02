
import ViewCounter from "@/app/components/ViewCounter";
import { clientPromise } from "@/lib/mongodb";

export const dynamic = 'force-dynamic';

export default async function SingleNews({ params }) {
  // ✅ Next.js 16 requires await
  const { slug } = await params;

  if (!clientPromise) {
    return <div className="p-10 text-center">Database not configured</div>;
  }

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB || "department_portal");

  // ✅ DEFINE news
  const news = await db.collection("news").findOne({ slug });

  if (!news) {
    return <div className="p-10 text-red-500">News not found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">

      <h1 className="text-4xl font-bold text-gray-900">
        {news.title}
      </h1>

      {/* 👁 VIEW COUNTER (CLIENT) */}
      <ViewCounter slug={slug} />

      <img
        src={news.image}
        alt={news.title}
        className="w-full h-[420px] object-cover rounded-xl my-8"
      />

      <p className="text-gray-700 text-lg leading-8">
        {news.content}
      </p>
    </div>
  );
}
