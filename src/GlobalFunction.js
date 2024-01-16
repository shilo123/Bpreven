export function computedData(val) {
  //   console.log(val);
  if (val === "Text") {
    return "טקסט";
  } else if (val === "Numeric") {
    return "מספר";
  } else if (val === "OptionId") {
    return "אופציות";
  } else if (val === "Date") {
    return "תאריך";
  } else {
    return val;
  }
}
export function REVERScomputedData(val) {
  // console.log(val);
  if (val === "טקסט") {
    return "Text";
  } else if (val === "מספר") {
    return "Numeric";
  } else if (val === "אופציות") {
    return "OptionId";
  } else if (val === "תאריך") {
    return "Date";
  } else {
    return val;
  }
}
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
export function SortTable() {
  try {
    let table = this.$refs.Table.$el;
    if (table.children[1].children[0].children[1].children[0].children) {
      let TableHeader =
        table.children[1].children[0].children[1].children[0].children;
      Array.from(TableHeader).forEach((element) => {
        element.style.textAlign = "center";
      });
      let tds = table.children[2].children[0].children[1].children;
      //   console.log(tds);
      Array.from(tds).forEach((element, i) => {
        let elco = element.children[7].children[0].children[0].children[0];
        elco.classList = "el-icon-arrow-left";
        Array.from(element.children).forEach((el) => {
          el.style.textAlign = "right";
        });
      });
    }
  } catch (error) {
    console.log(error);
  }
}
