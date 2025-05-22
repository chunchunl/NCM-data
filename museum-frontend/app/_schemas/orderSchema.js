import { z } from 'zod'

export const OrderSchema = z
  .object({
    name: z.string().min(1, '請填寫姓名'),
    email: z.string().email('Email 格式錯誤'),
    phone: z.string().min(8, '請填寫電話'),
    shippingMethod: z.enum(['宅配', '超商']),
    city: z.string().min(1, '請填寫城市'),
    district: z.string().min(1, '請選擇區域'),
    address: z.string().min(1, '請填寫地址'),
    paymentMethod: z.enum(['credit', 'linepay']),
    cardNumber: z.string().optional(),
    cardExpiry: z.string().optional(),
    cardCVC: z.string().optional(),
    cardHolder: z.string().optional(),
  })
  .refine(
    (data) => {
      // 當付款方式為信用卡時，必填這四個欄位
      if (data.paymentMethod === 'credit') {
        return (
          data.cardNumber?.trim() &&
          data.cardExpiry?.trim() &&
          data.cardCVC?.trim() &&
          data.cardHolder?.trim()
        )
      }
      return true // 若為 linepay，不檢查卡號
    },
    {
      message: '請填寫完整信用卡資訊',
      path: ['cardNumber'], // 指定錯誤對應的欄位，方便顯示
    }
  )
