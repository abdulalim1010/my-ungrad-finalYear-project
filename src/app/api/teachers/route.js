import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("departmentDB");
    const collection = db.collection("teachers");

    const teachers = await collection.find({}).toArray();
    return new Response(JSON.stringify(teachers), { status: 200 });
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return new Response(JSON.stringify([]), { status: 500 });
  }
}
