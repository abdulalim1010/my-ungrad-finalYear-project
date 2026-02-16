import { clientPromise } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "department_portal");

    // Get total users count
    const totalUsers = await db.collection("users").countDocuments();

    // Get total students count
    const totalStudents = await db.collection("students").countDocuments();

    // Get total academic files count
    const totalAcademicFiles = await db.collection("academic").countDocuments();

    // Get total notices count
    const totalNotices = await db.collection("notices").countDocuments();

    // Get pending items (you can customize this based on your needs)
    const pendingItems = await db.collection("notices").countDocuments({ 
      status: "pending" 
    });

    return Response.json({
      users: totalUsers,
      students: totalStudents,
      academicFiles: totalAcademicFiles,
      notices: totalNotices,
      pending: pendingItems || 0,
    });
  } catch (err) {
    console.error("API /admin/dashboard error:", err);
    return Response.json(
      { error: "Failed to fetch dashboard data", users: 0, students: 0, academicFiles: 0, notices: 0, pending: 0 },
      { status: 500 }
    );
  }
}
