import executiveReportService from '../services/executiveReportService.js';
import AuditLog from '../../models/AuditLog.js';

export const getReports = async (req, res) => {
  try {
    const query = {};
    if (req.query.stadiumId) query.stadiumId = req.query.stadiumId;
    if (req.user.role === 'Organizer') {
       query.stadiumId = req.user.assignedStadium;
    }

    const reports = await executiveReportService.getReports(query);
    res.json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getReportById = async (req, res) => {
  try {
    const report = await executiveReportService.getReportById(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    
    if (req.user.role === 'Organizer' && report.stadiumId?.toString() !== req.user.assignedStadium?.toString()) {
       return res.status(403).json({ success: false, message: 'Not authorized to view this stadium\'s report' });
    }

    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generateReport = async (req, res) => {
  try {
    const { type, stadiumId, matchId } = req.body;
    
    // Organizers can only generate for their assigned stadium
    const targetStadiumId = req.user.role === 'Organizer' ? req.user.assignedStadium : stadiumId;

    if (!targetStadiumId) {
      return res.status(400).json({ success: false, message: "Stadium ID is required to generate a report." });
    }

    const report = await executiveReportService.generateReport(type, targetStadiumId, matchId, req.user._id);
    
    // Audit log
    await AuditLog.create({
      action: `Generated Executive Report (${report.reportId})`,
      module: 'Executive Reports',
      user: req.user._id,
      role: req.user.role,
      severity: 'INFO'
    });

    res.status(201).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const regenerateAIAnalysis = async (req, res) => {
  try {
    const report = await executiveReportService.regenerateAI(req.params.id);
    
    await AuditLog.create({
      action: `Regenerated AI Analysis for Report (${report.reportId})`,
      module: 'Executive Reports',
      user: req.user._id,
      role: req.user.role,
      severity: 'INFO'
    });

    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteReport = async (req, res) => {
  try {
    await executiveReportService.deleteReport(req.params.id);
    res.json({ success: true, message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
