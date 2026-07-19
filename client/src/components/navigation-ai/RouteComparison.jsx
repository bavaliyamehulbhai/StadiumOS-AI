import React from 'react';
import './NavigationAI.css';

const RouteComparison = ({ recommendations, onSelectRoute }) => {
  if (!recommendations || recommendations.length < 2) return null;

  return (
    <div style={{ marginTop: '24px' }}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '12px' }}>Compare Options</h3>
      <div style={{ overflowX: 'auto' }}>
        <table className="ai-compare-table">
          <thead>
            <tr>
              <th>Route</th>
              <th>ETA</th>
              <th>Crowd</th>
              <th>Best For</th>
            </tr>
          </thead>
          <tbody>
            {recommendations.map((rec, idx) => (
              <tr key={idx} onClick={() => onSelectRoute(rec)}>
                <td style={{ fontWeight: '500', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {rec.routeName}
                  {rec.isPrimary && <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6' }} title="AI Recommended"></span>}
                </td>
                <td style={{ fontWeight: '600' }}>{rec.eta}</td>
                <td>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '9999px', 
                    fontSize: '0.75rem', 
                    fontWeight: '500',
                    backgroundColor: rec.crowdLevel === 'High' ? 'rgba(239, 68, 68, 0.1)' : rec.crowdLevel === 'Medium' ? 'rgba(234, 179, 8, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                    color: rec.crowdLevel === 'High' ? '#b91c1c' : rec.crowdLevel === 'Medium' ? '#a16207' : '#15803d'
                  }}>
                    {rec.crowdLevel}
                  </span>
                </td>
                <td style={{ fontSize: '0.875rem', color: '#64748b' }}>{rec.reason.length > 40 ? rec.reason.substring(0, 40) + '...' : rec.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RouteComparison;
