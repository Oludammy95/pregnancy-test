import dbConnect from "@/lib/dbConnect";
import molar from "@/model1/molar";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      const newRecord = new Ectopic(req.body);
      await newRecord.save();
      res.status(201).json({ success: true, data: newRecord });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
