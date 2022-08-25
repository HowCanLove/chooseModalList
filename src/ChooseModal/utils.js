export const getType = (val) => {
  return Object.prototype.toString.call(val).toLocaleLowerCase().slice(8, -1);
};

export function isFunc(fun) {
  return getType(fun) === "function";
}

export function doFunction(fun, ...params) {
  return isFunc(fun) ? fun(...params) : undefined;
}
export const selectionType = {
  checkbox: "checkbox",
  radio: "radio",
};
