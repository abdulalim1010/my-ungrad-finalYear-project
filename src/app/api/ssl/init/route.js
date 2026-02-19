import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {

  try {

    const body = await req.json();

    const tran_id = "TXN_" + Date.now();

    const formData = new URLSearchParams({

      store_id: process.env.SSLC_STORE_ID,
      store_passwd: process.env.SSLC_STORE_PASS,

      total_amount: 100,
      currency: "BDT",

      tran_id: tran_id,

      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/ssl/success`,
      fail_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-fail`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-cancel`,

      cus_name: body.name,
      cus_email: body.email,

      product_name: "Department Payment",
      product_category: "Service",
      product_profile: "general",

      value_a: body.name,
      value_b: body.email,

    });

    const response = await axios.post(
      "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
      formData
    );

    console.log("SSL Response:", response.data);

    // ✅ THIS IS THE FIX
    return NextResponse.json({
      url: response.data.GatewayPageURL
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json({
      error: "Payment init failed"
    });

  }

}
