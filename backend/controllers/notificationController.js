const Notification = require('../models/Notification');

const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .populate('report', 'title damageType status originalImage priorityLevel')
      .sort({ createdAt: -1 });

    const unreadCount = notifications.filter((n) => !n.read).length;

    return res.json({
      success: true,
      unreadCount,
      notifications,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this notification' });
    }

    notification.read = true;
    await notification.save();

    return res.json({
      success: true,
      notification,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, read: false }, { read: true });

    return res.json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
};
