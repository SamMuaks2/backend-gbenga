const mongoose = require("mongoose");

const DevotionalSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    type: { type: String, enum: ["daily", "weekly", "monthly"] },

    coverImage: { type: String }, 
    fileUrl: { type: String },    

    views: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Devotional", DevotionalSchema);
