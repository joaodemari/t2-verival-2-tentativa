export const calculateDaysLeft = (expirationDate: string) => {
  const expiration = new Date(expirationDate);
  const today = new Date();
  const timeDiff = expiration.getTime() - today.getTime();
  const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return daysLeft;
};
