"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, AlertTriangle, Crosshair, SearchCode, Users } from 'lucide-react';

export default function IncidentTimeline({ incidents, onTimelineSeek }) {
  const timelineRef = useRef(null);
  const [timelineWidth, setTimelineWidth] = useState(0);
  const [scrubberPosition, setScrubberPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const get24HourWindow = useCallback(() => {
    if (incidents.length === 0) {
      const now = new Date();
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, 0);
      const start = new Date(end.getTime() - 24 * 60 * 60 * 1000);
      return { start, end };
    }
    
    const allTimes = incidents.flatMap(inc => [new Date(inc.tsStart), new Date(inc.tsEnd)]);
    const earliest = new Date(Math.min(...allTimes));
    const latest = new Date(Math.max(...allTimes));
    
    const start = new Date(earliest.getTime() - 2 * 60 * 60 * 1000); // 2 hours before
    const end = new Date(latest.getTime() + 2 * 60 * 60 * 1000); // 2 hours after
    
    return { start, end };
  }, [incidents]);

  const { start: windowStart, end: windowEnd } = get24HourWindow();
  const totalWindowDuration = windowEnd.getTime() - windowStart.getTime();

  const cameras = React.useMemo(() => {
    const cameraMap = new Map();
    incidents.forEach(incident => {
      if (incident.camera && !cameraMap.has(incident.camera.id)) {
        cameraMap.set(incident.camera.id, incident.camera);
      }
    });
    return Array.from(cameraMap.values());
  }, [incidents]);

  const incidentsByCamera = React.useMemo(() => {
    const grouped = {};
    incidents.forEach(incident => {
      const cameraId = incident.camera?.id || 'unknown';
      if (!grouped[cameraId]) {
        grouped[cameraId] = [];
      }
      grouped[cameraId].push(incident);
    });
    return grouped;
  }, [incidents]);

  useEffect(() => {
    const handleResize = () => {
      if (timelineRef.current) {
        setTimelineWidth(timelineRef.current.clientWidth - 160); // Account for camera labels
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const generateTimeMarkers = useCallback(() => {
    if (!timelineWidth || totalWindowDuration === 0) return [];
    
    const markers = [];
    
    for (let hour = 0; hour < 24; hour++) {
      const markerTime = new Date();
      markerTime.setHours(hour, 0, 0, 0);
      
      const hourMs = hour * 60 * 60 * 1000;
      const dayStartMs = 0; 
      const position = (hourMs / (24 * 60 * 60 * 1000)) * timelineWidth;
      
      markers.push({
        time: markerTime.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }),
        fullTime: markerTime.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }),
        position: position
      });
    }
    
    return markers;
  }, [timelineWidth, totalWindowDuration]);

  const calculateIncidentPosition = useCallback((tsStart, tsEnd) => {
    if (!timelineWidth || totalWindowDuration === 0) return { left: 0, width: 0 };

    const incidentStartTime = new Date(tsStart).getTime();
    const incidentEndTime = new Date(tsEnd).getTime();

    const effectiveStartTime = Math.max(incidentStartTime, windowStart.getTime());
    const effectiveEndTime = Math.min(incidentEndTime, windowEnd.getTime());

    if (effectiveStartTime >= effectiveEndTime) {
      return { left: 0, width: 0 };
    }

    const startOffsetMs = effectiveStartTime - windowStart.getTime();
    const durationMs = effectiveEndTime - effectiveStartTime;

    const left = (startOffsetMs / totalWindowDuration) * timelineWidth;
    const width = Math.max((durationMs / totalWindowDuration) * timelineWidth, 12); // Minimum 12px width

    return { left, width };
  }, [timelineWidth, totalWindowDuration, windowStart, windowEnd]);

  const getIncidentStyling = (type) => {
    switch (type) {
      case 'Unauthorised Access':
        return { 
          color: 'bg-red-500 border-red-400 hover:bg-red-400', 
          textColor: 'text-red-200'
        };
      case 'Gun Threat':
        return { 
          color: 'bg-orange-500 border-orange-400 hover:bg-orange-400', 
          textColor: 'text-orange-200'
        };
      case 'Face Recognised':
        return { 
          color: 'bg-blue-500 border-blue-400 hover:bg-blue-400', 
          textColor: 'text-blue-200'
        };
      case 'Traffic congestion':
        return { 
          color: 'bg-teal-500 border-teal-400 hover:bg-teal-400', 
          textColor: 'text-teal-200'
        };
      default:
        return { 
          color: 'bg-gray-500 border-gray-400 hover:bg-gray-400', 
          textColor: 'text-gray-200'
        };
    }
  };

  const handleTimelineClick = useCallback((e) => {
    if (!timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left - 160;
    const newPosition = Math.max(0, Math.min(clickX, timelineWidth));
    
    setScrubberPosition(newPosition);
    
    const timeOffset = (newPosition / timelineWidth) * totalWindowDuration;
    const seekTime = new Date(windowStart.getTime() + timeOffset);
    
    if (onTimelineSeek) {
      onTimelineSeek(seekTime);
    }
  }, [timelineWidth, totalWindowDuration, windowStart, onTimelineSeek]);

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    handleTimelineClick(e);
  }, [handleTimelineClick]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !timelineRef.current) return;
    handleTimelineClick(e);
  }, [isDragging, handleTimelineClick]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const timeMarkers = generateTimeMarkers();

  const handleIncidentClick = useCallback((incident) => {
    const incidentStartTime = new Date(incident.tsStart);
    const startOffsetMs = incidentStartTime.getTime() - windowStart.getTime();
    const newPosition = (startOffsetMs / totalWindowDuration) * timelineWidth;
    
    setScrubberPosition(Math.max(0, Math.min(newPosition, timelineWidth)));
    
    if (onTimelineSeek) {
      onTimelineSeek(incidentStartTime);
    }
  }, [windowStart, totalWindowDuration, timelineWidth, onTimelineSeek]);

  return (
    <div className="flex flex-col bg-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-700">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white">Incident Timeline</h3>
        <div className="flex items-center space-x-4 text-sm text-gray-300">
          <div className="text-xs text-gray-400">
            {windowStart.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })} - {windowEnd.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric' 
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="flex bg-gray-850 border-b border-gray-700">
          <div className="w-40 flex-shrink-0 p-3 text-xs text-gray-400 font-medium border-r border-gray-700 bg-gray-800">
            Camera List
          </div>
          <div 
            className="flex-1 relative h-16 bg-gray-900"
            style={{ minWidth: timelineWidth + 'px' }}
          >
            {timeMarkers.map((marker, index) => (
              <div
                key={index}
                className="absolute top-0 bottom-0 flex flex-col justify-center items-center text-xs text-gray-400"
                style={{ left: `${marker.position}px`, transform: 'translateX(100%)' }}
              >
                <div className="bg-gray-900 px-2 py-1 rounded border border-gray-700">
                  <div className="font-mono text-white text-center">{marker.time}</div>
                  <div className="text-xs text-gray-400 mt-0.5 text-center">
                    {marker.fullTime.split(', ')[0]}
                  </div>
                </div>
                <div className="absolute top-0 bottom-0 w-px bg-gray-600 opacity-50"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto timeline-scrollbar">
          {cameras.map((camera, index) => (
            <div key={camera.id} className="flex border-b border-gray-700 hover:bg-gray-800 transition-colors">
              <div className="w-40 flex-shrink-0 p-4 flex items-center space-x-2 border-r border-gray-700 bg-gray-850">
                <Camera className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div className="text-sm min-w-0">
                  <div className="text-white font-medium truncate">{camera.name}</div>
                  <div className="text-xs text-gray-400 truncate">{camera.location}</div>
                </div>
              </div>
              
              <div 
                ref={index === 0 ? timelineRef : null}
                className="flex-1 relative h-20 cursor-crosshair bg-gray-800"
                style={{ minWidth: timelineWidth + 'px' }}
                onMouseDown={handleMouseDown}
              >
                <div className="absolute inset-0">
                  {timeMarkers.map((marker, i) => (
                    <div
                      key={i}
                      className="absolute top-0 bottom-0 w-px bg-gray-600 opacity-30"
                      style={{ left: `${marker.position}px` }}
                    ></div>
                  ))}
                </div>
                
                {(incidentsByCamera[camera.id] || []).map((incident) => {
                  const { left, width } = calculateIncidentPosition(incident.tsStart, incident.tsEnd);
                  if (width === 0) return null;

                  const styling = getIncidentStyling(incident.type);
                  const isResolved = incident.resolved;
                  
                  return (
                    <div
                      key={incident.id}
                      className={`absolute top-3 bottom-3 rounded border-2 ${styling.color} ${
                        isResolved ? 'opacity-50' : 'opacity-90'
                      } hover:opacity-100 transition-all cursor-pointer shadow-lg z-10 transform hover:scale-105`}
                      style={{ left: `${left}px`, width: `${Math.max(width, 12)}px` }}
                      title={`${incident.type}\nStart: ${new Date(incident.tsStart).toLocaleString()}\nEnd: ${new Date(incident.tsEnd).toLocaleString()}${isResolved ? '\nStatus: Resolved' : '\nStatus: Active'}`}
                      onClick={() => handleIncidentClick(incident)}
                    >
                      <div className="flex items-center justify-center h-full px-2">
                        <div className="flex items-center space-x-1 text-white text-xs">
                          {styling.icon}
                          {width > 100 && (
                            <span className="font-medium truncate">
                              {incident.type}
                            </span>
                          )}
                        </div>
                      </div>
                      {isResolved && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                      )}
                    </div>
                  );
                })}

                <div
                  className={`absolute top-0 bottom-0 w-1 bg-white z-30 cursor-ew-resize shadow-xl transition-all ${
                    isDragging ? 'bg-blue-400 w-2' : 'hover:bg-gray-200'
                  }`}
                  style={{ left: `${scrubberPosition}px` }}
                >
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-3 bg-white border border-gray-400 rounded-sm"></div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-3 bg-white border border-gray-400 rounded-sm"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-800 border-t border-gray-700 text-xs text-gray-300">
        <div className="flex items-center space-x-4">
          <span>Drag the scrubber to navigate • Click incidents to jump to time</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span>Scrubber Position</span>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-2 bg-red-500 rounded-sm"></div>
            <span>Unauthorised Access</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-2 bg-orange-500 rounded-sm"></div>
            <span>Gun Threat</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-2 bg-blue-500 rounded-sm"></div>
            <span>Face Recognised</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-2 bg-teal-500 rounded-sm"></div>
            <span>Traffic Congestion</span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .timeline-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .timeline-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 4px;
        }
        .timeline-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 4px;
        }
        .timeline-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
        .bg-gray-850 {
          background-color: #1f2937;
        }
      `}</style>
    </div>
  );
}