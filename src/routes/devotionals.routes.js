const express = require("express");
const slugify = require("slugify");
const Devotional = require("../models/Devotional");
const upload = require("../middleware/upload");

const router = express.Router();

/**
 * CREATE devotional (admin)
 */
// router.post(
//   "/",
//   upload.fields([
//     { name: "cover", maxCount: 1 },
//     { name: "file", maxCount: 1 },
//   ]),
//   async (req, res) => {
//     try {
//       const { title, type } = req.body;

//       const devotional = await Devotional.create({
//         title,
//         slug: slugify(title, { lower: true }),
//         type,
//         coverImage: req.files?.cover?.[0]?.path,
//         fileUrl: req.files?.file?.[0]?.path,
//       });

//       res.status(201).json(devotional);
//     } catch (err) {
//       res.status(400).json({ message: err.message });
//     }
//   }
// );

router.post(
      "/",
      upload.fields([
        { name: "cover", maxCount: 1 },
        { name: "file", maxCount: 1 },
      ]),
      async (req, res) => {
        try {
          const { title, type, content, author, date, scripture, category, tags } = req.body;

          const devotional = await Devotional.create({
            title,
            slug: slugify(title, { lower: true }),
            type,
            coverImage: req.files?.cover?.[0]?.path || null,
            fileUrl: req.files?.file?.[0]?.path || null,
            content: content || null,
            author: author || null,
            date: date || null,
            scripture: scripture || null,
            category: category || null,
            tags: tags ? JSON.parse(tags) : [],
          });

          res.status(201).json(devotional);
        } catch (err) {
          console.error(err);
          res.status(400).json({ message: err.message });
        }
      }
    );

    
/**
 * GET devotionals
 */
router.get("/", async (req, res) => {
  const devotionals = await Devotional.find().sort({ createdAt: -1 });
  res.json(devotionals);
});

/**
 * GET by slug
 */
router.get("/slug/:slug", async (req, res) => {
  const devotional = await Devotional.findOne({ slug: req.params.slug });
  if (!devotional) return res.sendStatus(404);

  devotional.views++;
  await devotional.save();

  res.json(devotional);
});

/**
 * DELETE
 */
router.delete("/:id", async (req, res) => {
  await Devotional.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
