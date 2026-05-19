import { clientPromise } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "departmentDB");
    const collection = db.collection("teachers");

    if (id) {
      const { ObjectId } = await import("mongodb");
      const teacher = await collection.findOne({ _id: new ObjectId(id) });
      if (!teacher) {
        return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
      }
      return NextResponse.json(teacher);
    }

    const teachers = await collection.find({}).toArray();
    return NextResponse.json(teachers);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return NextResponse.json({ error: "Failed to fetch teachers" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "departmentDB");
    const collection = db.collection("teachers");

    const teacherData = await request.json();

    // Validate required fields
    if (!teacherData.name || !teacherData.designation) {
      return NextResponse.json(
        { error: "Name and designation are required" },
        { status: 400 }
      );
    }

    // Set defaults
    const teacher = {
      name: teacherData.name,
      designation: teacherData.designation,
      department: teacherData.department || "Electrical & Electronic Engineering",
      email: teacherData.email || "",
      phone: teacherData.phone || "",
      image: teacherData.image || "/default-teacher.jpg",
      bio: teacherData.bio || "",
      education: teacherData.education || [],
      experience: teacherData.experience || [],
      researchActivities: teacherData.researchActivities || [],
      publications: teacherData.publications || [],
      awards: teacherData.awards || [],
      membership: teacherData.membership || [],
      // Special flags
      isHOD: teacherData.isHOD || false,
      isAbroad: teacherData.isAbroad || false,
      abroadCountry: teacherData.abroadCountry || "",
      abroadUniversity: teacherData.abroadUniversity || "",
      isPhD: teacherData.isPhD || false,
      phdField: teacherData.phdField || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(teacher);
    return NextResponse.json({
      message: "Teacher added successfully",
      teacherId: result.insertedId,
    });
  } catch (error) {
    console.error("Error adding teacher:", error);
    return NextResponse.json({ error: "Failed to add teacher" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Teacher ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "departmentDB");
    const collection = db.collection("teachers");

    const updateData = await request.json();
    const { ObjectId } = await import("mongodb");

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Teacher updated successfully",
      teacher: result,
    });
  } catch (error) {
    console.error("Error updating teacher:", error);
    return NextResponse.json({ error: "Failed to update teacher" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Teacher ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "departmentDB");
    const collection = db.collection("teachers");

    const { ObjectId } = await import("mongodb");

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Teacher deleted successfully" });
  } catch (error) {
    console.error("Error deleting teacher:", error);
    return NextResponse.json({ error: "Failed to delete teacher" }, { status: 500 });
  }
}

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "departmentDB");
    const collection = db.collection("teachers");

    const { ObjectId } = await import("mongodb");

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Teacher deleted successfully" });
  } catch (error) {
    console.error("Error deleting teacher:", error);
    return NextResponse.json({ error: "Failed to delete teacher" }, { status: 500 });
  }
}
