import mongoose from 'mongoose';
import Stadium from '../models/Stadium.js';
import Facility from '../models/Facility.js';

export const seedFacilities = async () => {
  try {
    const stadium = await Stadium.findOne();
    if (!stadium) {
      console.log('No stadium found, skipping facilities seed');
      return;
    }

    // Clear existing
    await Facility.deleteMany({});

    const facilities = [
      {
        stadium: stadium._id,
        name: 'North Gate Ramp',
        category: 'Ramp',
        coordinates: { lat: stadium.latitude + 0.001, lng: stadium.longitude },
        accessible: true,
        brailleSupport: false,
        audioSupport: false,
        status: 'Active'
      },
      {
        stadium: stadium._id,
        name: 'Main Elevator A',
        category: 'Elevator',
        coordinates: { lat: stadium.latitude, lng: stadium.longitude - 0.001 },
        accessible: true,
        brailleSupport: true,
        audioSupport: true,
        status: 'Active'
      },
      {
        stadium: stadium._id,
        name: 'Accessible Washroom 1',
        category: 'Accessible Washroom',
        coordinates: { lat: stadium.latitude - 0.001, lng: stadium.longitude + 0.001 },
        accessible: true,
        brailleSupport: true,
        audioSupport: false,
        status: 'Active'
      },
      {
        stadium: stadium._id,
        name: 'Wheelchair Parking P5',
        category: 'Wheelchair Parking',
        coordinates: { lat: stadium.latitude + 0.002, lng: stadium.longitude + 0.002 },
        accessible: true,
        brailleSupport: false,
        audioSupport: false,
        status: 'Active'
      }
    ];

    await Facility.insertMany(facilities);
    console.log(`Seeded ${facilities.length} accessible facilities`);
  } catch (error) {
    console.error('Error seeding facilities:', error);
  }
};
