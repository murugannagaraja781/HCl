
export const getCreditLimit = (annualIncome) => {
  const income = Number(annualIncome) || 0;
  if (income <= 200000) return { amount: 50000, type: 'fixed' };
  if (income > 200000 && income <= 300000) return { amount: 75000, type: 'fixed' };
  if (income > 300000 && income <= 500000) return { amount: 1000000, type: 'fixed' };
  return { amount: null, type: 'subjective' };
};

export const formatCurrency = (num) => {
  if (num == null) return '—';
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(num);
};

export const isValidPAN = (pan) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test((pan || '').trim());


export const getAge = (dob) => {
  if (!dob) return null;
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

export const MIN_APPLICANT_AGE = 18;
