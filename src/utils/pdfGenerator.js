import html2pdf from 'html2pdf.js';

export const generatePDFInvoice = (bookingDetails, brandConfig) => {
  const element = document.createElement('div');
  element.innerHTML = `
    <div style="padding: 24px; font-family: sans-serif; color: #1e293b; max-width: 600px; border: 2px solid #6366f1; border-radius: 12px; margin: auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px;">
        <h2>${brandConfig?.brandName || 'EventHub Pro'}</h2>
        <span style="color: #10b981; font-weight: bold;">PAID RECEIPT</span>
      </div>
      <div style="margin-top: 16px; font-size: 13px; line-height: 1.6;">
        <p><strong>Booking ID:</strong> ${bookingDetails.bookingId}</p>
        <p><strong>Customer:</strong> ${bookingDetails.customerName} (${bookingDetails.customerEmail})</p>
        <p><strong>Event Service:</strong> ${bookingDetails.eventType}</p>
        <p><strong>Date & Time:</strong> ${bookingDetails.eventDate} at ${bookingDetails.eventTime}</p>
        <p><strong>Address:</strong> ${bookingDetails.customAddress}</p>
        <p><strong>Contact Phone:</strong> ${bookingDetails.contactPhone}</p>
      </div>
      <div style="margin-top: 20px; background: #f8fafc; padding: 12px; border-radius: 8px; text-align: right;">
        <h3 style="margin: 0; color: #4f46e5;">Total Amount Paid: ₹${bookingDetails.price}</h3>
      </div>
      <div style="text-align: center; margin-top: 24px; font-size: 11px; color: #64748b;">
        Thank you for choosing ${brandConfig?.brandName || 'EventHub Pro'}!
      </div>
    </div>
  `;

  const opt = {
    margin: 10,
    filename: `Invoice_${bookingDetails.bookingId}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save();
};