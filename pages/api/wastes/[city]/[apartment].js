const axios = require('axios').default;
const redis = require('../../../../src/clients').redis

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const API_KEY_ENC = process.env.NEXT_PUBLIC_API_KEY_ENC
const API_KEY_DEC = process.env.NEXT_PUBLIC_API_KEY_DEC
const fetchApartments = require('../../apartments/[city]').fetchApartments

async function fetchApartmentWastes(disYear, disMonth, cityCode, aptCode) {
  let wastes = JSON.parse(await redis.hgetAsync('apartment_wastes', aptCode))

  if (wastes !== null)
    return {[aptCode]: wastes}

  wastes = []
  for (let page = 1; ; ++page) {
    try {
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
      if (wastesRes.list === null || wastesRes.list.length == 0)
        break
      wastes.push(...wastesRes.list)
    } catch (err) {
      console.log(err.response.data)
      break
    }
  }
  wastes.sort((a, b) => b.disDate - a.disDate)
  await redis.hmsetAsync('apartment_wastes', aptCode, JSON.stringify(wastes))

  return {[aptCode]: wastes}
}

async function fetchAllApartmentsWastes(disYear, disMonth, cityCode) {
  return Promise.all(
    Object.keys(await fetchApartments(cityCode))
    .flatMap(async (aptCode) => (await fetchApartmentWastes(disYear, disMonth, cityCode, aptCode)))
  )
}

async function fetchApartmentWasteOfMonth(disYear, disMonth, cityCode, aptCode) {
  const wastes = (await fetchApartmentWastes(disYear, disMonth, cityCode, aptCode))[aptCode]

  return {
    [aptCode]: wastes.slice(1).reduce((a, b, idx, wastes) => ({
      ...a,
      disQuantity: a.disQuantity + b.disQuantity,
      disQuantityRate: a.disQuantityRate * (wastes.length - 1) / wastes.length + b.disQuantityRate / wastes.length,
      disCount: a.disCount + b.disCount,
      disCountRate: a.disCountRate * (wastes.length - 1) / wastes.length + b.disCountRate / wastes.length
    }), wastes[0])
    || []
  }
}

export default async (req, res) => {
  const date = new Date()
  const year = String(req.query.year || date.getFullYear()).padStart(4, '0')
  const month = String(req.query.month || date.getMonth() + 1).padStart(2, '0')
  const total = Boolean(req.query.total || false)
  const city = req.query.city
  const apartment = req.query.apartment
  if (apartment === 'all')
    return res.status(200).json(
      await fetchAllApartmentsWastes(year, month, city)
    )
  else
    return res.status(200).json(
      total ? (await fetchApartmentWasteOfMonth(year, month, city, apartment))
      : (await fetchApartmentWastes(year, month, city, apartment))
    )
}
