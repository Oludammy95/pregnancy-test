import dbConnect from "@/lib/mongodb";
import Record from "@/models/records";


export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json();
    const newRecord = await Record.create(body);

    return new Response(JSON.stringify({ success: true, data: newRecord }), {
      status: 201,
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error }), {
      status: 400,
    });
  }
}
