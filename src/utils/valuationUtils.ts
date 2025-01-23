export const getFirmSizeCategory = (employeeCount: number) => {
  if (employeeCount <= 5) return 'small';
  if (employeeCount <= 20) return 'medium';
  return 'large';
};

export const getSDEParameters = (firmSize: string) => {
  switch (firmSize) {
    case 'small':
      return {
        ownerCompRatio: 0.40,
        operatingExpenseRatio: 0.25,
        sdeMargin: 0.45
      };
    case 'medium':
      return {
        ownerCompRatio: 0.30,
        operatingExpenseRatio: 0.30,
        sdeMargin: 0.40
      };
    case 'large':
      return {
        ownerCompRatio: 0.20,
        operatingExpenseRatio: 0.35,
        sdeMargin: 0.35
      };
    default:
      return {
        ownerCompRatio: 0.40,
        operatingExpenseRatio: 0.25,
        sdeMargin: 0.45
      };
  }
};

export const getValuationMultiple = (firmSize: string, revenue: number) => {
  let baseMultiple = 0.71;

  switch (firmSize) {
    case 'small':
      baseMultiple = 0.71;
      break;
    case 'medium':
      baseMultiple = 0.85;
      break;
    case 'large':
      baseMultiple = 1.00;
      break;
  }

  if (revenue > 5000000) baseMultiple += 0.05;
  if (revenue > 10000000) baseMultiple += 0.04;

  return Math.min(1.09, baseMultiple);
};