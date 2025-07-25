import Image from 'next/image';
import { PlayIcon, CircleStopIcon, FastForwardIcon, RewindIcon, RepeatIcon } from 'lucide-react'; 

export default function IncidentPlayer({ mainCameraId, currentIncident }) {
 
  const mainVideoSrc = currentIncident?.thumbnailUrl || '/placeholders/main_video_placeholder.mp4';
  const mainVideoAlt = currentIncident ? `Incident ${currentIncident.id}` : "Main Incident View";

  
  const miniThumbnails = [
    { id: 'camera-02', src: '/thumbnails/face_recognised_2.jpg', alt: 'Camera 02' },
    { id: 'camera-03', src: '/thumbnails/unauthorised_access_1.jpg', alt: 'Camera 03' },
  ];

  return (
    <div className="flex flex-col bg-gray-800 p-4 rounded-lg shadow-md h-full">
      
      <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden rounded-md">
        <Image
          src={mainVideoSrc}
          alt={mainVideoAlt}
          layout="fill"
          objectFit="cover"
          className="rounded-md"
        />
        <div className="absolute bottom-2 left-2 bg-gray-900 bg-opacity-75 text-white text-sm px-2 py-1 rounded">
          {`Camera - ${mainCameraId ? mainCameraId : '01'}`}
        </div>
      </div>

      <div className="flex justify-center space-x-2 mt-4">
        {miniThumbnails.map((thumb) => (
          <div key={thumb.id} className="relative w-32 h-20 bg-gray-700 rounded-md overflow-hidden border-2 border-transparent hover:border-blue-500 cursor-pointer">
            <Image
              src={thumb.src}
              alt={thumb.alt}
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
            <div className="absolute bottom-1 left-1 bg-gray-900 bg-opacity-75 text-white text-xs px-1 rounded">
              {thumb.alt}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center space-x-4 mt-6 bg-gray-700 p-3 rounded-md">
        <button className="p-2 rounded-full hover:bg-gray-600 transition-colors">
          <RewindIcon className="h-6 w-6 text-gray-300" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-600 transition-colors">
          <PlayIcon className="h-8 w-8 text-blue-400" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-600 transition-colors">
          <CircleStopIcon className="h-6 w-6 text-gray-300" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-600 transition-colors">
          <FastForwardIcon className="h-6 w-6 text-gray-300" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-600 transition-colors">
          <RepeatIcon className="h-6 w-6 text-gray-300" />
        </button>
        <div className="text-sm text-gray-400 ml-4">03:12:37 (15-Jun-2025)</div> {/* Placeholder timestamp */}
      </div>
    </div>
  );
}