import dbConnect, { Payment } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {

  await dbConnect();

  const data = await req.formData();

  const paymentData = {

    name: data.get("value_a"),
    email: data.get("value_b"),
    amount: Number(data.get("amount")),
    transactionId: data.get("tran_id"),
    status: data.get("status"),

  };

  await Payment.create(paymentData);

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success`
  );
}
