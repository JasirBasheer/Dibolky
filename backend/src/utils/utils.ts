export const addMonthsToDate = (months: number) =>{
    const currentDate = new Date();
    const updatedDate = new Date(currentDate);
    updatedDate.setMonth(currentDate.getMonth() + months);
    return updatedDate;
};
