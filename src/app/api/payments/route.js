import dbConnect, { Payment } from "@/lib/mongodb";

export async function GET() {

  await dbConnect();

  const payments = await Payment.find().sort({ date: -1 });

  return Response.json(payments);
}
