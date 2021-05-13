const axios = require('axios').default;
const redis = require('../../../src/clients').redis
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const API_KEY_ENC = process.env.NEXT_PUBLIC_API_KEY_ENC
const API_KEY_DEC = process.env.NEXT_PUBLIC_API_KEY_DEC

async function fetchCityWastes(disYear, disMonth, cityCode) {
  const wastes = JSON.parse(await redis.hgetAsync('city_wastes', cityCode)) || []

  if (wastes.length > 0)
    return {[cityCode]: wastes}

  for (let page = 1; ; ++page) {
    const {data: {data: wastesRes}} = await axios.get(`${API_BASE_URL}/getCityDateList`, {
      params: {
        'ServiceKey': API_KEY_DEC,
        'type': 'json',
        disYear,
        disMonth,
        cityCode,
        page,
      }
    })
    if (wastesRes.list === null || wastesRes.list.length == 0)
      break;
    wastes.push(...wastesRes.list)
  }
  wastes.sort((a, b) => b.disDate - a.disDate)
  await redis.hmsetAsync('city_wastes', cityCode, JSON.stringify(wastes))

  return {[cityCode]: wastes}
}

async function fetchCityWasteOfMonth(disYear, disMonth, cityCode, aptCode) {
  const wastes = (await fetchCityWastes(disYear, disMonth, cityCode, aptCode))[cityCode]

  return {
    [cityCode]: wastes.slice(1).reduce((a, b, idx, wastes) => ({
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
  const wastes = total ? (await fetchCityWasteOfMonth(year, month, city))
    : (await fetchCityWastes(year, month, city))

  return res.status(200).json(wastes)
}
