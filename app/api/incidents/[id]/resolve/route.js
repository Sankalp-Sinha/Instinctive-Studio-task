// app/api/incidents/[id]/resolve/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(request, { params }) {
  const { id } = params; 

  try {
    const incident = await prisma.incident.findUnique({
      where: { id: id },
      select: { resolved: true } 
    });

    if (!incident) {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
    }

    const newResolvedStatus = !incident.resolved;

    const updatedIncident = await prisma.incident.update({
      where: { id: id },
      data: {
        resolved: newResolvedStatus,
      },
      include: {
        camera: { 
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
      },
    });

    return NextResponse.json(updatedIncident);

  } catch (error) {
    console.error(`Error updating incident ${id}:`, error);
    if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Incident not found or could not be updated.' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update incident' }, { status: 500 });
  }
}