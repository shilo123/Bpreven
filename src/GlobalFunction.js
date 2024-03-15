export function findLargestArray(arrays) {
  let max_length = 0;
  let largest_array = null;

  arrays.forEach((array) => {
    if (array.length > max_length) {
      max_length = array.length;
      largest_array = array.length;
    }
  });

  return largest_array;
}
export function Bool(Boolian, succesMes, DefeatMes, ifReload) {
  // console.log({ Boolian, succesMes, DefeatMes, ifReload });
  if (Boolian) {
    this.$message.success(succesMes);
    if (ifReload) {
      window.location.reload();
    }
  } else {
    this.$message.error(DefeatMes);
  }
}
export function random(min, max) {
  if (min > max) {
    throw new Error("אחי אך המינימלי גדול מהמקמילי אחיי");
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function Booleano(val) {
  return Boolean(val);
}
export function isNumeric(str) {
  if (typeof str !== "string") return false;
  return !isNaN(str) && !isNaN(parseFloat(str));
}
export function ConSol(val) {
  console.log(val);
}
export function computedData(val) {
  if (val === "Text") {
    return "טקסט";
  } else if (val === "Numeric") {
    return "מספר";
  } else if (val === "OptionId") {
    return "אופציות";
  } else if (val === "Date") {
    return "תאריך";
  } else if (val === "Sentence") {
    return "משפט";
  } else {
    return val;
  }
}
export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
