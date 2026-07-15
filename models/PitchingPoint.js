import mongoose from "mongoose";

const pitchingPointSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: [
        "Gamer",
        "Photo Enthusiast",
        "Entertainment Purpose",
        "Long Runner",
      ],
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("PitchingPoint", pitchingPointSchema);