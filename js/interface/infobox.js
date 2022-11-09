const INFO_BARS = [
  { name: 'Life', key: 'life', max: MAX_LIFE },
  { name: 'Energy', key: 'energy', max: MAX_ENERGY },
  { name: 'Sugar', key: 'sugar', max: MAX_SUGAR },
  { name: 'Child', key: 'child', max: MAX_LIFE },
  { name: 'Starch', key: 'starch', max: MAX_STARCH },
  { name: 'Child starch', key: 'starch2', max: MAX_STARCH },
];

function getMetaboliteInfo(container) {
  const infoBoxElement = createElement('div')
    .addClass('info-box')
    .addTo(container);

  const textNodes = INFO_BARS.map((metric) => {
    // Container
    const infoBar = createElement('div')
      .addClass('info-bar')
      .addTo(infoBoxElement);

    // Fill some percentage of the bar based on value
    const percent = createElement('div').addClass('percent-bar').addTo(infoBar);

    // Span containing name
    createElement('span').addClass('info-name').addTo(infoBar).text(`${metric.name}:`);

    // Span containing value
    const value = createElement('span').addTo(infoBar);
    return { percent, value };
  });

  const neuralNetMap = createElement('div').addTo(container);

  const obj = {
    element: infoBoxElement,
    update: (selectedCell) => {
      if (selectedCell) {
        INFO_BARS.map((metric, index) => {
          const value = selectedCell[metric.key];
          const percentage = Math.round(100 * value / metric.max);

          const node = textNodes[index];
          node.value.text(Math.round(value * 1e3) / 1e3);
          node.percent.css({ width: `${percentage}%` });

          const svg = drawNNMap(selectedCell);
          console.log(svg);
          neuralNetMap.empty();
          svg.addTo(neuralNetMap);
        })
      }
    }
  };

  return obj;
}