function getInfobox(container) {
  const infoBoxElement = createElement('div')
    .addClass('infobox')
    .addTo(container);

  let textNodes = [];

  const clear = () => {
    textNodes.forEach((box) => {
      box.text('');
    });
  }

  const obj = {
    element: infoBoxElement,
    update: (selectedCell) => {
      if (selectedCell) {
        // Clear any current info
        infoBoxElement.textContent = '';

        const info = selectedCell.info();
        Object.entries(info).map(([key, value], index) => {
          let child = textNodes[index];

          // Create child if it doesn't exist
          if (!child) {
            child = createElement('div').addTo(infoBoxElement);
          }
          textNodes.push(child);
          
          child.text(`${key}: ${Math.round(value * 1e3) / 1e3}`)
        })
      }
    }
  };

  return obj;
}