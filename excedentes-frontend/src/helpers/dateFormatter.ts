export const dateFormatter = (date: string) => {
    if (!date) return { day: '', month: '', year: '' };
  
    const [year, month, day] = date.split('-');
    return {
      day: parseInt(day, 10),
      month: parseInt(month, 10),
      year: parseInt(year, 10),
    };
  };
  