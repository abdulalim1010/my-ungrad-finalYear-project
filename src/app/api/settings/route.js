import dbConnect, { Settings } from "@/lib/mongodb";

export async function GET() {
  await dbConnect();
  const settings = await Settings.find().sort({ key: 1 });
  return Response.json(settings);
}

export async function POST(request) {
  await dbConnect();
  const body = await request.json();
  
  const { key, value } = body;
  
  if (!key || value === undefined) {
    return Response.json({ error: "Key and value are required" }, { status: 400 });
  }
  
  const existing = await Settings.findOne({ key });
  
  if (existing) {
    existing.value = value;
    existing.updatedAt = new Date();
    await existing.save();
    return Response.json(existing);
  }
  
  const newSetting = await Settings.create({ key, value });
  return Response.json(newSetting);
}