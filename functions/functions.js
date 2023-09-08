
const getLatestDayOfMonth = (year, month) => {
  const date = new Date(year, month, 1);
  date.setDate(date.getDate() - 1);
  return date.getDate();
}

module.exports = { getLatestDayOfMonth }
