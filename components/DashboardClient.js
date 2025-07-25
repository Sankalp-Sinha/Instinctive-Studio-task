"use client";

import { useState, useEffect } from 'react';
import IncidentPlayer from './Incident_players';
import IncidentList from './Incident_List';
import IncidentTimeline from './Incident_Timeline';

export default function DashboardClient({ initialIncident, initialAllIncidents }) {
  const [currentIncident, setCurrentIncident] = useState(initialIncident);
  const [allIncidents, setAllIncidents] = useState(initialAllIncidents);
  const [selectedTime, setSelectedTime] = useState(null);

  const handleTimelineSeek = (seekTime) => {
    setSelectedTime(seekTime);
    
    const incidentAtTime = allIncidents.find(incident => {
      const startTime = new Date(incident.tsStart);
      const endTime = new Date(incident.tsEnd);
      return seekTime >= startTime && seekTime <= endTime;
    });

    if (incidentAtTime) {
      setCurrentIncident(incidentAtTime);
    }
  };

  const handleIncidentSelect = (incident) => {
    setCurrentIncident(incident);
    setSelectedTime(new Date(incident.tsStart));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] space-y-4 p-4">
      <div className="flex flex-col lg:flex-row flex-1 space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="lg:w-2/3 flex-shrink-0">
          <IncidentPlayer
            mainCameraId={currentIncident?.camera?.name || 'Camera - 01'}
            currentIncident={currentIncident}
            selectedTime={selectedTime}
          />
        </div>

        <div className="lg:w-1/3 flex-grow">
          <IncidentList onIncidentSelect={handleIncidentSelect} />
        </div>
      </div>

      <div className="h-80 flex-shrink-0">
        <IncidentTimeline 
          incidents={allIncidents} 
          onTimelineSeek={handleTimelineSeek}
        />
      </div>
    </div>
  );
}