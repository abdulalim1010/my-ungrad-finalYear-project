import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db("departmentDB");
    const collection = db.collection("students");

    const result = await collection.insertOne(body);

    return new Response(
      JSON.stringify({ success: true, insertedId: result.insertedId }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving student:", error);
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("departmentDB");
    const collection = db.collection("students");

    const students = await collection.find({}).toArray();

    return new Response(JSON.stringify(students), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify([]), { status: 500 });
  }
}
