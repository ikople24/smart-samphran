import dbConnect from "@/lib/dbConnect";
import SubmittedReport from "@/models/SubmittedReport";

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case "DELETE":
      try {
        const deletedReport = await SubmittedReport.findByIdAndDelete(id);
        if (!deletedReport) {
          return res.status(404).json({ success: false, message: "ไม่พบเรื่องร้องเรียนนี้" });
        }
        return res.status(200).json({ success: true, message: "ลบเรียบร้อยแล้ว" });
      } catch (error) {
        return res.status(500).json({ success: false, message: "เกิดข้อผิดพลาด", error });
      }
    default:
      res.setHeader("Allow", ["DELETE"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}