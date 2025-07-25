"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  AlertTriangle,
  GitPullRequestClosed,
  Camera,
  SearchCode,
  Crosshair
} from 'lucide-react';

const formatDateTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const getIncidentTypeIcon = (type) => {
  switch (type) {
    case 'Unauthorised Access':
      return { icon: <AlertTriangle className="text-red-500" />, color: 'text-red-500' };
    case 'Gun Threat':
      return { icon: <Crosshair className="text-orange-500" />, color: 'text-orange-500' };
    case 'Face Recognised':
      return { icon: <SearchCode className="text-blue-500" />, color: 'text-blue-500' };
    default:
      return { icon: <Camera className="text-gray-400" />, color: 'text-gray-400' };
  }
};

export default function IncidentList({ onIncidentSelect, onIncidentsUpdate }) {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showResolved, setShowResolved] = useState(false);
  const [selectedIncidentId, setSelectedIncidentId] = useState(null);
  const [resolvedCount,setresolvedcount]=useState(0)

  const fetchIncidents = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = showResolved ? '/api/incidents' : '/api/incidents?resolved=false';
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setIncidents(data);
      console.log(data);      
      if (onIncidentsUpdate) {
        onIncidentsUpdate(data);
      }
    } catch (err) {
      console.error('Failed to fetch incidents:', err);
      setError('Failed to load incidents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [showResolved]);

  useEffect(() => {
  setresolvedcount(incidents.filter(inc => inc.resolved).length);
}, [incidents]);

  const handleIncidentClick = (incident) => {
    setSelectedIncidentId(incident.id);
    if (onIncidentSelect) {
      onIncidentSelect(incident);
    }
  };

  const handleResolve = async (incidentId, e) => {
    e.stopPropagation(); 
    
    setIncidents(prevIncidents =>
      prevIncidents.map(inc =>
        inc.id === incidentId ? { ...inc, resolving: true } : inc
      )
    );

    try {
      const res = await fetch(`/api/incidents/${incidentId}/resolve`, {
        method: 'PATCH',
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const updatedIncident = await res.json();

      if (!showResolved && updatedIncident.resolved) {
        const newIncidents = incidents.filter(inc => inc.id !== updatedIncident.id);
        setIncidents(newIncidents);
        
        if (onIncidentsUpdate) {
          fetchIncidents();
        }
      } else {
        const newIncidents = incidents.map(inc => inc.id === updatedIncident.id ? updatedIncident : inc);
        setIncidents(newIncidents);
        
        if (onIncidentsUpdate) {
          onIncidentsUpdate(newIncidents);
        }
      }

    } catch (err) {
      console.error(`Failed to resolve incident ${incidentId}:`, err);
      setError('Failed to resolve incident.');
      
      setIncidents(prevIncidents =>
        prevIncidents.map(inc =>
          inc.id === incidentId ? { ...inc, resolving: false } : inc
        )
      );
    }
  };

  const unresolvedCount = incidents.filter(inc => !inc.resolved).length;

  if (loading) return (
    <div className="flex items-center justify-center h-full bg-gray-800 rounded-lg">
      <div className="text-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-2"></div>
        <div className="text-gray-300">Loading incidents...</div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center h-full bg-gray-800 rounded-lg">
      <div className="text-center p-4 text-red-500">
        <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
        {error}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col bg-gray-800 p-4 rounded-lg shadow-lg h-full overflow-hidden border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">
          <span className="text-red-400">{unresolvedCount}</span> Unresolved Incidents
        </h2>
        <button
          onClick={() => setShowResolved(!showResolved)}
          className="text-sm text-blue-400 hover:text-blue-300 hover:underline flex items-center transition-colors"
        >
          {showResolved ? (
            <>
              <AlertTriangle className="h-4 w-4 mr-1" />
              Show Unresolved
            </>
          ) : (
            <>
              <GitPullRequestClosed className="h-4 w-4 mr-1" />
              Show Resolved ({12-unresolvedCount})
            </>
          )}
        </button>
      </div>

      <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
        {incidents.length === 0 ? (
          <div className="text-center text-gray-500 p-8">
            <Camera className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <div>No incidents found {showResolved ? '' : 'that are unresolved'}.</div>
          </div>
        ) : (
          incidents.map((incident) => {
            const { icon: typeIcon, color: typeColor } = getIncidentTypeIcon(incident.type);
            const isFadingOut = incident.resolving && !showResolved;
            const isSelected = selectedIncidentId === incident.id;

            return (
              <div
                key={incident.id}
                className={`flex items-center space-x-4 p-3 mb-3 rounded-lg shadow-md transition-all duration-300 cursor-pointer border ${
                  isFadingOut ? 'opacity-0 h-0 p-0 mb-0' : 'opacity-100'
                } ${
                  isSelected 
                    ? 'bg-blue-700 border-blue-500 shadow-blue-500/50' 
                    : 'bg-gray-700 hover:bg-gray-600 border-gray-600'
                }`}
                style={isFadingOut ? { overflow: 'hidden' } : {}}
                onClick={() => handleIncidentClick(incident)}
              >
                <div className="relative w-20 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-600">
                  <Image
                    src={incident.thumbnailUrl || '/placeholders/default_incident_thumbnail.jpg'}
                    alt={`Thumbnail for ${incident.type}`}
                    layout="fill"
                    objectFit="cover"
                  />
                  <div className={`absolute top-1 left-1 p-1 rounded-full bg-black bg-opacity-70 ${typeColor}`}>
                    {typeIcon}
                  </div>
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex items-center text-sm font-semibold mb-1">
                    <span className={`mr-2 ${typeColor}`}>{typeIcon}</span>
                    <span className={`${typeColor} truncate`}>{incident.type}</span>
                    {incident.resolved && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-green-600 text-green-100 rounded-full flex-shrink-0">
                        Resolved
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 mb-1 truncate">
                    📹 {incident.camera?.name || 'Unknown Camera'} - {incident.camera?.location}
                  </div>
                  <div className="text-xs text-gray-500">
                    🕒 {formatDateTime(incident.tsStart)} - {formatDateTime(incident.tsEnd)}
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {!incident.resolved ? (
                    <button
                      onClick={(e) => handleResolve(incident.id, e)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded-md transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={incident.resolving}
                    >
                      {incident.resolving ? (
                        <div className="flex items-center space-x-1">
                          <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent"></div>
                          <span>Resolving...</span>
                        </div>
                      ) : (
                        'Resolve'
                      )}
                    </button>
                  ) : (
                    <div className="text-green-500 text-sm flex items-center font-medium">
                      <GitPullRequestClosed className="h-4 w-4 mr-1" /> 
                      Resolved
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #374151;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
    </div>
  );
}