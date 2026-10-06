const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Event = require('../src/models/Event');

dotenv.config();

const sakecOwnerId = new mongoose.Types.ObjectId('000000000000000000000001');

const demoEvents = [
  {
    match: /freshers\s*orientation/i,
    title: 'SAKEC Freshers Orientation 2026',
    description: 'A campus welcome and orientation programme for the incoming SAKEC student community, with introductions to student clubs, facilities, and academic support.',
    date: new Date('2026-09-12T10:00:00+05:30'),
    location: 'Auditorium, Shah & Anchor Kutchhi Engineering College, Chembur, Mumbai',
    capacity: 400,
    category: 'Student Orientation',
    eligibility: 'all-colleges',
    invitedColleges: [],
    organizerName: 'SAKEC Student Council',
    tags: ['orientation', 'campus'],
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=85'
  },
  {
    match: /tech\s*fest/i,
    title: 'SAKEC Tech Fest 2026',
    description: 'A two-day celebration of engineering, innovation, and student-built technology at Shah & Anchor Kutchhi Engineering College. Explore project showcases, hands-on workshops, and technical competitions. Open to SAKEC and students from other colleges.',
    date: new Date('2026-12-05T09:30:00+05:30'),
    location: 'Main Building and campus grounds, Shah & Anchor Kutchhi Engineering College, Chembur, Mumbai',
    capacity: 500,
    category: 'Technology Festival',
    eligibility: 'all-colleges',
    invitedColleges: [],
    organizerName: 'SAKEC Student Council',
    tags: ['technology', 'festival', 'open to all colleges'],
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=85'
  },
  {
    match: /hackathon/i,
    title: 'SAKEC Intercollegiate Hackathon 2026',
    description: 'A 24-hour intercollegiate build sprint for teams to prototype practical solutions in software, accessibility, sustainability, and campus life. Students from all colleges are welcome to participate.',
    date: new Date('2026-11-21T09:00:00+05:30'),
    location: 'Computer Engineering Labs, Shah & Anchor Kutchhi Engineering College, Chembur, Mumbai',
    capacity: 160,
    category: 'Hackathon',
    eligibility: 'all-colleges',
    invitedColleges: [],
    organizerName: 'SAKEC Technical Committee',
    tags: ['hackathon', 'intercollegiate', 'open to all colleges'],
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=85'
  },
  {
    match: /cultural\s*fest/i,
    title: 'SAKEC Cultural Fest 2026',
    description: 'An evening of student performances, music, dance, and creative showcases hosted by SAKEC. Participation is open to SAKEC students and students from invited colleges.',
    date: new Date('2026-12-18T16:00:00+05:30'),
    location: 'Auditorium, Shah & Anchor Kutchhi Engineering College, Chembur, Mumbai',
    capacity: 800,
    category: 'Cultural Festival',
    eligibility: 'sakec-and-invited',
    invitedColleges: [
      'K. J. Somaiya College of Engineering',
      'Vivekanand Education Society Institute of Technology'
    ],
    organizerName: 'SAKEC Cultural Committee',
    tags: ['culture', 'music', 'dance', 'invited colleges'],
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=85'
  }
];

const seedDemoEvents = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/univent';
  await mongoose.connect(mongoUri);

  const existingUpcoming = await Event.find({ date: { $gte: new Date() } });
  const usedIds = new Set();

  for (const demoEvent of demoEvents) {
    const existingEvent = existingUpcoming.find(event =>
      !usedIds.has(String(event._id)) && demoEvent.match.test(event.title)
    );
    const setFields = {
      title: demoEvent.title,
      description: demoEvent.description,
      date: demoEvent.date,
      location: demoEvent.location,
      capacity: demoEvent.capacity,
      category: demoEvent.category,
      eligibility: demoEvent.eligibility,
      invitedColleges: demoEvent.invitedColleges,
      organizerName: demoEvent.organizerName,
      tags: demoEvent.tags,
      image: demoEvent.image,
      registrationOpen: true,
      updatedAt: new Date()
    };

    if (existingEvent) {
      usedIds.add(String(existingEvent._id));
      await Event.updateOne({ _id: existingEvent._id }, { $set: setFields });
      console.log(`Updated upcoming event: ${demoEvent.title}`);
    } else {
      await Event.updateOne(
        { title: demoEvent.title },
        {
          $set: setFields,
          $setOnInsert: {
            createdBy: sakecOwnerId,
            participants: [],
            createdAt: new Date()
          }
        },
        { upsert: true }
      );
      console.log(`Seeded event if missing: ${demoEvent.title}`);
    }
  }
};

seedDemoEvents()
  .catch(error => {
    console.error('Failed to seed SAKEC demo events:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
