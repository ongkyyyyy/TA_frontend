import agodaLogo from "@/assets/images/OTA/agoda.png"
import travelokaLogo from "@/assets/images/OTA/traveloka.png"
import tripcomLogo from "@/assets/images/OTA/tripcom.png"
import ticketcomLogo from "@/assets/images/OTA/ticketcom.png"

export default function ScrapeSources() {
  const sources = {
    traveloka: {
      name: "Traveloka",
      logo: (
        <img
          src={travelokaLogo}
          alt="Traveloka Logo"
          className="h-6 w-6 object-contain"
        />
      ),
      color: "bg-blue-100 text-blue-700 border-blue-200",
      activeColor: "bg-blue-600",
    },
    ticketcom: {
      name: "Tiket.com",
      logo: (
        <img
          src={ticketcomLogo}
          alt="Tiket.com Logo"
          className="h-6 w-6 object-contain"
        />
      ),
      color: "bg-sky-100 text-sky-700 border-sky-200",
      activeColor: "bg-sky-600",
    },
    agoda: {
      name: "Agoda",
      logo: (
        <img
          src={agodaLogo}
          alt="Agoda Logo"
          className="h-6 w-6 object-contain"
        />
      ),
      color: "bg-purple-100 text-purple-700 border-purple-200",
      activeColor: "bg-purple-600",
    },
    tripcom: {
      name: "Trip.com",
      logo: (
        <img
          src={tripcomLogo}
          alt="Trip.com Logo"
          className="h-6 w-6 object-contain"
        />
      ),
      color: "bg-green-100 text-green-700 border-green-200",
      activeColor: "bg-green-700",
    },
  }

  return sources
}
