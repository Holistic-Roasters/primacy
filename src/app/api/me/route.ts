import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { CUSTOMER_INFO } from "@/constants/AUTH";

export async function GET() {
  const cookieStore = await cookies();
  const customerInfo = cookieStore.get(CUSTOMER_INFO);

  if (!customerInfo || !customerInfo.value) {
    return NextResponse.json({ customer: null }, { status: 200 });
  }

  try {
    // Parse JSON if present
    const customer = JSON.parse(customerInfo.value);
    return NextResponse.json({ customer }, { status: 200 });
  } catch {
    return NextResponse.json({ customer: null }, { status: 200 });
  }
}
