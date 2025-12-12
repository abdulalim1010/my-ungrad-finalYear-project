import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const students = await db.collection("students").find({}).toArray();
    return new Response(JSON.stringify(students), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch students" }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const result = await db.collection("students").insertOne(data);
    return new Response(JSON.stringify({ insertedId: result.insertedId }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to save student" }), { status: 500 });
  }
}
