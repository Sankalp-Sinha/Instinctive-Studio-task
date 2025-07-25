// prisma/seed.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  await prisma.incident.deleteMany({});
  await prisma.camera.deleteMany({});
  console.log('Cleared existing data.');

  const camera1 = await prisma.camera.create({
    data: {
      name: 'Shop Floor A',
      location: 'Main Retail Area',
    },
  });

  const camera2 = await prisma.camera.create({
    data: {
      name: 'Vault',
      location: 'Secure Storage Room',
    },
  });

  const camera3 = await prisma.camera.create({
    data: {
      name: 'Entrance',
      location: 'Building Main Entrance',
    },
  });

  const camera4 = await prisma.camera.create({
    data: {
      name: 'Loading Dock',
      location: 'Rear Facility Access',
    },
  });

  console.log('Created cameras:', { camera1, camera2, camera3, camera4 });

  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);
  const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);
  const eighteenHoursAgo = new Date(now.getTime() - 18 * 60 * 60 * 1000);
  const twentyTwoHoursAgo = new Date(now.getTime() - 22 * 60 * 60 * 1000);

  const incidents = [];

  incidents.push(await prisma.incident.create({
    data: {
      cameraId: camera1.id,
      type: 'Unauthorised Access',
      tsStart: oneHourAgo,
      tsEnd: new Date(oneHourAgo.getTime() + 5 * 60 * 1000), 
      thumbnailUrl: '/thumbnails/unauthorised_access_1.jpg',
      resolved: false,
    },
  }));

  incidents.push(await prisma.incident.create({
    data: {
      cameraId: camera1.id,
      type: 'Face Recognised',
      tsStart: twoHoursAgo,
      tsEnd: new Date(twoHoursAgo.getTime() + 2 * 60 * 1000), 
      thumbnailUrl: '/thumbnails/face_recognised_1.webp',
      resolved: true, 
    },
  }));

  incidents.push(await prisma.incident.create({
    data: {
      cameraId: camera1.id,
      type: 'Unauthorised Access',
      tsStart: sixHoursAgo,
      tsEnd: new Date(sixHoursAgo.getTime() + 10 * 60 * 1000), 
      thumbnailUrl: '/thumbnails/unauthorised_access_2.jpeg',
      resolved: false,
    },
  }));

  incidents.push(await prisma.incident.create({
    data: {
      cameraId: camera2.id,
      type: 'Gun Threat',
      tsStart: new Date(now.getTime() - 30 * 60 * 1000),
      tsEnd: new Date(now.getTime() - 28 * 60 * 1000),
      thumbnailUrl: '/thumbnails/gun_threat_1.jpeg',
      resolved: false,
    },
  }));

  incidents.push(await prisma.incident.create({
    data: {
      cameraId: camera2.id,
      type: 'Unauthorised Access',
      tsStart: new Date(twelveHoursAgo.getTime() + 15 * 60 * 1000), 
      tsEnd: new Date(twelveHoursAgo.getTime() + 20 * 60 * 1000),
      thumbnailUrl: '/thumbnails/unauthorised_access_3.jpeg',
      resolved: false,
    },
  }));

  incidents.push(await prisma.incident.create({
    data: {
      cameraId: camera2.id,
      type: 'Gun Threat',
      tsStart: eighteenHoursAgo,
      tsEnd: new Date(eighteenHoursAgo.getTime() + 3 * 60 * 1000),
      thumbnailUrl: '/thumbnails/gun_threat_2.jpeg',
      resolved: true,
    },
  }));

  incidents.push(await prisma.incident.create({
    data: {
      cameraId: camera3.id,
      type: 'Face Recognised',
      tsStart: new Date(now.getTime() - 10 * 60 * 1000),
      tsEnd: new Date(now.getTime() - 8 * 60 * 1000),
      thumbnailUrl: '/thumbnails/face_recognised_2.jpg',
      resolved: false,
    },
  }));

  incidents.push(await prisma.incident.create({
    data: {
      cameraId: camera3.id,
      type: 'Unauthorised Access',
      tsStart: new Date(now.getTime() - 45 * 60 * 1000), 
      tsEnd: new Date(now.getTime() - 40 * 60 * 1000),
      thumbnailUrl: '/thumbnails/unauthorised_access_4.jpeg',
      resolved: false,
    },
  }));

  incidents.push(await prisma.incident.create({
    data: {
      cameraId: camera3.id,
      type: 'Gun Threat',
      tsStart: twentyTwoHoursAgo,
      tsEnd: new Date(twentyTwoHoursAgo.getTime() + 4 * 60 * 1000),
      thumbnailUrl: '/thumbnails/gun_threat_3.jpeg',
      resolved: false,
    },
  }));

  incidents.push(await prisma.incident.create({
    data: {
      cameraId: camera4.id,
      type: 'Unauthorised Access',
      tsStart: new Date(now.getTime() - 5 * 60 * 1000), 
      tsEnd: new Date(now.getTime() - 2 * 60 * 1000),
      thumbnailUrl: '/thumbnails/unauthorised_access_5.jpeg',
      resolved: false,
    },
  }));
   incidents.push(await prisma.incident.create({
    data: {
      cameraId: camera4.id,
      type: 'Face Recognised',
      tsStart: new Date(now.getTime() - 15 * 60 * 1000),
      tsEnd: new Date(now.getTime() - 12 * 60 * 1000),
      thumbnailUrl: '/thumbnails/face_recognised_3.jpeg',
      resolved: false,
    },
  }));
   incidents.push(await prisma.incident.create({
    data: {
      cameraId: camera4.id,
      type: 'Gun Threat',
      tsStart: new Date(now.getTime() - 25 * 60 * 1000), 
      tsEnd: new Date(now.getTime() - 20 * 60 * 1000),
      thumbnailUrl: '/thumbnails/gun_threat_4.jpeg',
      resolved: false,
    },
  }));

  console.log(`Created ${incidents.length} incidents.`);
  console.log('Seeding finished.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });