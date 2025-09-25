import axios from "axios"


export async function getCountryCode(ip) {
  const response = await axios.get(`https://ipapi.co/${ip}/json/`)

  return response.data
}
