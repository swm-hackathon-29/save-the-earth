const axios = require('axios').default;
const redis = require('../../../src/clients').redis
const KNN = require('ml-knn')
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const API_KEY_ENC = process.env.NEXT_PUBLIC_API_KEY_ENC
const API_KEY_DEC = process.env.NEXT_PUBLIC_API_KEY_DEC

async function fetchApartmentsByCity(cityCode) {
  let apartments = JSON.parse(await redis.hgetAsync('apartments', cityCode))

  if (apartments !== null)
    return apartments

  apartments = {}
  for (let page = 1; ; ++page) {
    try {
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
    } catch (err) {
      console.log(err.response?.data)
      break
    }
  }

  for (let page = 1; ; ++page) {
    try {
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
        const latitude = Number(apartmentDetail.ylatlng || -1) 
        const longtitude = Number(apartmentDetail.xlatlng || -1)
        delete apartmentDetail.ylatlng
        delete apartmentDetail.xlatlng
        apartments[apartmentDetail.aptCode] = {
          ...apartments[apartmentDetail.aptCode],
          ...apartmentDetail,
          latitude,
          longtitude
        }
      }
    } catch (err) {
      console.log(err.response?.data)
      break
    }
  }

  const apartmentList = Object.values(apartments)
  const coordinatedApartments = apartmentList.filter((apartment) => apartment.latitude >= 0 && apartment.longtitude >= 0)
  const meanCoords = coordinatedApartments
    .reduce((sumCoords, apartment) => [sumCoords[0] + apartment.latitude, sumCoords[1] + apartment.longtitude], [0, 0])
    .map((sumCoord) => sumCoord / coordinatedApartments.length)
  for (const apartment of apartmentList.filter((apartment) => apartment.latitude < 0 || apartment.longtitude < 0)) {
    apartment.latitude = meanCoords[0]
    apartment.longtitude = meanCoords[1]
  }
  
  redis.hmsetAsync('apartments', cityCode, JSON.stringify(apartments))
  return apartments
}

export default async (req, res) => {
  const cityCode = req.query.city
  return res.status(200).json(await fetchApartmentsByCity(cityCode))
}

module.exports.fetchApartmentsByCity = fetchApartmentsByCity
