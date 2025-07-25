import DashboardClient from '../components/DashboardClient';
import prisma from '@/lib/prisma';

export default async function DashboardPage() {
  const initialIncident = await prisma.incident.findFirst({
    where: { resolved: false },
    orderBy: { tsStart: 'desc' },
    include: { camera: true },
  });

  const allIncidents = await prisma.incident.findMany({
    orderBy: {
      tsStart: 'desc', 
    },
    include: {
      camera: true,
    },
  });

  return (
    <DashboardClient 
      initialIncident={initialIncident}
      initialAllIncidents={allIncidents}
    />
  );
}