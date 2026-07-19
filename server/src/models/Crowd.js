import mongoose from 'mongoose';

const crowdSchema = new mongoose.Schema({
  stadium: {
    type: mongoose.Schema.ObjectId,
    ref: 'Stadium',
    required: true
  },
  zone: {
    type: String,
    required: [true, 'Please add a zone name (e.g. Gate A)']
  },
  category: {
    type: String,
    enum: ['Gate', 'Parking', 'Food', 'Medical', 'Transport', 'VIP', 'Washroom', 'Security'],
    required: true
  },
  currentPeople: {
    type: Number,
    default: 0
  },
  maxCapacity: {
    type: Number,
    required: true
  },
  densityPercentage: {
    type: Number,
    default: 0
  },
  riskLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Low'
  },
  averageWaitTime: {
    type: Number, // in minutes
    default: 0
  },
  location: {
    latitude: Number,
    longitude: Number
  }
}, {
  timestamps: true
});

// Calculate density and risk before saving
crowdSchema.pre('save', function(next) {
  if (this.maxCapacity > 0) {
    this.densityPercentage = Math.round((this.currentPeople / this.maxCapacity) * 100);
  }

  if (this.densityPercentage <= 40) {
    this.riskLevel = 'Low';
  } else if (this.densityPercentage <= 70) {
    this.riskLevel = 'Medium';
  } else if (this.densityPercentage <= 90) {
    this.riskLevel = 'High';
  } else {
    this.riskLevel = 'Critical';
  }
  
  // Basic calculation for wait time: 1 min per 50 people over 40% capacity
  if (this.densityPercentage > 40 && this.category === 'Gate') {
    const extraPeople = this.currentPeople - (this.maxCapacity * 0.4);
    this.averageWaitTime = Math.max(1, Math.round(extraPeople / 50));
  } else {
    this.averageWaitTime = Math.max(0, Math.round(this.densityPercentage / 20));
  }

  next();
});

const Crowd = mongoose.model('Crowd', crowdSchema);

export default Crowd;
