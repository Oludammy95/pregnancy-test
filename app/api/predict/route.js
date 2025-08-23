import dbConnect from "@/lib/mongodb";
import Record from "@/models/records";

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();

    const record = await Record.create(body);

    return new Response(JSON.stringify({ success: true, data: record }), {
      status: 201,
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
    });
  }
}
