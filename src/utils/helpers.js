
// src/utils/helpers.js
export const toLocalDateTimeInput = (isoStr) => {
  if (!isoStr) return "";
  const d = new Date(isoStr);
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off*60*1000);
  return local.toISOString().slice(0,16); // yyyy-MM-ddTHH:mm
};
