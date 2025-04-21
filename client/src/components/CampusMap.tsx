import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Maximize2, Minimize2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Facility {
  id: number;
  name: string;
  category: string;
  location: string;
  coordinates: { x: number; y: number };
  description?: string;
  availability?: string;
  services?: string[];
  image?: string;
}

const campusFacilities: Facility[] = [
  {
    id: 1,
    name: "Main Library",
    category: "academic",
    location: "Central Campus",
    coordinates: { x: 35, y: 40 },
    description: "The main university library with study spaces, computer labs, and extensive book collections.",
    availability: "Open 7AM-10PM",
    services: ["Book borrowing", "Study rooms", "Computer access", "Printing services"]
  },
  {
    id: 2,
    name: "Science Building",
    category: "academic",
    location: "North Campus",
    coordinates: { x: 70, y: 25 },
    description: "Houses the departments of Biology, Chemistry, and Physics with specialized labs and lecture halls.",
    availability: "Open 8AM-6PM",
    services: ["Laboratories", "Lecture halls", "Research facilities"]
  },
  {
    id: 3,
    name: "Student Center",
    category: "services",
    location: "Central Campus",
    coordinates: { x: 40, y: 60 },
    description: "The hub for student activities, clubs, and services.",
    availability: "Open 7AM-9PM",
    services: ["Student union offices", "Meeting rooms", "Recreation areas", "Food court"]
  },
  {
    id: 4,
    name: "Sports Complex",
    category: "recreational",
    location: "East Campus",
    coordinates: { x: 85, y: 55 },
    description: "Comprehensive sports facilities including indoor and outdoor options.",
    availability: "Open 6AM-9PM",
    services: ["Gymnasium", "Football field", "Basketball courts", "Swimming pool", "Fitness center"]
  },
  {
    id: 5,
    name: "ICT Building",
    category: "academic",
    location: "South Campus",
    coordinates: { x: 55, y: 75 },
    description: "Modern facility housing computer labs, IT services, and technology classrooms.",
    availability: "Open 8AM-8PM",
    services: ["Computer labs", "Tech support", "Software training", "Media production studio"]
  },
  {
    id: 6,
    name: "Health Center",
    category: "services",
    location: "West Campus",
    coordinates: { x: 20, y: 50 },
    description: "Provides healthcare services to students and staff.",
    availability: "Open 8AM-5PM (24/7 emergency)",
    services: ["Medical consultations", "Mental health services", "Pharmacy", "First aid"]
  },
  {
    id: 7,
    name: "Administration Block",
    category: "services",
    location: "Central Campus",
    coordinates: { x: 45, y: 30 },
    description: "Houses university administration offices and services.",
    availability: "Open 8AM-5PM",
    services: ["Registrar", "Finance office", "Academic affairs", "Student affairs"]
  },
  {
    id: 8,
    name: "Cafeteria",
    category: "services",
    location: "Central Campus",
    coordinates: { x: 50, y: 55 },
    description: "Main dining facility serving a variety of food options.",
    availability: "Open 7AM-8PM",
    services: ["Breakfast, lunch, dinner", "Coffee shop", "Snack bar"]
  }
];

export default function CampusMap() {
  const { t } = useTranslation();
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFullMap, setShowFullMap] = useState(false);
  const [filteredCategory, setFilteredCategory] = useState<string | null>(null);

  const handleFacilityClick = (facility: Facility) => {
    setSelectedFacility(facility);
  };

  const filteredFacilities = campusFacilities.filter(facility => {
    const matchesSearch = 
      facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facility.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facility.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !filteredCategory || facility.category === filteredCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative">
      {/* Search and Filters */}
      <div className="mb-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder={t("Search facilities...")}
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex space-x-1">
          <Button 
            variant={filteredCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setFilteredCategory(null)}
            className="whitespace-nowrap"
          >
            {t("All")}
          </Button>
          <Button 
            variant={filteredCategory === "academic" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilteredCategory("academic")}
            className="whitespace-nowrap"
          >
            {t("Academic")}
          </Button>
          <Button 
            variant={filteredCategory === "services" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilteredCategory("services")}
            className="whitespace-nowrap"
          >
            {t("Services")}
          </Button>
          <Button 
            variant={filteredCategory === "recreational" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilteredCategory("recreational")}
            className="whitespace-nowrap"
          >
            {t("Recreational")}
          </Button>
        </div>
      </div>

      {/* Campus Map */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold">{t("University of Rwanda Campus Map")}</h3>
          <Button variant="ghost" size="sm" onClick={() => setShowFullMap(true)}>
            <Maximize2 className="h-4 w-4 mr-1" /> {t("Expand")}
          </Button>
        </div>
        
        <div className="relative" style={{ height: "400px", backgroundImage: "url('https://via.placeholder.com/1200x900/e2e8f0/94a3b8?text=Campus+Map')", backgroundSize: "cover", backgroundPosition: "center" }}>
          {/* This is a placeholder for the campus map. In a real implementation, this would be a proper map */}
          {filteredFacilities.map(facility => (
            <div 
              key={facility.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{ left: `${facility.coordinates.x}%`, top: `${facility.coordinates.y}%` }}
              onClick={() => handleFacilityClick(facility)}
            >
              <div className={`
                w-3 h-3 rounded-full animate-pulse
                ${facility.category === 'academic' ? 'bg-blue-500' : 
                  facility.category === 'services' ? 'bg-green-500' : 
                  'bg-yellow-500'}
              `}></div>
              <div 
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-white text-xs rounded shadow whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
              >
                {facility.name}
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t">
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span>{t("Academic")}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span>{t("Services")}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <span>{t("Recreational")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Facility List */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredFacilities.map(facility => (
          <div 
            key={facility.id} 
            className="bg-white border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleFacilityClick(facility)}
          >
            <div className="h-32 bg-gray-200 flex items-center justify-center">
              {/* Placeholder image, would be replaced with actual facility images */}
              <div className="text-gray-400 text-sm">{facility.name} Image</div>
            </div>
            <div className="p-4">
              <h4 className="font-semibold">{facility.name}</h4>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                <span>{facility.location}</span>
              </div>
              <div className="mt-2 text-xs text-gray-700 line-clamp-2">
                {facility.description}
              </div>
              <div className="mt-2 text-xs text-gray-600">
                {facility.availability}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Facility Details Dialog */}
      <Dialog open={!!selectedFacility} onOpenChange={(open) => !open && setSelectedFacility(null)}>
        <DialogContent className="sm:max-w-[550px]">
          {selectedFacility && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedFacility.name}</DialogTitle>
                <DialogDescription>
                  <div className="flex items-center text-sm mt-1">
                    <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span>{selectedFacility.location}</span>
                  </div>
                </DialogDescription>
              </DialogHeader>
              
              <div className="h-48 bg-gray-200 flex items-center justify-center rounded-md">
                {/* Placeholder image, would be replaced with actual facility images */}
                <div className="text-gray-400">{selectedFacility.name} Image</div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium">{t("Description")}</h4>
                  <p className="text-sm text-gray-700 mt-1">{selectedFacility.description}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium">{t("Availability")}</h4>
                  <p className="text-sm text-gray-700 mt-1">{selectedFacility.availability}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium">{t("Services")}</h4>
                  <ul className="text-sm text-gray-700 mt-1 list-disc pl-5">
                    {selectedFacility.services?.map((service, index) => (
                      <li key={index}>{service}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline">
                    {t("View Schedule")}
                  </Button>
                  <Button>
                    {t("Book Facility")}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Fullscreen Map Dialog */}
      <Dialog open={showFullMap} onOpenChange={setShowFullMap}>
        <DialogContent className="sm:max-w-[90vw] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>{t("University of Rwanda Campus Map")}</span>
              <Button variant="ghost" size="sm" onClick={() => setShowFullMap(false)}>
                <Minimize2 className="h-4 w-4 mr-1" /> {t("Minimize")}
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {/* Full screen map content */}
          <div className="relative" style={{ height: "70vh", backgroundImage: "url('https://via.placeholder.com/1200x900/e2e8f0/94a3b8?text=Campus+Map')", backgroundSize: "cover", backgroundPosition: "center" }}>
            {campusFacilities.map(facility => (
              <div 
                key={facility.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ left: `${facility.coordinates.x}%`, top: `${facility.coordinates.y}%` }}
                onClick={() => handleFacilityClick(facility)}
              >
                <div className={`
                  w-4 h-4 rounded-full animate-pulse
                  ${facility.category === 'academic' ? 'bg-blue-500' : 
                    facility.category === 'services' ? 'bg-green-500' : 
                    'bg-yellow-500'}
                `}></div>
                <div 
                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-white text-xs font-medium rounded shadow whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  {facility.name}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex items-center space-x-6 text-sm mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span>{t("Academic")}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span>{t("Services")}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <span>{t("Recreational")}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}