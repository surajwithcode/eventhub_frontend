import { z } from 'zod';

export const bookingSchema = z.object({
  passHolderName: z.string().min(3, 'Naam kam se kam 3 letters ka hona chahiye'),
  eventDate: z.string().refine((date) => new Date(date) >= new Date(), {
    message: 'Future date select karein'
  }),
  eventTime: z.string().min(1, 'Time select karein'),
  customAddress: z.string().min(10, 'Full detailed address likhein'),
  contactPhone: z.string().regex(/^[6-9]\d{9}$/, 'Valid 10-digit phone number dalein')
});