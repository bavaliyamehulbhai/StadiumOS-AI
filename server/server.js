import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { initSocket } from './src/socket/socketServer.js';
import { connectDB } from './src/config/db.js';
import { startSimulation } from './src/seed/simulation.js';
import { CrowdSimulationService } from './src/crowd/services/crowdSimulationService.js';
import { DashboardSocketService } from './src/analytics/services/dashboardSocketService.js';
import { MapSocketService } from './src/map/services/mapSocketService.js';
import { aiOrchestrator } from './src/ai/services/eventOrchestrator.js';
import authRoutes from './src/routes/authRoutes.js';
import assistantRoutes from './src/ai/routes/assistantRoutes.js';
import incidentAIRoutes from './src/ai/routes/incidentAIRoutes.js';
import navigationAIRoutes from './src/ai/routes/navigationAIRoutes.js';
import crowdAIRoutes from './src/ai/routes/crowdAIRoutes.js';
import emergencyAIRoutes from './src/ai/routes/emergencyAIRoutes.js';
import analyticsAIRoutes from './src/ai/routes/analyticsAIRoutes.js';
import languageAIRoutes from './src/ai/routes/languageAIRoutes.js';
import commandCenterRoutes from './src/ai/routes/commandCenterRoutes.js';
import chatRoutes from './src/routes/chatRoutes.js';
import stadiumRoutes from './src/routes/stadiumRoutes.js';
import matchRoutes from './src/routes/matchRoutes.js';
import incidentRoutes from './src/routes/incidentRoutes.js';
import taskRoutes from './src/routes/taskRoutes.js';
import analyticsRoutes from './src/analytics/routes/analyticsRoutes.js';
import volunteerPerformanceRoutes from './src/volunteerPerformance/routes/volunteerPerformanceRoutes.js';
import executiveReportRoutes from './src/reports/routes/executiveReportRoutes.js';
import matchOperationsRoutes from './src/matchOperations/routes/matchOperationsRoutes.js';
import volunteerRoutes from './src/routes/volunteerRoutes.js';
import mapRoutes from './src/routes/mapRoutes.js';
import navigationRoutes from './src/routes/navigationRoutes.js';
import notificationRoutes from './src/routes/notificationRoutes.js';
import dashboardRoutes from './src/routes/dashboardRoutes.js';
import ticketRoutes from './src/routes/ticketRoutes.js';
import parkingRoutes from './src/routes/parkingRoutes.js';
import transportRoutes from './src/routes/transportRoutes.js';
import accessibilityRoutes from './src/routes/accessibilityRoutes.js';
import crowdRoutes from './src/routes/crowdRoutes.js';
import emergencyRoutes from './src/routes/emergencyRoutes.js';
import emergencyBroadcastRoutes from './src/emergency/routes/emergencyBroadcastRoutes.js';
import auditRoutes from './src/audit/routes/auditRoutes.js';
import adminRoutes from './src/admin/routes/adminRoutes.js';
import systemHealthRoutes from './src/monitoring/routes/systemHealthRoutes.js';
import { auditLogger } from './src/audit/middleware/auditMiddleware.js';
import { requestMetricsMiddleware } from './src/monitoring/middleware/requestMetricsMiddleware.js';
import { errorHandler, notFound } from './src/middleware/errorMiddleware.js';

const app = express();
const httpServer = createServer(app);

// Track Request Metrics (mount early)
app.use(requestMetricsMiddleware);

// Initialize modular socket
initSocket(httpServer);

// Middleware
app.use(express.json());

// Production Deployment Health Check (Non-AI dependent)
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'HEALTHY', message: 'Platform Backend Online' });
});
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000, // Increased limit for hackathon demo to prevent 429 errors
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' }
});
app.use('/api', limiter);

// Phase 9: Global Audit Logger for all requests
app.use(auditLogger);

// Database Connection
connectDB();

// Basic Route
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'Server Running' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/assistant', assistantRoutes);
app.use('/api/v1/ai/incidents', incidentAIRoutes);
app.use('/api/v1/ai/navigation', navigationAIRoutes);
app.use('/api/v1/ai/crowd', crowdAIRoutes);
app.use('/api/v1/ai/emergency', emergencyAIRoutes);
app.use('/api/v1/ai/analytics', analyticsAIRoutes);
app.use('/api/v1/ai/language', languageAIRoutes);
app.use('/api/v1/ai/command-center', commandCenterRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/stadiums', stadiumRoutes);
app.use('/api/v1/matches', matchRoutes);
app.use('/api/v1/map', mapRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/volunteer-performance', volunteerPerformanceRoutes);
app.use('/api/v1/reports', executiveReportRoutes);
app.use('/api/v1/match-operations', matchOperationsRoutes);
app.use('/api/v1/incidents', incidentRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/volunteers', volunteerRoutes);
app.use('/api/v1/maps', mapRoutes);
app.use('/api/v1/navigation', navigationRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/tickets', ticketRoutes);
app.use('/api/v1/system-health', systemHealthRoutes);
app.use('/api/v1/parking', parkingRoutes);
app.use('/api/v1/transport', transportRoutes);
app.use('/api/v1/accessibility', accessibilityRoutes);
app.use('/api/v1/crowd', crowdRoutes);
app.use('/api/v1/emergency', emergencyRoutes);
app.use('/api/v1/emergency-broadcasts', emergencyBroadcastRoutes);
app.use('/api/v1/audit', auditRoutes);
app.use('/api/v1/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  if (process.env.NODE_ENV === 'development' || process.env.ENABLE_SIMULATION === 'true') {
    startSimulation();
    CrowdSimulationService.startSimulation();
    DashboardSocketService.startBroadcasting();
    MapSocketService.startBroadcasting();
    
    // Initialize Phase 8 AI Orchestrator
    aiOrchestrator.init();
  }
});
// Force restart 8 - Phase 9 Audit load
