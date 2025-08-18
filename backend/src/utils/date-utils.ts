export const addMonthsToDate = (cycle: "monthly" | "yearly", validity: number) => {
  const currentDate = new Date();
  const updatedDate = new Date(currentDate);
  const cycleMonths = cycle === "yearly" ? 12 : 1;

  updatedDate.setMonth(currentDate.getMonth() + (cycleMonths * validity));
  return updatedDate;
};
