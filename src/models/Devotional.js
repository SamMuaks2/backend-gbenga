// const mongoose = require("mongoose");

// const DevotionalSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     slug: { type: String, unique: true },
//     type: { type: String, enum: ["daily", "weekly", "monthly"] },

//     coverImage: { type: String }, 
//     fileUrl: { type: String },    

//     views: { type: Number, default: 0 },
//     published: { type: Boolean, default: true },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Devotional", DevotionalSchema);


const mongoose = require("mongoose");

const DevotionalSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    type: { type: String, enum: ["daily", "weekly", "monthly"], required: true },

    coverImage: { type: String },       // optional cover image URL/path
    fileUrl: { type: String },          // optional uploaded file URL/path
    content: { type: String },          // typed devotional content

    author: { type: String },           // optional author name
    date: { type: String },             // optional date
    scripture: { type: String },        // optional scripture reference
    category: { type: String },         // optional category
    tags: { type: [String], default: [] }, // optional tags array

    views: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Devotional", DevotionalSchema);
