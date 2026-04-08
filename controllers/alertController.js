// Alerts Controller
const Alert = require('../models/Alert');
const User = require('../models/User');

exports.createAlert = async (req, res, next) => {
  try {
    const { category, frequency, keywords, notificationMethods } = req.body;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category is required',
      });
    }

    const alert = new Alert({
      userId: req.userId,
      category,
      frequency: frequency || 'daily',
      keywords: keywords || [],
      notificationMethods: notificationMethods || { email: true, push: false },
    });

    await alert.save();

    res.status(201).json({
      success: true,
      message: 'Alert created successfully',
      data: alert,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAlerts = async (req, res, next) => {
  try {
    const alerts = await Alert.find({ userId: req.userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: alerts,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAlertById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const alert = await Alert.findById(id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found',
      });
    }

    if (alert.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    res.json({
      success: true,
      data: alert,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateAlert = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { frequency, keywords, notificationMethods, isActive } = req.body;

    let alert = await Alert.findById(id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found',
      });
    }

    if (alert.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    alert.frequency = frequency || alert.frequency;
    alert.keywords = keywords || alert.keywords;
    alert.notificationMethods = notificationMethods || alert.notificationMethods;
    alert.isActive = isActive !== undefined ? isActive : alert.isActive;
    alert.updatedAt = new Date();

    await alert.save();

    res.json({
      success: true,
      message: 'Alert updated successfully',
      data: alert,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteAlert = async (req, res, next) => {
  try {
    const { id } = req.params;

    const alert = await Alert.findById(id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found',
      });
    }

    if (alert.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    await Alert.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Alert deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

exports.toggleAlert = async (req, res, next) => {
  try {
    const { id } = req.params;

    let alert = await Alert.findById(id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found',
      });
    }

    if (alert.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    alert.isActive = !alert.isActive;
    await alert.save();

    res.json({
      success: true,
      message: `Alert ${alert.isActive ? 'enabled' : 'disabled'} successfully`,
      data: alert,
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserActiveAlerts = async (req, res, next) => {
  try {
    const alerts = await Alert.find({
      userId: req.userId,
      isActive: true,
    });

    res.json({
      success: true,
      data: alerts,
    });
  } catch (error) {
    next(error);
  }
};
