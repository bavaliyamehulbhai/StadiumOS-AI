import AuditLog from '../../models/AuditLog.js';

// @desc    Get all audit logs with pagination and filters
// @route   GET /api/v1/audit
// @access  Private/Admin/Organizer
export const getAuditLogs = async (req, res) => {
  try {
    const { module, severity, user, aiGenerated, limit = 50, page = 1 } = req.query;
    const query = {};

    if (module) query.module = module;
    if (severity) query.severity = severity;
    if (user) query.user = user;
    if (aiGenerated) query.aiGenerated = aiGenerated === 'true';

    const logs = await AuditLog.find(query)
      .populate('user', 'name role email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await AuditLog.countDocuments(query);

    res.status(200).json({
      success: true,
      count: logs.length,
      total,
      data: logs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get audit statistics for dashboard
// @route   GET /api/v1/audit/stats
// @access  Private/Admin/Organizer
export const getAuditStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalToday, criticalToday, aiDecisions] = await Promise.all([
      AuditLog.countDocuments({ createdAt: { $gte: today } }),
      AuditLog.countDocuments({ createdAt: { $gte: today }, severity: { $in: ['CRITICAL', 'ERROR'] } }),
      AuditLog.countDocuments({ createdAt: { $gte: today }, aiGenerated: true })
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalToday,
        criticalToday,
        aiDecisions
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
