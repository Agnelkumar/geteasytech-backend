import PitchingPoint from "../models/PitchingPoint.js";
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
    res.json({ id: pitch._id, viewCount: pitch.viewCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
