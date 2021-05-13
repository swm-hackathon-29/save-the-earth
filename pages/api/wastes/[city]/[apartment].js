const axios = require('axios').default;
const redis = require('../../../../src/clients').redis

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const API_KEY_ENC = process.env.NEXT_PUBLIC_API_KEY_ENC
const API_KEY_DEC = process.env.NEXT_PUBLIC_API_KEY_DEC

async function fetchApartmentWastes(disYear, disMonth, cityCode, aptCode) {
  const wastes = []

  for (let page = 1; ; ++page) {
    const {data: {data: wastesRes}} = await axios.get(`${API_BASE_URL}/getCityAptDateList`, {
      params: {
        'ServiceKey': API_KEY_DEC,
        'type': 'json',
        disYear,
        disMonth,
        cityCode,
        aptCode,
        page,
      }
    })
    console.log(wastesRes)
    if (wastesRes.list === null || wastesRes.list.length == 0)
      break;
    wastes.push(...wastesRes.list)
  }
  return wastes.sort((a, b) => b.disDate - a.disDate)
}

export default async (req, res) => {
  const date = new Date()
  const year = String(req.query.year || date.getFullYear()).padStart(4, '0')
  const month = String(req.query.month || date.getMonth() + 1).padStart(2, '0')
  const city = req.query.city
  const apartment = req.query.apartment
  const wastes = await fetchApartmentWastes(
    year,
    month,
    city,
    apartment
  )
  return res.status(200).json(wastes)
}
