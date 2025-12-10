// const express = require("express");
// const slugify = require("slugify");
// const Devotional = require("../models/Devotional");

// const router = express.Router();

// /**
//  * GET all devotionals (frontend)
//  */
// router.get("/", async (req, res) => {
//   try {
//     const devotionals = await Devotional.find({ published: true })
//       .sort({ createdAt: -1 });

//     res.json(devotionals);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// /**
//  * GET devotional by slug (frontend)
//  */
// router.get("/slug/:slug", async (req, res) => {
//   try {
//     const devotional = await Devotional.findOne({ slug: req.params.slug });
//     if (!devotional)
//       return res.status(404).json({ message: "Devotional not found" });

//     devotional.views += 1;
//     await devotional.save();

//     res.json(devotional);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// /**
//  * CREATE devotional (admin)
//  */
// router.post("/", async (req, res) => {
//   try {
//     const { title, type, image, description, content } = req.body;

//     const devotional = await Devotional.create({
//       title,
//       slug: slugify(title, { lower: true }),
//       type,
//       image,
//       description,
//       content,
//     });

//     res.status(201).json(devotional);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// /**
//  * UPDATE devotional (admin)
//  */
// router.put("/:id", async (req, res) => {
//   try {
//     const devotional = await Devotional.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );

//     res.json(devotional);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// /**
//  * DELETE devotional (admin)
//  */
// router.delete("/:id", async (req, res) => {
//   try {
//     await Devotional.findByIdAndDelete(req.params.id);
//     res.json({ message: "Devotional deleted" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;


const express = require("express");
const slugify = require("slugify");
const Devotional = require("../models/Devotional");
const upload = require("../middleware/upload");

const router = express.Router();

/**
 * CREATE devotional (admin)
 */
router.post(
  "/",
  upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, type } = req.body;

      const devotional = await Devotional.create({
        title,
        slug: slugify(title, { lower: true }),
        type,
        coverImage: req.files?.cover?.[0]?.path,
        fileUrl: req.files?.file?.[0]?.path,
      });

      res.status(201).json(devotional);
    } catch (err) {
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
