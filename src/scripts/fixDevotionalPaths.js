/**
 * Migration Script: Fix Devotional File Paths
 * 
 * This script converts Windows-style paths (uploads\covers\file.png)
 * to full URLs (http://localhost:4000/uploads/covers/file.png)
 * 
 * Run once: node scripts/fixDevotionalPaths.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Devotional = require('../models/Devotional');

const BASE_URL = process.env.BASE_URL || 'http://localhost:4000';

async function fixPaths() {
  try {
    // Connect to database
    const uri = process.env.MONGO_URI;
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    // Get all devotionals
    const devotionals = await Devotional.find();
    console.log(`📚 Found ${devotionals.length} devotionals`);

    let updatedCount = 0;

    for (const devotional of devotionals) {
      let needsUpdate = false;
      const updates = {};

      // Fix coverImage path
      if (devotional.coverImage && !devotional.coverImage.startsWith('http')) {
        const normalized = devotional.coverImage.replace(/\\/g, '/');
        updates.coverImage = `${BASE_URL}/${normalized}`;
        needsUpdate = true;
        console.log(`📸 Cover: ${devotional.coverImage} → ${updates.coverImage}`);
      }

      // Fix fileUrl path
      if (devotional.fileUrl && !devotional.fileUrl.startsWith('http')) {
        const normalized = devotional.fileUrl.replace(/\\/g, '/');
        updates.fileUrl = `${BASE_URL}/${normalized}`;
        needsUpdate = true;
        console.log(`📄 File: ${devotional.fileUrl} → ${updates.fileUrl}`);
      }

      // Update if needed
      if (needsUpdate) {
        await Devotional.findByIdAndUpdate(devotional._id, updates);
        updatedCount++;
        console.log(`✅ Updated: ${devotional.title}`);
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   Total devotionals: ${devotionals.length}`);
    console.log(`   Updated: ${updatedCount}`);
    console.log(`   Unchanged: ${devotionals.length - updatedCount}`);
    
    console.log('\n✨ Migration complete!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run migration
fixPaths();