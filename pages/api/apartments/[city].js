const axios = require('axios').default;
const redis = require('../../../src/clients').redis

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const API_KEY_ENC = process.env.NEXT_PUBLIC_API_KEY_ENC
const API_KEY_DEC = process.env.NEXT_PUBLIC_API_KEY_DEC

async function fetchApartments(cityCode) {
  let apartments = JSON.parse(await redis.hgetAsync('apartments', cityCode))

  if (apartments !== null)
    return apartments

  apartments = {}
  for (let page = 1; ; ++page) {
    const {data: {data: apartmentsRes}} = await axios.get(`${API_BASE_URL}/getAptlist`, {
      params: {
        'ServiceKey': API_KEY_DEC,
        'type': 'json',
        cityCode,
        page,
      }
    })
    if (apartmentsRes.list === null || apartmentsRes.list.length == 0)
      break;
    for (const apartment of apartmentsRes.list)
      apartments[apartment.aptCode] = apartment
  }

  for (let page = 1; ; ++page) {
    const {data: {data: apartmentDetailsRes}} = await axios.get(`${API_BASE_URL}/getAptLocInfoList`, {
      params: {
        'ServiceKey': API_KEY_DEC,
        'type': 'json',
        cityCode,
        page,
      }
    })
    if (apartmentDetailsRes.list === null || apartmentDetailsRes.list.length == 0)
      break;
    for (const apartmentDetail of apartmentDetailsRes.list) {
      apartments[apartmentDetail.aptCode] = {
        ...apartments[apartmentDetail.aptCode],
        ...apartmentDetail
      }
    }
  }
  return apartments
}

export default async (req, res) => {
  const cityCode = req.query.city
  return res.status(200).json(await fetchApartments(cityCode))
}

module.exports.fetchApartments = fetchApartments
