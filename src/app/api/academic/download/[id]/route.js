import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import cloudinary from "@/lib/cloudinary";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const file = await db
      .collection("academic")
      .findOne({ _id: new ObjectId(id) });

    if (!file) {
      return new Response("File not found", { status: 404 });
    }

    // Get Cloudinary URL - strip query params
    let cloudinaryUrl = (file.downloadUrl || file.fileUrl).split("?")[0];
    
    // Fetch file from Cloudinary
    let cloudRes = await fetch(cloudinaryUrl, {
      headers: {
        "Accept": "application/octet-stream",
      },
    });

    // If fetch fails with 401, try signed URL for raw files
    if (!cloudRes.ok && file.publicId && ["pdf", "docx", "doc"].includes(file.fileType?.toLowerCase())) {
      console.log("Trying signed URL for authenticated file...");
      
      // Generate signed URL that expires in 1 hour
      const signedUrl = cloudinary.url(file.publicId, {
        resource_type: "raw",
        type: "upload",
        sign_url: true,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
      });
      
      cloudinaryUrl = signedUrl;
      cloudRes = await fetch(signedUrl, {
        headers: {
          "Accept": "application/octet-stream",
        },
      });
    }

    if (!cloudRes.ok) {
      console.error("Cloudinary fetch error:", cloudRes.status, cloudRes.statusText);
      return new Response("Failed to fetch file from storage", { status: cloudRes.status });
    }

    const buffer = await cloudRes.arrayBuffer();
    
    // Determine content type from fileType or file extension
    const fileExt = file.fileName?.split('.').pop()?.toLowerCase() || '';
    const fileType = file.fileType?.toLowerCase() || '';
    
    let contentType;
    if (fileType === 'pdf' || fileExt === 'pdf') {
      contentType = 'application/pdf';
    } else if (fileType === 'docx' || fileExt === 'docx') {
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    } else if (fileType === 'doc' || fileExt === 'doc') {
      contentType = 'application/msword';
    } else if (fileType === 'jpg' || fileExt === 'jpg' || fileType === 'jpeg' || fileExt === 'jpeg') {
      contentType = 'image/jpeg';
    } else if (fileType === 'png' || fileExt === 'png') {
      contentType = 'image/png';
    } else {
      contentType = 'application/octet-stream';
    }

    return new Response(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${file.fileName}"`,
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (err) {
    console.error("DOWNLOAD ERROR:", err);
    return new Response("Download failed: " + err.message, { status: 500 });
  }
}
