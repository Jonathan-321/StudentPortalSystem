import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Calendar } from "@/components/ui/calendar";
import { addDays, format, isBefore, isToday, startOfDay } from "date-fns";
import { CalendarIcon, Check, Clock, Users } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface TimeSlot {
  id: string;
  start: string;
  end: string;
  available: boolean;
}

interface Facility {
  id: number;
  name: string;
  type: string;
  capacity: number;
  image?: string;
  features: string[];
  timeSlots: TimeSlot[];
}

const facilities: Facility[] = [
  {
    id: 1,
    name: "Small Meeting Room (SCI-101)",
    type: "meeting",
    capacity: 10,
    features: ["Projector", "Whiteboard", "Air conditioning"],
    timeSlots: [
      { id: "1-1", start: "08:00", end: "10:00", available: true },
      { id: "1-2", start: "10:00", end: "12:00", available: false },
      { id: "1-3", start: "12:00", end: "14:00", available: true },
      { id: "1-4", start: "14:00", end: "16:00", available: true },
      { id: "1-5", start: "16:00", end: "18:00", available: false },
    ]
  },
  {
    id: 2,
    name: "Conference Room (ADM-201)",
    type: "conference",
    capacity: 30,
    features: ["Video conferencing", "Sound system", "Smart board", "Air conditioning"],
    timeSlots: [
      { id: "2-1", start: "08:00", end: "10:00", available: false },
      { id: "2-2", start: "10:00", end: "12:00", available: true },
      { id: "2-3", start: "12:00", end: "14:00", available: true },
      { id: "2-4", start: "14:00", end: "16:00", available: false },
      { id: "2-5", start: "16:00", end: "18:00", available: true },
    ]
  },
  {
    id: 3,
    name: "Computer Lab (ICT-301)",
    type: "lab",
    capacity: 25,
    features: ["25 Workstations", "Instructor console", "Specialized software", "Printing services"],
    timeSlots: [
      { id: "3-1", start: "08:00", end: "10:00", available: true },
      { id: "3-2", start: "10:00", end: "12:00", available: true },
      { id: "3-3", start: "12:00", end: "14:00", available: false },
      { id: "3-4", start: "14:00", end: "16:00", available: false },
      { id: "3-5", start: "16:00", end: "18:00", available: true },
    ]
  },
  {
    id: 4,
    name: "Auditorium (MAIN-101)",
    type: "auditorium",
    capacity: 200,
    features: ["Stage", "Advanced AV system", "Tiered seating", "Backstage area"],
    timeSlots: [
      { id: "4-1", start: "08:00", end: "11:00", available: false },
      { id: "4-2", start: "11:00", end: "14:00", available: true },
      { id: "4-3", start: "14:00", end: "17:00", available: false },
      { id: "4-4", start: "17:00", end: "20:00", available: true },
    ]
  },
  {
    id: 5,
    name: "Study Room (LIB-202)",
    type: "study",
    capacity: 6,
    features: ["Quiet space", "Whiteboard", "Power outlets", "Wi-Fi"],
    timeSlots: [
      { id: "5-1", start: "08:00", end: "10:00", available: true },
      { id: "5-2", start: "10:00", end: "12:00", available: true },
      { id: "5-3", start: "12:00", end: "14:00", available: true },
      { id: "5-4", start: "14:00", end: "16:00", available: false },
      { id: "5-5", start: "16:00", end: "18:00", available: true },
      { id: "5-6", start: "18:00", end: "20:00", available: true },
    ]
  },
  {
    id: 6,
    name: "Multipurpose Hall (STU-101)",
    type: "hall",
    capacity: 100,
    features: ["Flexible setup", "Sound system", "Projection screens", "Kitchenette"],
    timeSlots: [
      { id: "6-1", start: "08:00", end: "11:00", available: true },
      { id: "6-2", start: "11:00", end: "14:00", available: false },
      { id: "6-3", start: "14:00", end: "17:00", available: true },
      { id: "6-4", start: "17:00", end: "20:00", available: true },
    ]
  }
];

interface BookingFormData {
  facility: number | null;
  date: Date | null;
  timeSlot: string | null;
  purpose: string;
  attendees: number;
}

export default function FacilityBooking() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [bookingData, setBookingData] = useState<BookingFormData>({
    facility: null,
    date: null,
    timeSlot: null,
    purpose: "",
    attendees: 1
  });

  // Existing bookings for the user (would come from an API)
  const userBookings = [
    {
      id: 1001,
      facilityName: "Conference Room (ADM-201)",
      date: "2023-10-15",
      startTime: "10:00",
      endTime: "12:00",
      purpose: "Project meeting",
      attendees: 15,
      status: "confirmed"
    },
    {
      id: 1002,
      facilityName: "Computer Lab (ICT-301)",
      date: "2023-10-18",
      startTime: "14:00",
      endTime: "16:00",
      purpose: "Software training session",
      attendees: 20,
      status: "pending"
    }
  ];

  const filteredFacilities = facilities.filter(facility => {
    if (activeTab === "all") return true;
    return facility.type === activeTab;
  });

  const handleBookNow = (facility: Facility) => {
    setSelectedFacility(facility);
    setBookingData({
      ...bookingData,
      facility: facility.id
    });
    setShowBookingForm(true);
  };

  const handleBookingSubmit = () => {
    // Validate form
    if (!bookingData.facility || !bookingData.date || !bookingData.timeSlot || !bookingData.purpose) {
      toast({
        title: t("Incomplete Form"),
        description: t("Please fill in all required fields"),
        variant: "destructive"
      });
      return;
    }

    // Submit booking (would be an API call in a real app)
    toast({
      title: t("Booking Submitted"),
      description: t("Your booking request has been submitted for approval"),
      action: (
        <div className="h-8 w-8 bg-green-50 rounded-full flex items-center justify-center">
          <Check className="h-4 w-4 text-green-600" />
        </div>
      )
    });

    // Reset form and close dialog
    setBookingData({
      facility: null,
      date: null,
      timeSlot: null,
      purpose: "",
      attendees: 1
    });
    setShowBookingForm(false);
  };

  const handleCancelBooking = (bookingId: number) => {
    // Would be an API call in a real app
    toast({
      title: t("Booking Cancelled"),
      description: t("Your booking has been cancelled successfully")
    });
  };

  const getAvailableTimeSlots = () => {
    if (!selectedFacility) return [];
    return selectedFacility.timeSlots.filter(slot => slot.available);
  };

  return (
    <div>
      {/* Facility Booking Tabs */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 mb-6">
          <TabsTrigger value="all">{t("All Facilities")}</TabsTrigger>
          <TabsTrigger value="meeting">{t("Meeting Rooms")}</TabsTrigger>
          <TabsTrigger value="conference">{t("Conference Halls")}</TabsTrigger>
          <TabsTrigger value="lab">{t("Labs")}</TabsTrigger>
          <TabsTrigger value="study">{t("Study Rooms")}</TabsTrigger>
          <TabsTrigger value="auditorium">{t("Auditoriums")}</TabsTrigger>
          <TabsTrigger value="hall">{t("Multipurpose Halls")}</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFacilities.map(facility => (
              <Card key={facility.id} className="overflow-hidden">
                <div className="h-40 bg-gray-200 flex items-center justify-center">
                  {/* Placeholder image, would be replaced with actual facility images */}
                  <div className="text-gray-400">{facility.name} Image</div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{facility.name}</CardTitle>
                  <CardDescription className="flex items-center">
                    <Users className="h-4 w-4 mr-1" /> 
                    {t("Capacity")}: {facility.capacity} {t("people")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <h4 className="text-sm font-medium mb-1">{t("Features")}:</h4>
                  <ul className="text-sm text-gray-700 list-disc pl-5">
                    {facility.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleBookNow(facility)} className="w-full">
                    {t("Book Now")}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Your Bookings */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">{t("Your Bookings")}</h3>
        
        {userBookings.length > 0 ? (
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("Facility")}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("Date & Time")}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("Purpose")}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("Status")}
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("Actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{booking.facilityName}</div>
                        <div className="text-xs text-gray-500">{t("Attendees")}: {booking.attendees}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{format(new Date(booking.date), "PPP")}</div>
                        <div className="text-xs text-gray-500">{booking.startTime} - {booking.endTime}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.purpose}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${booking.status === "confirmed" ? "bg-green-100 text-green-800" : 
                            booking.status === "pending" ? "bg-yellow-100 text-yellow-800" : 
                            "bg-red-100 text-red-800"}`
                        }>
                          {booking.status === "confirmed" ? t("Confirmed") : 
                           booking.status === "pending" ? t("Pending") : 
                           t("Cancelled")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          {t("Cancel")}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white border rounded-lg p-8 text-center">
            <p className="text-gray-500">{t("You don't have any bookings yet")}</p>
            <Button className="mt-4" onClick={() => setActiveTab("all")}>
              {t("Book a Facility")}
            </Button>
          </div>
        )}
      </div>

      {/* Booking Form Dialog */}
      <Dialog open={showBookingForm} onOpenChange={setShowBookingForm}>
        <DialogContent className="sm:max-w-[550px]">
          {selectedFacility && (
            <>
              <DialogHeader>
                <DialogTitle>{t("Book Facility")}</DialogTitle>
                <DialogDescription>
                  {selectedFacility.name}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="booking-date">{t("Date")}</Label>
                  <div className="border rounded-md p-4">
                    <Calendar
                      mode="single"
                      selected={bookingData.date || undefined}
                      onSelect={(date) => setBookingData({...bookingData, date})}
                      disabled={(date) => isBefore(date, startOfDay(new Date())) && !isToday(date) || isBefore(addDays(new Date(), 30), date)}
                      initialFocus
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>{t("Available Time Slots")}</Label>
                  {bookingData.date ? (
                    <RadioGroup 
                      value={bookingData.timeSlot || ""} 
                      onValueChange={(value) => setBookingData({...bookingData, timeSlot: value})}
                      className="space-y-2"
                    >
                      {getAvailableTimeSlots().map((slot) => (
                        <div key={slot.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={slot.id} id={slot.id} />
                          <Label htmlFor={slot.id} className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-gray-500" />
                            {slot.start} - {slot.end}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  ) : (
                    <p className="text-sm text-gray-500">{t("Please select a date first")}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="purpose">{t("Purpose of Booking")}</Label>
                  <Input
                    id="purpose"
                    value={bookingData.purpose}
                    onChange={(e) => setBookingData({...bookingData, purpose: e.target.value})}
                    placeholder={t("Brief description of your booking purpose")}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="attendees">{t("Number of Attendees")}</Label>
                  <Input
                    id="attendees"
                    type="number"
                    min={1}
                    max={selectedFacility.capacity}
                    value={bookingData.attendees}
                    onChange={(e) => setBookingData({...bookingData, attendees: parseInt(e.target.value) || 1})}
                  />
                  <p className="text-xs text-gray-500">
                    {t("Maximum capacity")}: {selectedFacility.capacity}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowBookingForm(false)}>
                  {t("Cancel")}
                </Button>
                <Button onClick={handleBookingSubmit}>
                  {t("Submit Booking")}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}