import dbConnect, { Settings } from "@/lib/mongodb";

export async function GET() {
  await dbConnect();
  const settings = await Settings.find().sort({ key: 1 });
  return Response.json(settings);
}

export async function POST(request) {
  await dbConnect();
  const body = await request.json();
  
  if (typeof body !== "object" || !body) {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }
  
  const results = [];
  
  for (const [key, value] of Object.entries(body)) {
    const existing = await Settings.findOne({ key });
    
    if (existing) {
      existing.value = value;
      existing.updatedAt = new Date();
      await existing.save();
      results.push(existing);
    } else {
      const newSetting = await Settings.create({ key, value });
      results.push(newSetting);
    }
  }
  
  return Response.json({ success: true, results });
}