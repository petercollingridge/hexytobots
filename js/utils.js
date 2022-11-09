function createElement(tag, svg) {
  let element;
  if (svg) {
    element = document.createElementNS('http://www.w3.org/2000/svg', tag);
  } else {
    element = document.createElement(tag);
  }

  const obj = {
      element,
      attr: (attributes) => {
          for (const key in attributes) {
              element.setAttribute(key, attributes[key]);
          }
          return obj;
      },
      addClass: (className) => {
        element.classList.add(className);
        return obj;
      },
      addElement(tag) {
          const childElement = createElement(tag).addTo(this);
          return childElement;
      },
      addEventListener: (type, func) => {
          element.addEventListener(type, func);
          return obj;
      },
      addTo: (parent) => {
        parent.appendChild(element);
        return obj;
      },
      appendChild: (child) => {
        element.appendChild(child);
        return obj;
      },
      css: (styles) => {
          let cssString = ''
          for (const key in styles) {
              cssString += `${key}: ${styles[key]};`;
          }
          element.style.cssText = cssString;
          return obj;
      },
      empty: () => {
        element.innerHTML = '';
        return obj;
      },
      text: (text) => {
        element.innerHTML = text;
        return obj;
    },
  };

  return obj;
}

const sigmoid = (n) => 1 / (1 + Math.exp(-n));

// Loop through an array of object, calling a function method on each item with the given name 
const callForEach = (arr, func, ...args) => arr.forEach((item) => item[func](...args));

// Random integer between 0 and less than n
const randInt = (n) => Math.floor(n * Math.random());

// Random integer between a and less than b
const randRange = (a, b) => Math.floor((b - a) * Math.random()) + a;
