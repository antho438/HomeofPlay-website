// Helper function to format price in GBP
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2
  }).format(price);
};

// Calculate VAT (20% in the UK)
export const calculateVAT = (price: number): number => {
  return price * 0.2;
};

// Calculate total with VAT
export const calculateTotalWithVAT = (price: number): number => {
  return price + calculateVAT(price);
};
