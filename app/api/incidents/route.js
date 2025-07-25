// app/api/incidents/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; 

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const resolvedParam = searchParams.get('resolved');

    let whereClause = {};

    if (resolvedParam !== null) {
      whereClause.resolved = resolvedParam === 'true';
    }

    const incidents = await prisma.incident.findMany({
      where: whereClause,
      orderBy: {
        tsStart: 'desc', 
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

    return NextResponse.json(incidents);
  } catch (error) {
    console.error('Error fetching incidents:', error);
    return NextResponse.json({ error: 'Failed to fetch incidents' }, { status: 500 });
  }
}