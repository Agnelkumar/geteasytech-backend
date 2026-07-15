import Notification from "../models/Notification.js";

export const createGlobalNotification = async ({ type, title, message }) =>
  Notification.create({ type, title, message });

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(30).lean();
    const userId = req.user._id.toString();
    res.json(notifications.map((notification) => ({
      ...notification,
      isRead: notification.readBy.some((id) => id.toString() === userId),
    })));
  } catch (error) {
    res.status(500).json({ message: "Could not load notifications." });
  }
};

export const markNotificationsRead = async (req, res) => {
  try {
    const ids = Array.isArray(req.body.ids) ? req.body.ids : [];
    const filter = ids.length ? { _id: { $in: ids } } : {};
    await Notification.updateMany(filter, { $addToSet: { readBy: req.user._id } });
    res.json({ message: "Notifications marked as read." });
  } catch (error) {
    res.status(500).json({ message: "Could not update notifications." });
  }
};
