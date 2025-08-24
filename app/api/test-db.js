import dbConnect from "@/lib/mongodb";

export default async function handler(req, res) {
  try {
    // Try to connect to MongoDB
    await dbConnect();
    res.status(200).json({
      success: true,
      message: "MongoDB connected successfully ✅",
      uri: process.env.MONGODB_URI ? "Loaded from env 🔑" : "Missing ❌",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
}
