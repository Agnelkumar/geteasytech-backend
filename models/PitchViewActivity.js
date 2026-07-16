import mongoose from "mongoose";

const pitchViewActivitySchema = new mongoose.Schema(
  {
    viewer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    pitchingPoint: { type: mongoose.Schema.Types.ObjectId, ref: "PitchingPoint", required: true },
    category: { type: String, required: true },
    productName: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("PitchViewActivity", pitchViewActivitySchema);
