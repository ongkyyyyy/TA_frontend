/* eslint-disable react/prop-types */
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table"
import { Button } from "../../ui/button"
import { Edit, Trash2, ExternalLink } from "lucide-react"
import { Card, CardContent } from "../../ui/card"
import { Skeleton } from "../../ui/skeleton"

export default function HotelsList({ hotels, isLoading, onEdit, onDelete }) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex flex-col gap-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (hotels.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground py-8">No hotels found. Add a new hotel to get started.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hotel Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Booking Links</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hotels.map((hotel) => (
              <TableRow key={hotel._id}>
                <TableCell className="font-medium">{hotel.hotel_name}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{hotel.address}</span>
                    <span className="text-sm text-muted-foreground">
                      {hotel.city}, {hotel.country}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {hotel.agoda_link && (
                      <a
                        href={hotel.agoda_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Agoda
                      </a>
                    )}
                    {hotel.traveloka_link && (
                      <a
                        href={hotel.traveloka_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-800 hover:bg-orange-200"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Traveloka
                      </a>
                    )}
                    {hotel.tripcom_link && (
                      <a
                        href={hotel.tripcom_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800 hover:bg-purple-200"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Trip.com
                      </a>
                    )}
                    {hotel.ticketcom_link && (
                      <a
                        href={hotel.ticketcom_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 hover:bg-green-200"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Tiket.com
                      </a>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(hotel)} className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(hotel)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
