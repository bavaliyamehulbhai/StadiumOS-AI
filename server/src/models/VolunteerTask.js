import mongoose from 'mongoose';

const volunteerTaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a task title'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    category: {
      type: String,
      enum: ['Medical', 'Crowd', 'Parking', 'Security', 'Maintenance', 'Navigation', 'Transport', 'Cleaning', 'Emergency', 'VIP', 'Other'],
      required: [true, 'Please select a task category'],
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Pending', 'Assigned', 'Accepted', 'In Progress', 'Completed', 'Verified', 'Cancelled'],
      default: 'Pending',
    },
    location: {
      type: String,
      required: [true, 'Please add a specific location (e.g., Gate A, Section 102)'],
    },
    stadium: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stadium',
      required: [true, 'Task must be assigned to a stadium'],
    },
    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match',
    },
    incident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Incident',
    },
    assignedVolunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task must track the organizer who assigned it'],
    },
    dueTime: {
      type: Date,
      required: [true, 'Please set a due time'],
    },
    acceptedAt: Date,
    startedAt: Date,
    completedAt: Date,
    verifiedAt: Date,
    notes: String,
    attachments: [String],
    timeline: [
      {
        action: String,
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: String,
        previousStatus: String,
        newStatus: String,
        timestamp: { type: Date, default: Date.now },
      }
    ],
    aiSummary: String,
    aiSafetyTips: [String],
    aiEquipment: [String],
    aiEtaMinutes: Number,
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to enforce business rules
volunteerTaskSchema.pre('save', function(next) {
  if (this.priority === 'Critical' && this.status === 'Pending') {
    // A critical task should ideally not be pending, but usually handled in controller 
    // We will enforce this via controller workflow for better error messages
  }
  next();
});

const VolunteerTask = mongoose.model('VolunteerTask', volunteerTaskSchema);

export default VolunteerTask;
