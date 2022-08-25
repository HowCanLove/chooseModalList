import { useState } from "react";

export default (defaultList = []) => {
  const [set, setSet] = useState(new Set(defaultList));

  const add = (keys) => {
    const isArray = Array.isArray(keys);
    if (!isArray) keys = [keys];
    setSet((prevSet) => {
      const temp = new Set(prevSet);
      keys.forEach((key) => temp.add(key));
      return temp;
    });
  };

  const remove = (keys) => {
    const isArray = Array.isArray(keys);
    if (!isArray) keys = [keys];
    setSet((prevSet) => {
      const temp = new Set(prevSet);
      keys.forEach((key) => temp.delete(key));
      return temp;
    });
  };

  const clear = (keys) => {
    setSet((prevSet) => {
      const temp = new Set(prevSet);
      temp.clear();
      if (keys) {
        const isArray = Array.isArray(keys);
        if (!isArray) keys = [keys];
        keys.forEach((key) => temp.add(key));
      }
      return temp;
    });
  };

  const reset = () => {
    setSet(new Set(defaultList));
  };

  return [set, { add, remove, clear, reset }];
};
