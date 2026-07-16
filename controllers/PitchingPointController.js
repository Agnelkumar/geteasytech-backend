import PitchingPoint from "../models/PitchingPoint.js";
import PitchViewActivity from "../models/PitchViewActivity.js";
import { createGlobalNotification } from "./notificationController.js";


// Create
export const createPitchingPoint = async (req, res) => {
  try {
    const { category, product, title, description } = req.body;

    const exists = await PitchingPoint.findOne({
      category,
      product,
      title,
    });

    if (exists) {
      return res.status(400).json({
        message: "Pitching Point already exists.",
      });
    }

    const pitchingPoint = new PitchingPoint({
      category,
      product,
      title,
      description,
    });

    await pitchingPoint.save();
    await createGlobalNotification({
      type: "pitching-point",
      title: "New pitching point added",
      message: `${title} has been added for ${category} customers.`,
    });

    res.status(201).json(pitchingPoint);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


// Get All
export const getPitchingPoints = async (req, res) => {
  try {
    const data = await PitchingPoint.find()
      .populate("product", "productName")
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


// Get Single
export const getPitchingPointById = async (req, res) => {
  try {
    const data = await PitchingPoint.findById(req.params.id)
      .populate("product", "productName");

    if (!data) {
      return res.status(404).json({
        message: "Pitching Point not found",
      });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Record a genuine detail view when a user opens a matching pitching point.
export const recordPitchingPointView = async (req, res) => {
  try {
    const pitch = await PitchingPoint.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewCount: 1 } },
      { new: true }
    );
    if (!pitch) return res.status(404).json({ message: "Pitching Point not found" });
    await PitchViewActivity.create({
      viewer: req.user._id,
      pitchingPoint: pitch._id,
      category: pitch.category,
      productName: "",
    });
    res.json({ id: pitch._id, viewCount: pitch.viewCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPitchViewAnalytics = async (req, res) => {
  try {
    const activities = await PitchViewActivity.find()
      .populate("viewer", "username email mobileNumber state role")
      .populate({ path: "pitchingPoint", populate: { path: "product", select: "productName" } })
      .sort({ createdAt: -1 })
      .lean();
    const records = activities.map((activity) => ({
      id: activity._id,
      viewedAt: activity.createdAt,
      category: activity.category,
      viewer: activity.viewer,
      productName: activity.pitchingPoint?.product?.productName || activity.productName || "—",
      pitchingTitle: activity.pitchingPoint?.title || "—",
    }));
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Could not load view analytics." });
  }
};

export const getMyPitchViewSummary = async (req, res) => {
  try {
    const totalPitchingPoints = await PitchingPoint.countDocuments({ status: true });
    const viewedPitchIds = await PitchViewActivity.distinct("pitchingPoint", { viewer: req.user._id });
    const uniqueViews = viewedPitchIds.length;
    const recentViews = await PitchViewActivity.find({ viewer: req.user._id })
      .populate({ path: "pitchingPoint", populate: { path: "product", select: "productName" } })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    res.json({
      totalPitchingPoints,
      uniqueViews,
      unviewedCount: Math.max(totalPitchingPoints - uniqueViews, 0),
      recentViews: recentViews.map((view) => ({
        id: view._id,
        title: view.pitchingPoint?.title || "Pitching point",
        productName: view.pitchingPoint?.product?.productName || "—",
        category: view.category,
        viewedAt: view.createdAt,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: "Could not load your view summary." });
  }
};


// Update
export const updatePitchingPoint = async (req, res) => {
  try {
    const updated = await PitchingPoint.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Pitching Point not found",
      });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


// Delete
export const deletePitchingPoint = async (req, res) => {
  try {
    const deleted = await PitchingPoint.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        message: "Pitching Point not found",
      });
    }

    res.json({
      message: "Pitching Point deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ============================================
// Get All Categories
// ============================================

export const getCategories = async (req, res) => {
    try {
      const categories = await PitchingPoint.distinct("category");
  
      res.status(200).json(categories);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  };
  
  // ============================================
  // Search Pitching Points
  // ============================================
  
  export const searchPitchingPoints = async (req, res) => {
    try {
      const { category, product } = req.query;
  
      if (!category || !product) {
        return res.status(400).json({
          message: "Category and Product are required",
        });
      }
  
      const pitchingPoints = await PitchingPoint.find({
        category,
        product,
      }).populate("product", "productName");
  
      res.status(200).json(pitchingPoints);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  };
