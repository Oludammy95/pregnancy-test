import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Record from "@/models/records";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json(); // read form data
    const patient = new Patient(body);
    await patient.save();
    return NextResponse.json({ success: true, patient });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
