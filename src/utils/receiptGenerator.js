export const generateReceiptCSV = (bookingDetails, brandConfig) => {
  const content = `====================================
${brandConfig?.brandName || 'EventHub Pro'} - BOOKING RECEIPT
====================================
Booking ID : ${bookingDetails.bookingId}
Date       : ${bookingDetails.eventDate} Time: ${bookingDetails.eventTime}
Customer   : ${bookingDetails.customerName} (${bookingDetails.customerEmail})
Organizer  : ${bookingDetails.organizerEmail || 'EventHub Team'}
Event Type : ${bookingDetails.eventType}
Address    : ${bookingDetails.customAddress}
Phone      : ${bookingDetails.contactPhone}
------------------------------------
TOTAL PAID : INR ${bookingDetails.price}
Status     : Confirmed
====================================`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `Receipt_${bookingDetails.bookingId}.txt`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};