/**
 * Script to fix Cloudinary file access mode for existing academic files.
 * Run this script to make all existing PDF files publicly accessible.
 * 
 * Usage: node scripts/fix-cloudinary-access.js
 */

const clientPromise = require("../lib/mongodb");
const cloudinary = require("cloudinary").v2;
const { ObjectId } = require("mongodb");

async function fixExistingFiles() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    console.log("Fetching all academic files...");

    const files = await db.collection("academic").find({}).toArray();
    console.log(`Found ${files.length} files`);

    let fixed = 0;
    let errors = 0;

    for (const file of files) {
      if (!file.publicId) continue;

      // Skip images (they're already public by default)
      const imageTypes = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
      if (imageTypes.includes(file.fileType?.toLowerCase())) {
        console.log(`Skipping image: ${file.publicId}`);
        continue;
      }

      console.log(`Fixing access mode for: ${file.publicId}`);

      try {
        await new Promise((resolve, reject) => {
          cloudinary.uploader.explicit(file.publicId, {
            resource_type: "raw",
            type: "upload",
            access_mode: "public",
          }, (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        });

        console.log(`✅ Fixed: ${file.publicId}`);
        fixed++;
      } catch (err) {
        console.error(`❌ Failed: ${file.publicId} - ${err.message}`);
        errors++;
      }
    }

    console.log(`\nDone! Fixed ${fixed} files, ${errors} errors`);
    process.exit(errors > 0 ? 1 : 0);
  } catch (err) {
    console.error("Script error:", err);
    process.exit(1);
  }
}

fixExistingFiles();
