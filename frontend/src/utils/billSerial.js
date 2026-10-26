import api from '../api'

const INV_PREFIX = 'BTC/26-27/'
const SERIAL_STORAGE_KEY = 'btc_last_serial'

export const getNextSerialNumber = async () => {
  const response = await api.get('/api/bills/next-number')
  const billNumber = String(response.data?.bill_no || '')
  const prefix = INV_PREFIX.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = billNumber.match(new RegExp(`^${prefix}(\\d+)$`))

  if (!match) {
    throw new Error('Server returned an invalid bill number.')
  }

  const serial = Number(match[1])

  if (!Number.isSafeInteger(serial) || serial < 1) {
    throw new Error('Server returned an invalid bill serial number.')
  }

  return `${INV_PREFIX}${serial}`
}

export const updateBillSerial = (billNumber) => {
  const prefix = INV_PREFIX.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = String(billNumber).match(
    new RegExp(`^${prefix}(\\d+)$`)
  )

  if (!match) {
    console.warn('Invalid bill number format:', billNumber)
    return
  }

  try {
    localStorage.setItem(SERIAL_STORAGE_KEY, match[1])
  } catch (error) {
    console.warn('Unable to update local bill serial:', error)
  }
}
