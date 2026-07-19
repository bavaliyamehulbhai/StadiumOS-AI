import mongoose from 'mongoose';

const AIConversationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['Fan', 'Volunteer', 'Organizer', 'Admin'],
    default: 'Fan'
  },
  message: {
    type: String,
    required: true
  },
  response: {
    type: String,
    required: true
  },
  context: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { timestamps: true });

export default mongoose.model('AIConversation', AIConversationSchema);
