import connectToDB from "./index";
import User from "../models/user.model";
import Photographer from "../models/photographer.model";
import Portfolio from "../models/portfolio.model";
import { SAMPLE_PHOTOGRAPHERS } from "./sample-data";

/**
 * Clean & Streamlined Database Seeder.
 * Imports visual sample data from `./sample-data` to decouple code from data.
 */
async function seedDatabase() {
  console.info("⚡ Starting Database Seeding process...");

  try {
    // 1. Establish Database Connection
    await connectToDB();

    // 2. Clean Existing Collections
    console.info("🧹 Cleaning existing collections (User, Photographer, Portfolio)...");
    await User.deleteMany({});
    await Photographer.deleteMany({});
    await Portfolio.deleteMany({});

    // Drop stale unique 'slug_1' index from previous versions if it exists
    try {
      await Photographer.collection.dropIndex("slug_1");
      console.info("🗑️ Dropped stale 'slug_1' unique index successfully.");
    } catch (e) {
      // Index does not exist or has already been dropped, ignore silently
    }

    console.info("🗑️ Databases cleaned successfully.\n");

    // 3. Insert Curated Data
    for (const data of SAMPLE_PHOTOGRAPHERS) {
      console.info(`👤 Seeding User & Photographer: ${data.fullName} (${data.username})...`);

      // Create User
      const user = await User.create({
        fullName: data.fullName,
        email: data.email,
        phoneNumber: undefined,
        password: "AomiPass123!", // Will be hashed automatically by user Schema save middleware
        role: "photographer",
        isEmailVerified: true,
        avatar: data.avatar,
      });

      // Create Photographer Profile
      const photographer = await Photographer.create({
        userId: user._id,
        username: data.username,
        bio: data.bio,
        location: data.location,
        specialties: data.specialties,
        priceFrom: data.priceFrom,
        instagram: data.instagram,
        heroTagline: data.heroTagline,
      });

      // Seed Portfolio Items (Hero, About, Thumbnail, Gallery items)
      console.info(`  📸 Seeding ${data.images.length} portfolio items...`);
      let galleryCount = 0;
      for (let i = 0; i < data.images.length; i++) {
        const image = data.images[i];
        
        // Compute grid position
        let position = 0;
        if (image.purpose === "gallery") {
          position = galleryCount;
          galleryCount++;
        }

        await Portfolio.create({
          photographerId: photographer._id,
          mediaUrl: image.url,
          mediaType: "image",
          purpose: image.purpose as "hero" | "about" | "thumbnail" | "gallery",
          position: position,
        });
      }

      console.info(`✨ Successfully seeded ${data.fullName}!\n`);
    }

    console.info("🎉 Database Seeding Completed Successfully! 20 beautiful photographers created.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Database seeding failed with error:", error);
    process.exit(1);
  }
}

// Execute Seeder
seedDatabase();
