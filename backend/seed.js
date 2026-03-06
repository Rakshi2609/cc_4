import mongoose from 'mongoose';
import 'dotenv/config';
import User from './models/User.js';
import Issue from './models/Issue.js';
import Ward from './models/Ward.js';
import SensorReading from './models/SensorReading.js';
import CityAlert from './models/CityAlert.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/civicplus';

const fakeIssues = [
  // Bengaluru
  { title: 'Deep pothole near Silk Board junction', description: 'A large pothole over 30cm deep causing accidents daily. Multiple vehicles damaged.', category: 'Pothole', lat: 12.9177, lng: 77.6233, address: 'Silk Board Junction, Bengaluru', status: 'pending' },
  { title: 'Street light not working on Koramangala 5th Block', description: 'Three consecutive street lights are out since last two weeks. Very dark at night.', category: 'Streetlight', lat: 12.9352, lng: 77.6245, address: 'Koramangala 5th Block, Bengaluru', status: 'in-progress' },
  { title: 'Garbage pile near Indiranagar metro station', description: 'Unsanitary garbage dump overflowing for 4 days. Foul smell affecting commuters.', category: 'Garbage', lat: 12.9784, lng: 77.6408, address: 'Indiranagar Metro, Bengaluru', status: 'resolved' },
  { title: 'Water pipe burst on MG Road', description: 'Major water leakage for 3 days. Road flooded, traffic disrupted.', category: 'Water Leakage', lat: 12.9767, lng: 77.6101, address: 'MG Road, Bengaluru', status: 'in-progress' },
  { title: 'Blocked drainage at BTM Layout', description: 'Stormwater drain completely blocked causing flooding during rains.', category: 'Drainage', lat: 12.9166, lng: 77.6101, address: 'BTM Layout 2nd Stage, Bengaluru', status: 'pending' },
  { title: 'Broken footpath slab at Jayanagar', description: 'Several footpath slabs missing, posing danger to pedestrians especially elderly.', category: 'Others', lat: 12.9250, lng: 77.5938, address: 'Jayanagar 4th Block, Bengaluru', status: 'resolved' },

  // Mysuru
  { title: 'Pothole on Mysore-Bengaluru highway', description: 'Multiple potholes on NH 275 causing dangerous driving conditions.', category: 'Pothole', lat: 12.3375, lng: 76.6139, address: 'NH 275, Mysuru', status: 'pending' },
  { title: 'Non-functional street lights near Mysore Palace', description: 'Lights near the main tourist attraction not working for a week.', category: 'Streetlight', lat: 12.3052, lng: 76.6552, address: 'Mysore Palace Road, Mysuru', status: 'in-progress' },

  // Mangaluru
  { title: 'Overflow garbage near Hampankatta Circle', description: 'Public dustbins overflowing near the central market area.', category: 'Garbage', lat: 12.8714, lng: 74.8431, address: 'Hampankatta Circle, Mangaluru', status: 'pending' },
  { title: 'Sewage overflow in Kadri locality', description: 'Sewage water mixing with drinking water pipelines. Health emergency.', category: 'Drainage', lat: 12.8856, lng: 74.8423, address: 'Kadri Hills, Mangaluru', status: 'in-progress' },

  // Hubballi
  { title: 'Road cave-in near Hubli station', description: 'A section of road has caved in near the railway station approach road.', category: 'Pothole', lat: 15.3647, lng: 75.1240, address: 'Railway Station Road, Hubballi', status: 'pending' },
  { title: 'Street light flickering on Lamington Road', description: 'Faulty street lights causing accidents in the evening.', category: 'Streetlight', lat: 15.3600, lng: 75.1350, address: 'Lamington Road, Hubballi', status: 'resolved' },

  // Additional Bengaluru cluster for heatmap density
  { title: 'Pothole near Whitefield ITPL gate', description: 'Large pothole at ITPL main gate causing daily traffic jam.', category: 'Pothole', lat: 12.9846, lng: 77.7271, address: 'ITPL Main Gate, Whitefield', status: 'pending' },
  { title: 'Broken street light — HSR Layout sector 5', description: 'Street light broken at a blind corner increasing road risk.', category: 'Streetlight', lat: 12.9108, lng: 77.6462, address: 'HSR Layout Sector 5, Bengaluru', status: 'in-progress' },
  { title: 'Water logging on Outer Ring Road', description: 'Persistent waterlogging after rains due to clogged storm drains near Marathahalli.', category: 'Drainage', lat: 12.9591, lng: 77.6974, address: 'Outer Ring Road, Marathahalli, Bengaluru', status: 'pending' },

  // ── Cluster test group A: Pothole cluster at Silk Board (3 reports within ~50m) ──
  { title: 'Dangerous pothole — Silk Board flyover approach', description: 'Massive pothole on the flyover approach road. Bikes swerving dangerously every morning.', category: 'Pothole', lat: 12.9179, lng: 77.6235, address: 'Silk Board Flyover, Bengaluru', status: 'pending' },
  { title: 'Giant pothole blocking left lane at Silk Board', description: 'Left lane completely blocked by a crater-sized pothole. BBMP has been notified twice but no action.', category: 'Pothole', lat: 12.9180, lng: 77.6236, address: 'Silk Board Junction, Bengaluru', status: 'pending' },

  // ── Cluster test group B: Garbage cluster at Indiranagar metro (2 reports within ~30m) ──
  { title: 'Overflowing garbage bin near Indiranagar metro entrance', description: 'The garbage bin near Gate 2 has been overflowing for 5 days. Rodents spotted near the pile.', category: 'Garbage', lat: 12.9785, lng: 77.6409, address: 'Indiranagar Metro Gate 2, Bengaluru', status: 'pending' },
  { title: 'Garbage dumped illegally beside metro pillar', description: 'Construction waste and household garbage dumped beside metro pillar 47. Blocking pedestrian footpath.', category: 'Garbage', lat: 12.9786, lng: 77.6410, address: 'Indiranagar Metro, Bengaluru', status: 'pending' },
];

const DEPT_MAP = {
  Pothole: 'Roads & Infrastructure',
  Streetlight: 'Electricity Department',
  Garbage: 'Solid Waste Management',
  Drainage: 'Water & Sanitation',
  'Water Leakage': 'Water & Sanitation',
  Others: 'General Administration',
};

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('SUCCESS: DB connected');

  // ── 1. Clear existing Ward & Sensor data (optional but cleaner for mock) ──
  await Ward.deleteMany({});
  await SensorReading.deleteMany({});
  await CityAlert.deleteMany({});
  console.log('🗑️  Cleared existing Wards, SensorReadings, and CityAlerts');

  // ── 2. Seed Wards ────────────────────────────────────────────────────────
  const wardsData = [
    {
      wardId: 'W150',
      name: 'Bellandur',
      zone: 'Residential',
      population: 85000,
      location: { coordinates: [77.6762, 12.9304] },
      resources: {
        power: { utilization: 75, budget: 1500000, capacity: 5000 },
        water: { utilization: 92, budget: 1200000, capacity: 3000 },
        traffic: { utilization: 88, budget: 800000, capacity: 2000 },
        sewage: { utilization: 65, budget: 1000000, capacity: 4000 },
        waste: { utilization: 80, budget: 900000, capacity: 2500 },
        internet: { utilization: 45, budget: 500000, capacity: 10000 }
      },
      currentHealthIndex: 68
    },
    {
      wardId: 'W174',
      name: 'HSR Layout',
      zone: 'Residential',
      population: 62000,
      location: { coordinates: [77.6411, 12.9103] },
      resources: {
        power: { utilization: 60, budget: 1300000, capacity: 5000 },
        water: { utilization: 70, budget: 1100000, capacity: 3000 },
        traffic: { utilization: 65, budget: 900000, capacity: 2000 },
        sewage: { utilization: 55, budget: 950000, capacity: 4000 },
        waste: { utilization: 90, budget: 1100000, capacity: 2500 },
        internet: { utilization: 70, budget: 600000, capacity: 10000 }
      },
      currentHealthIndex: 82
    },
    {
      wardId: 'W080',
      name: 'Indiranagar',
      zone: 'Commercial',
      population: 45000,
      location: { coordinates: [77.6408, 12.9784] },
      resources: {
        power: { utilization: 85, budget: 2000000, capacity: 8000 },
        water: { utilization: 60, budget: 1000000, capacity: 4000 },
        traffic: { utilization: 95, budget: 1500000, capacity: 3000 },
        sewage: { utilization: 75, budget: 1200000, capacity: 5000 },
        waste: { utilization: 85, budget: 1400000, capacity: 3500 },
        internet: { utilization: 90, budget: 1000000, capacity: 15000 }
      },
      currentHealthIndex: 74
    },
    {
      wardId: 'W192',
      name: 'Begur',
      zone: 'Slum',
      population: 78000,
      location: { coordinates: [77.6322, 12.8719] },
      resources: {
        power: { utilization: 95, budget: 500000, capacity: 2000 },
        water: { utilization: 98, budget: 400000, capacity: 1500 },
        traffic: { utilization: 40, budget: 300000, capacity: 1000 },
        sewage: { utilization: 90, budget: 600000, capacity: 2000 },
        waste: { utilization: 95, budget: 400000, capacity: 1000 },
        internet: { utilization: 20, budget: 200000, capacity: 2000 }
      },
      currentHealthIndex: 42
    }
  ];

  const createdWards = [];
  for (const w of wardsData) {
    const ward = await Ward.create(w);
    createdWards.push(ward);
    console.log(`  🏢 Ward Created: ${ward.name} (${ward.wardId})`);
  }

  // ── 3. Seed Sensor Analytics (Historical Data) ──────────────────────────
  console.log('📊 Generating 24-hour historical analytics data...');
  const now = new Date();
  for (const ward of createdWards) {
    for (let i = 24; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000); // 1-hour intervals

      // Random variation around the current utilization
      const generateVal = (base) => Math.max(0, Math.min(100, base + (Math.random() * 20 - 10)));

      await SensorReading.create({
        ward: ward._id,
        timestamp,
        readings: {
          power: { utilization: generateVal(ward.resources.power.utilization) },
          water: { utilization: generateVal(ward.resources.water.utilization) },
          traffic: { utilization: generateVal(ward.resources.traffic.utilization) },
          sewage: { utilization: generateVal(ward.resources.sewage.utilization) },
          waste: { utilization: generateVal(ward.resources.waste.utilization) },
          internet: { utilization: generateVal(ward.resources.internet.utilization) }
        },
        healthIndexAtTime: Math.max(0, Math.min(100, ward.currentHealthIndex + (Math.random() * 10 - 5)))
      });
    }
  }
  console.log('✅ Historical analytics seeded for all wards');

  // ── 3.5 Seed City Alerts (For Analytics & Congestion) ───────────────────
  console.log('🔔 Seeding City Alerts...');
  let govtUser = await User.findOne({ role: 'government' });
  if (!govtUser) {
    govtUser = await User.create({
      name: 'Govt Admin',
      email: 'admin@gov.in',
      password: 'admin1234',
      role: 'government',
    });
    console.log('👤 Govt admin created: admin@gov.in / admin1234');
  }

  const alerts = [
    {
      title: 'Major Water Leakage - Bellandur',
      description: 'Primary pipeline burst near Outer Ring Road. Supply interrupted for 12 hours.',
      category: 'water',
      severity: 'critical',
      zone: 'Bellandur',
      location: { coordinates: [77.6762, 12.9304] },
      createdBy: govtUser._id
    },
    {
      title: 'Heavy Traffic Congestion - Silk Board',
      description: 'Multiple vehicle breakdown on flyover causing 2km tailback.',
      category: 'traffic',
      severity: 'critical',
      zone: 'Silk Board',
      location: { coordinates: [77.6233, 12.9177] },
      createdBy: govtUser._id
    },
    {
      title: 'Power Grid Maintenance',
      description: 'Scheduled maintenance in HSR Layout Sector 2 and 3.',
      category: 'power',
      severity: 'warning',
      zone: 'HSR Layout',
      location: { coordinates: [77.6411, 12.9103] },
      createdBy: govtUser._id
    },
    {
      title: 'Air Quality Alert',
      description: 'High particulate matter detected in industrial zone. Wear masks.',
      category: 'pollution',
      severity: 'warning',
      zone: 'Whitefield',
      location: { coordinates: [77.7271, 12.9846] },
      createdBy: govtUser._id
    }
  ];

  for (const a of alerts) {
    await CityAlert.create(a);
  }
  console.log('✅ City alerts seeded');

  // ── 4. Existing User & Issue Seeding Logic ──────────────────────────────

  // Find or create demo citizen users (we use 2 so cluster reporters look realistic)
  let citizen = await User.findOne({ email: 'demo@citizen.com' });
  if (!citizen) {
    citizen = await User.create({
      name: 'Demo Citizen',
      email: 'demo@citizen.com',
      password: 'demo1234',
      role: 'citizen',
    });
    console.log('👤 Demo citizen created: demo@citizen.com / demo1234');
  } else {
    console.log('👤 Using existing demo citizen');
  }

  let citizen2 = await User.findOne({ email: 'demo2@citizen.com' });
  if (!citizen2) {
    citizen2 = await User.create({
      name: 'Ravi Kumar',
      email: 'demo2@citizen.com',
      password: 'demo1234',
      role: 'citizen',
    });
    console.log('👤 Demo citizen 2 created: demo2@citizen.com / demo1234');
  } else {
    console.log('👤 Using existing demo citizen 2');
  }

  // Assign alternating citizens so cluster reporters look distinct
  const citizens = [citizen, citizen2];

  let created = 0;
  for (let idx = 0; idx < fakeIssues.length; idx++) {
    const d = fakeIssues[idx];
    const exists = await Issue.findOne({ title: d.title });
    if (exists) { console.log(`  ⏩ Already exists: ${d.title}`); continue; }

    await Issue.create({
      title: d.title,
      description: d.description,
      category: d.category,
      imageUrl: '',
      photoUrl: '',
      location: {
        type: 'Point',
        coordinates: [d.lng, d.lat],
        address: d.address,
      },
      status: d.status,
      citizen: citizens[idx % 2]._id,
      assignedDepartment: DEPT_MAP[d.category],
      governmentRemarks: d.status === 'resolved' ? 'Issue resolved by department team.' : '',
      statusHistory: [
        { status: 'pending', remark: 'Issue submitted', updatedBy: citizens[idx % 2]._id },
        ...(d.status !== 'pending'
          ? [{ status: d.status, remark: `Status updated to ${d.status}`, updatedBy: citizens[idx % 2]._id }]
          : []),
      ],
    });
    console.log(`  SUCCESS: Created: ${d.title}`);
    created++;
  }

  // ── Wire up cluster test groups ────────────────────────────────────────────
  // Group A: Pothole cluster at Silk Board (3 reports)
  const silkPrimary = await Issue.findOne({ title: 'Dangerous pothole — Silk Board flyover approach' });
  const silkMember1 = await Issue.findOne({ title: 'Giant pothole blocking left lane at Silk Board' });
  if (silkPrimary && silkMember1 && !silkPrimary.isCluster) {
    silkPrimary.isCluster = true;
    silkPrimary.clusterMembers = [silkMember1._id];
    silkPrimary.priorityScore = 1;
    await silkPrimary.save();
    silkMember1.clusterId = silkPrimary._id;
    await silkMember1.save();
    console.log('🔥 Cluster A wired: Pothole @ Silk Board (2 reports)');
  }

  // Group B: Garbage cluster at Indiranagar metro (2 reports)
  const indraPrimary = await Issue.findOne({ title: 'Overflowing garbage bin near Indiranagar metro entrance' });
  const indraMember1 = await Issue.findOne({ title: 'Garbage dumped illegally beside metro pillar' });
  if (indraPrimary && indraMember1 && !indraPrimary.isCluster) {
    indraPrimary.isCluster = true;
    indraPrimary.clusterMembers = [indraMember1._id];
    indraPrimary.priorityScore = 1;
    await indraPrimary.save();
    indraMember1.clusterId = indraPrimary._id;
    await indraMember1.save();
    console.log('🔥 Cluster B wired: Garbage @ Indiranagar (2 reports)');
  }

  console.log(`\n🎉 Seeded ${created} new issues. Total fake issues: ${fakeIssues.length}`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
