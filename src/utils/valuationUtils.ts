export const getFirmSizeCategory = (employeeCount: number) => {
  if (employeeCount <= 5) return 'micro';
  if (employeeCount <= 20) return 'small';
  if (employeeCount <= 100) return 'medium';
  if (employeeCount <= 500) return 'large';
  return 'enterprise';
};

export const getSDEParameters = (firmSize: string) => {
  switch (firmSize) {
    case 'micro':
      return {
        ownerCompRatio: 0.40,
        operatingExpenseRatio: 0.25,
        sdeMargin: 0.45
      };
    case 'small':
      return {
        ownerCompRatio: 0.35,
        operatingExpenseRatio: 0.30,
        sdeMargin: 0.40
      };
    case 'medium':
      return {
        ownerCompRatio: 0.30,
        operatingExpenseRatio: 0.35,
        sdeMargin: 0.35
      };
    case 'large':
      return {
        ownerCompRatio: 0.25,
        operatingExpenseRatio: 0.40,
        sdeMargin: 0.30
      };
    case 'enterprise':
      return {
        ownerCompRatio: 0.20,
        operatingExpenseRatio: 0.45,
        sdeMargin: 0.25
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
  // Base multiple starts based on firm size
  let baseMultiple = 0.71; // Default for micro firms

  switch (firmSize) {
    case 'micro':
      baseMultiple = 0.71;
      break;
    case 'small':
      baseMultiple = 0.85;
      break;
    case 'medium':
      baseMultiple = 1.00;
      break;
    case 'large':
      baseMultiple = 1.15;
      break;
    case 'enterprise':
      baseMultiple = 1.30;
      break;
  }

  // Revenue scale adjustments
  if (revenue > 5000000) baseMultiple += 0.05;
  if (revenue > 10000000) baseMultiple += 0.04;
  if (revenue > 50000000) baseMultiple += 0.06;
  if (revenue > 100000000) baseMultiple += 0.05;

  // Cap at the maximum industry multiple
  return Math.min(1.50, baseMultiple);
};

// Updated to use average salary per employee from county data
export const estimateAnnualRevenue = (employeeCount: number, avgSalaryPerEmployee?: number) => {
  // Use provided average salary or fall back to industry average
  const salary = avgSalaryPerEmployee || 86259; // Default to national average if not provided
  
  // Industry standard: Payroll typically represents about 35% of total revenue
  const payrollToRevenueRatio = 0.35;
  
  // Calculate total payroll and then estimate revenue
  const totalPayroll = employeeCount * salary;
  return totalPayroll / payrollToRevenueRatio;
};