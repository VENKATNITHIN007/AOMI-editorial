import mongoose from "mongoose";
import connectToDB from "./index";
import User from "../models/user.model";
import Photographer from "../models/photographer.model";
import Portfolio from "../models/portfolio.model";

async function cleanDatabase() {
  console.info("🧹 Starting database cleanup...");

  try {
    // 1. Establish Database Connection
    await connectToDB();

    // 2. Wipe Collections
    console.warn("⚠️  Wiping all User, Photographer, and Portfolio collections...");
    await User.deleteMany({});
    await Photographer.deleteMany({});
    await Portfolio.deleteMany({});

    console.info("🎉 Database collections wiped completely clean!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Database cleanup failed with error:", error);
    process.exit(1);
  }
}

// Execute Cleaner
cleanDatabase();
