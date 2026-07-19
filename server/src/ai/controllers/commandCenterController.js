import { buildAnalyticsContext } from '../services/analyticsContextService.js';
import { generateExecutiveBrief } from '../services/commandCenterAIService.js';
import { SUPPORTED_LANGUAGES } from '../services/localizationService.js';
import AIAnalyticsReport from '../../models/AIAnalyticsReport.js';

export const getCommandCenterDashboard = async (req, res) => {
  try {
    // 1. Gather live telemetry
    const analyticsContext = await buildAnalyticsContext();
    
    // 2. Get latest health score
    const latestReport = await AIAnalyticsReport.findOne().sort({ createdAt: -1 });
    const healthScore = latestReport ? latestReport.healthScore : 91; // Default if none exists

    // 3. Format telemetry for the Brief Engine
    const telemetry = {
      healthScore,
      activeEmergencies: analyticsContext.activeEmergencies.length,
      activeIncidents: analyticsContext.kpis.activeIncidents,
      highRiskZones: analyticsContext.crowdHighlights.filter(c => c.density > 80).length,
      parkingUtilization: analyticsContext.kpis.parkingUtilization
    };

    // 4. Generate the overarching Executive Brief
    const executiveBrief = await generateExecutiveBrief(telemetry);

    // 5. Structure the payload for the Command Center Grid
    const dashboardData = {
      executiveBrief,
      modules: {
        assistant: { status: 'Online', highlight: 'Processing 45 fan queries/min' },
        emergency: { 
          status: telemetry.activeEmergencies > 0 ? 'Critical' : 'Ready', 
          highlight: telemetry.activeEmergencies > 0 ? `${telemetry.activeEmergencies} active emergencies` : 'No active emergencies' 
        },
        crowd: { 
          status: telemetry.highRiskZones > 0 ? 'Warning' : 'Stable',
          highlight: telemetry.highRiskZones > 0 ? `${telemetry.highRiskZones} high risk zones detected` : 'Crowd flow is nominal'
        },
        navigation: { status: 'Active', highlight: 'Recommending Gate C for optimal flow' },
        analytics: { status: 'Live', highlight: `Stadium Health Score: ${healthScore}/100` },
        multilingual: { status: 'Active', highlight: `${SUPPORTED_LANGUAGES.length} languages active` }
      }
    };

    res.status(200).json({ success: true, data: dashboardData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load Command Center', error: error.message });
  }
};
