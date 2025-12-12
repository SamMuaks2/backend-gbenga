const Devotional = require("../models/Devotional");
const slugify = require("slugify");
const path = require("path");

const BASE_URL = process.env.BASE_URL || "http://localhost:4000";

/**
 * Helper: Convert file path to URL
 */
function pathToUrl(filePath) {
  if (!filePath) return null;
  
  // Normalize path separators to forward slashes
  const normalized = filePath.replace(/\\/g, '/');
  
  // Return full URL
  return `${BASE_URL}/${normalized}`;
}

/**
 * CREATE devotional
 */
exports.createDevotional = async (req, res) => {
  try {
    const { title, type } = req.body;

    const devotional = await Devotional.create({
      title,
      slug: slugify(title, { lower: true, strict: true }),
      type,
      coverImage: req.files?.cover?.[0] 
        ? pathToUrl(req.files.cover[0].path)
        : null,
      fileUrl: req.files?.file?.[0] 
        ? pathToUrl(req.files.file[0].path)
        : null,
    });

    res.status(201).json(devotional);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * GET all devotionals
 */
exports.getDevotionals = async (req, res) => {
  try {
    const devotionals = await Devotional.find({ published: true })
      .sort({ createdAt: -1 });

    // Transform paths to URLs for existing records
    const transformed = devotionals.map(d => ({
      ...d.toObject(),
      coverImage: d.coverImage?.startsWith('http') 
        ? d.coverImage 
        : pathToUrl(d.coverImage),
      fileUrl: d.fileUrl?.startsWith('http')
        ? d.fileUrl
        : pathToUrl(d.fileUrl)
    }));

    res.json(transformed);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET devotional by slug
 */
exports.getDevotionalBySlug = async (req, res) => {
  try {
    const devotional = await Devotional.findOne({ slug: req.params.slug });
    
    if (!devotional) {
      return res.status(404).json({ message: "Devotional not found" });
    }

    // Increment views
    devotional.views += 1;
    await devotional.save();

    // Transform paths to URLs
    const response = {
      ...devotional.toObject(),
      coverImage: devotional.coverImage?.startsWith('http')
        ? devotional.coverImage
        : pathToUrl(devotional.coverImage),
      fileUrl: devotional.fileUrl?.startsWith('http')
        ? devotional.fileUrl
        : pathToUrl(devotional.fileUrl)
    };

    res.json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * UPDATE devotional
 */
exports.updateDevotional = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
    };

    // Add new files if uploaded
    if (req.files?.cover?.[0]) {
      updateData.coverImage = pathToUrl(req.files.cover[0].path);
    }
    
    if (req.files?.file?.[0]) {
      updateData.fileUrl = pathToUrl(req.files.file[0].path);
    }

    const devotional = await Devotional.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!devotional) {
      return res.status(404).json({ message: "Devotional not found" });
    }

    res.json(devotional);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * DELETE devotional
 */
exports.deleteDevotional = async (req, res) => {
  try {
    const devotional = await Devotional.findByIdAndDelete(req.params.id);
    
    if (!devotional) {
      return res.status(404).json({ message: "Devotional not found" });
    }

    res.json({ message: "Devotional deleted", success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};