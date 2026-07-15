import CustomerProfile from "../models/CustomerProfile.js";

export const getCustomerProfiles = async (req, res) => {
  try {
    res.json(await CustomerProfile.find().sort({ name: 1 }));
  } catch {
    res.status(500).json({ message: "Could not load customer profiles." });
  }
};

export const createCustomerProfile = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    if (!name) return res.status(400).json({ message: "Profile name is required." });
    const existing = await CustomerProfile.findOne({ name: { $regex: "^" + name + "$", $options: "i" } });
    if (existing) return res.status(200).json(existing);
    const profile = await CustomerProfile.create({ name });
    res.status(201).json(profile);
  } catch {
    res.status(500).json({ message: "Could not save customer profile." });
  }
};
