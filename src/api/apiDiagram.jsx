import useAxios from './index.jsx';

export const getDiagram = async (hotelIds, year) => {
  try {
    const token = localStorage.getItem("token")

    const hotelIdParam = Array.isArray(hotelIds) ? hotelIds.join(",") : hotelIds

    const params = {
      ...(hotelIdParam !== "All" && { hotel_id: hotelIdParam }),
      year,
    }

    console.log("Fetching diagram with params:", params)

    const response = await useAxios.get(`/diagram/revenue-sentiment`, {
      params,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data
  } catch (error) {
    console.error("Error fetching diagram data:", error)
    throw error
  }
}


