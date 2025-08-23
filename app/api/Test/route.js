// app/api/Test/route.js
import dbConnect from "@/lib/mongodb";
import Record from "@/models/records";

// GET all records
export async function GET() {
  try {
    await dbConnect();
    const records = await Record.find({});
    return Response.json({ success: true, count: records.length, records });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST a new record
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const newRecord = await Record.create(body);
    return Response.json({ success: true, record: newRecord });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
