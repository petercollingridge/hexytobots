function getToolbarItem(toolbarElement, itemName, getValue) {
  const itemElement = toolbarElement.addElement('span')
    .addClass('toolbar-item')
    .text(itemName);

  const obj = {
    update: (sim) => {
      const value = getValue(sim);
      itemElement.text(`${itemName}: ${value}`); 
    }
  };

  return obj;
}

function getToolbar(container) {
  const defaultItems = {
    Time: sim => sim.time.toLocaleString(),
    Light: sim => sim.light.toFixed(3),
    Cells: sim => sim.cells.length,
  };

  const toolbarElement = createElement('div')
    .addClass('toolbar')
    .addTo(container);

  const _items = [];

  const obj = {
    element: toolbarElement,
    addItem: (name, getValue) => {
      const newItem = getToolbarItem(toolbarElement, name, getValue);
      _items.push(newItem);
    },
    update: (sim) => {
      _items.forEach((item) => {
        item.update(sim);
      });
    }
  }

  for (const item in defaultItems) {
    obj.addItem(item, defaultItems[item]);
  }

  return obj;
}
