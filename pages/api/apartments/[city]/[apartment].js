const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const API_KEY_ENC = process.env.NEXT_PUBLIC_API_KEY_ENC
const API_KEY_DEC = process.env.NEXT_PUBLIC_API_KEY_DEC
const fetchApartmentsByCity = require('../[city]').fetchApartmentsByCity

async function fetchApartment(cityCode, aptCode) {
  return (await fetchApartmentsByCity(cityCode))[aptCode] || null
}

export default async (req, res) => {
  const cityCode = req.query.city
  const aptCode = req.query.apartment
  return res.status(200).json(await fetchApartment(cityCode, aptCode))
}
