// Разметка блока выражения
const expressionString = `<div class="game__expr">
    <span class="mult-1"></span>
    <span class="symbol-mult">x</span>
    <span class="mult-2"></span>
    <span class="symbol-result">=</span>
    <span class="mult-result"></span>
  </div>`;

// Рендерим элемент
const renderExpressionEl = () => {
  return renderElement(expressionString);
};
