import React, { useEffect, useState } from 'react';
import { Book, FileText, Video, Download } from 'lucide-react';

const ResourceLibrary = () => {
  
  const [resources] = useState([
    {
      id: 1,
      title: "Endometriosis Management Guide",
      type: "PDF Guide",
      description: "Comprehensive guide on managing endometriosis through lifestyle adjustments, exercise, and dietary changes.",
      downloadUrl: "#",
      imageUrl: "src/pages/images/1.jpg",  // Local image path
      category: "Wellness"
    },
    {
      id: 2,
      title: "Mindful Exercise for Endometriosis",
      type: "Video",
      description: "A video series on gentle exercise routines designed to alleviate symptoms and improve overall well-being.",
      downloadUrl: "#",
      imageUrl: "src/pages/images/2.jpg",  // Local image path
      category: "Exercise"
    },
    {
      id: 3,
      title: "Nutritional Tips for Endometriosis",
      type: "PDF Guide",
      description: "Insights and nutritional advice to support a balanced diet tailored for managing endometriosis symptoms.",
      downloadUrl: "#",
      imageUrl: "src/pages/images/3.jpg",  // Local image path
      category: "Nutrition"
    },
    {
      id: 4,
      title: "Self-Care Strategies",
      type: "PDF Guide",
      description: "A guide on holistic self-care practices to support mental and physical health while managing endometriosis.",
      downloadUrl: "#",
      imageUrl: "src/pages/images/4.jpg",  // Local image path
      category: "Self-Care"
    }
  ]);

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf guide':
        return Book;
      case 'video':
        return Video;
      default:
        return FileText;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Endometriosis Resource Library</h1>
        <p className="text-gray-600">Explore resources designed to help manage and understand endometriosis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => {
          const IconComponent = getIcon(resource.type);
          
          return (
            <div 
              key={resource.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={resource.imageUrl}
                  alt={resource.title}
                  className="w-full h-48 object-cover"
                />
                <span className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm font-medium">
                  {resource.category}
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <IconComponent className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-blue-500 font-medium">{resource.type}</span>
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
                <p className="text-gray-600 mb-6 line-clamp-2">
                  {resource.description}
                </p>

                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download Resource
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResourceLibrary;
