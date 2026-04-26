 import { clientPromise } from "@/lib/mongodb";
 import cloudinary from "@/lib/cloudinary";

 export async function POST(req) {
   const data = await req.formData();
   const image = data.get("image");

   const buffer = Buffer.from(await image.arrayBuffer());
   const upload = await cloudinary.uploader.upload_stream(
     { folder: "student-gallery" },
     (error, result) => {
       if (error) throw error;
     }
   );
   upload.end(buffer);

   const uploadResult = await new Promise((resolve, reject) => {
     upload.on("end", (result) => resolve(result));
     upload.on("error", (err) => reject(err));
   });

   const client = await clientPromise;
   const db = client.db(process.env.MONGODB_DB || "department_portal");

   await db.collection("student_gallery").insertOne({
     title: data.get("title"),
     description: data.get("description"),
     studentName: data.get("studentName"),
     imageUrl: uploadResult.secure_url,
     publicId: uploadResult.public_id,
     status: "pending",
     createdAt: new Date(),
   });

   return Response.json({ ok: true });
 }
