require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Report = require('./models/Report');

const daysAgo = (days) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);

const sampleReports = [
  {
    location: 'Station Road, Nugegoda',
    wasteType: 'Household',
    description:
      "The bin at the junction hasn't been emptied in four days and stray dogs are tearing the bags open every night.",
    status: 'pending',
    reportedBy: 'Dilani P.',
    createdAt: daysAgo(1),
  },
  {
    location: 'Galle Road, Dehiwala',
    wasteType: 'Plastic',
    description:
      'Pile of plastic bottles and food wrappers dumped beside the bus halt. It has been growing all week.',
    imageUrl: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=800',
    status: 'in-progress',
    reportedBy: 'Anonymous',
    createdAt: daysAgo(2),
  },
  {
    location: 'Havelock Town, Colombo 05',
    wasteType: 'Organic',
    description:
      'Market vegetable waste left on the pavement after the Sunday fair. The smell is unbearable by afternoon.',
    status: 'collected',
    reportedBy: 'Nimal Fernando',
    createdAt: daysAgo(9),
  },
  {
    location: 'High Level Road, Maharagama',
    wasteType: 'Household',
    description:
      'Missed collection on our lane for the second week running. Six houses have bags waiting on the road.',
    status: 'pending',
    reportedBy: 'Anonymous',
    createdAt: daysAgo(3),
  },
  {
    location: 'Peradeniya Road, Kandy',
    wasteType: 'Other',
    description:
      'Someone dumped broken furniture and a mattress near the canal bank. It is blocking half the walkway.',
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800',
    status: 'in-progress',
    reportedBy: 'Kasun W.',
    createdAt: daysAgo(5),
  },
  {
    location: 'Main Street, Negombo',
    wasteType: 'Organic',
    description:
      'Fish market waste is being left out overnight instead of going into the collection bins. Crows everywhere in the morning.',
    status: 'pending',
    reportedBy: 'Anonymous',
    createdAt: daysAgo(4),
  },
  {
    location: 'Lighthouse Street, Galle Fort',
    wasteType: 'Plastic',
    description:
      'Tourist area bins are overflowing with bottles and takeaway containers. They need emptying twice a day, not once.',
    status: 'collected',
    reportedBy: 'Shanika R.',
    createdAt: daysAgo(12),
  },
  {
    location: 'Rawathawatte, Moratuwa',
    wasteType: 'Household',
    description:
      'The collection truck has not come down our side road since the holiday. Bags are piling up at the corner.',
    status: 'in-progress',
    reportedBy: 'Anonymous',
    createdAt: daysAgo(6),
  },
  {
    location: 'Kaduwela Road, Battaramulla',
    wasteType: 'Other',
    description:
      'Construction rubble left on the roadside after a house renovation. Two weeks now and nobody has cleared it.',
    status: 'pending',
    reportedBy: 'Ruwan de Silva',
    createdAt: daysAgo(8),
  },
  {
    location: 'Temple Road, Kalutara',
    wasteType: 'Organic',
    description:
      'Garden waste and coconut husks dumped in the empty plot next to the temple. Mosquitoes are breeding in it.',
    status: 'collected',
    reportedBy: 'Anonymous',
    createdAt: daysAgo(14),
  },
];

async function seed() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    const removed = await Report.deleteMany({});
    console.log(`Cleared ${removed.deletedCount} existing reports`);

    const inserted = await Report.insertMany(sampleReports);
    console.log(`Seeded ${inserted.length} reports`);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

seed();
