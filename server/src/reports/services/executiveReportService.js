import ExecutiveReport from '../../models/ExecutiveReport.js';
import reportContextService from './reportContextService.js';
import executiveReportAIService from './executiveReportAIService.js';

class ExecutiveReportService {
  
  async getReports(query) {
    return await ExecutiveReport.find(query)
      .populate('generatedBy', 'name role')
      .populate('stadiumId', 'name')
      .populate('matchId', 'homeTeam awayTeam') // if match references are populated further
      .sort({ createdAt: -1 });
  }

  async getReportById(id) {
    return await ExecutiveReport.findById(id)
      .populate('generatedBy', 'name role')
      .populate('stadiumId', 'name location');
  }

  async generateReport(type, stadiumId, matchId, userId) {
    // 1. Collect deterministic operational data (Metrics Snapshot)
    const context = await reportContextService.buildMetricsSnapshot(stadiumId, matchId);

    // 2. Create the immutable report entry
    const report = new ExecutiveReport({
      type: type || 'MATCH_EXECUTIVE',
      title: `${type === 'MATCH_EXECUTIVE' ? 'Match Executive Report' : 'Operations Report'} - ${new Date().toLocaleDateString()}`,
      stadiumId: context.stadiumId,
      matchId: context.matchId,
      status: 'COLLECTING_DATA',
      generatedBy: userId,
      metricsSnapshot: context,
      healthScore: context.healthScore
    });

    await report.save();

    // 3. Trigger AI Generation asynchronously
    this._runAIGeneration(report._id, context).catch(err => console.error('Background AI Generation Error:', err));

    return report;
  }

  async regenerateAI(reportId) {
    const report = await ExecutiveReport.findById(reportId);
    if (!report) throw new Error("Report not found");
    if (report.status === 'GENERATING_AI') throw new Error("AI Generation is already in progress");

    report.status = 'GENERATING_AI';
    await report.save();

    // Trigger AI Generation asynchronously
    this._runAIGeneration(report._id, report.metricsSnapshot).catch(err => console.error('Background AI Regeneration Error:', err));
    
    return report;
  }

  // Internal orchestrator for the Groq call
  async _runAIGeneration(reportId, metricsSnapshot) {
    try {
      const report = await ExecutiveReport.findById(reportId);
      if (!report) return;

      report.status = 'GENERATING_AI';
      await report.save();

      const aiResult = await executiveReportAIService.generateAnalysis(metricsSnapshot);

      if (aiResult.status === 'SUCCESS' && aiResult.aiAnalysis) {
        report.aiAnalysis = {
          executiveSummary: aiResult.aiAnalysis.executiveSummary,
          operationalAssessment: aiResult.aiAnalysis.operationalAssessment,
          crowdAnalysis: aiResult.aiAnalysis.crowdAnalysis,
          incidentAnalysis: aiResult.aiAnalysis.incidentAnalysis,
          volunteerAnalysis: aiResult.aiAnalysis.volunteerAnalysis,
          emergencyAnalysis: aiResult.aiAnalysis.emergencyAnalysis,
          aiDecisionAnalysis: aiResult.aiAnalysis.aiDecisionAnalysis
        };
        report.keyRisks = aiResult.aiAnalysis.keyRisks || [];
        report.keySuccesses = aiResult.aiAnalysis.keySuccesses || [];
        report.recommendations = aiResult.aiAnalysis.recommendations || [];
        
        report.status = 'COMPLETED';
        report.aiMetadata = {
          model: process.env.AI_MODEL || 'llama-3.1-8b-instant',
          generatedAt: new Date(),
          status: 'SUCCESS'
        };
      } else {
        // Fallback: Metrics saved, AI failed (e.g. rate limit)
        report.status = 'COMPLETED'; // The report itself is complete (has deterministic metrics)
        report.aiMetadata = {
          status: 'FAILED',
          errorReason: aiResult.errorReason || "Unknown AI Generation Error"
        };
      }

      await report.save();

      // In a real production app, emit a socket event here: `report.completed`
      
    } catch (error) {
      console.error(`[_runAIGeneration] Failed for report ${reportId}:`, error);
      await ExecutiveReport.findByIdAndUpdate(reportId, {
        status: 'FAILED',
        'aiMetadata.status': 'FAILED',
        'aiMetadata.errorReason': error.message
      });
    }
  }

  async deleteReport(id) {
    return await ExecutiveReport.findByIdAndDelete(id);
  }
}

export default new ExecutiveReportService();
