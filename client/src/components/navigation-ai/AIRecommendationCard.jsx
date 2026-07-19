import React from 'react';
import { MapPin, Clock, Users, Navigation } from 'lucide-react';
import './NavigationAI.css';

const AIRecommendationCard = ({ recommendation, onSelect }) => {
  if (!recommendation) return null;

  return (
    <div className={`ai-rec-card ${recommendation.isPrimary ? 'ai-rec-card-primary' : ''}`} onClick={() => onSelect(recommendation)} style={{ cursor: 'pointer' }}>
      <div className="ai-rec-header">
        <h3 className="ai-rec-title">{recommendation.routeName}</h3>
        <span className="ai-rec-eta">{recommendation.eta}</span>
      </div>
      
      <p className="ai-rec-reason">{recommendation.reason}</p>
      
      <div className="ai-rec-meta">
        <span className={`ai-badge ${recommendation.crowdLevel === 'High' ? 'ai-badge-high' : recommendation.crowdLevel === 'Low' ? 'ai-badge-low' : 'ai-badge-med'}`}>
          <Users size={14} /> Crowd: {recommendation.crowdLevel}
        </span>
        {recommendation.isPrimary && (
          <span className="ai-badge" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <Navigation size={14} /> Recommended
          </span>
        )}
      </div>
      
      {recommendation.warnings && recommendation.warnings.length > 0 && (
        <div style={{ marginTop: '12px' }}>
          {recommendation.warnings.map((w, idx) => (
             <div key={idx} style={{ fontSize: '0.75rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
               <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ef4444' }}></span> {w}
             </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIRecommendationCard;
