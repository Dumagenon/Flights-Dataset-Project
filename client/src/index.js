import GridComponent from "./components/grid";

import './index.html';
import './style.css';

window.addEventListener('DOMContentLoaded', async () => {
  const root = document.getElementById('root');

  new GridComponent(root).render();

  let tooltipElem, timeout;

  document.onmouseover = function(event) {
    let target = event.target;

    let tooltipHtml = target.dataset.tooltip;
    if (!tooltipHtml) return;

    timeout = setTimeout(() => {
      tooltipElem = document.createElement('div');
      tooltipElem.className = 'tooltip';
      tooltipElem.innerHTML = tooltipHtml;
      document.body.append(tooltipElem);

      const coords = target.getBoundingClientRect();

      let left = coords.left + (target.offsetWidth - tooltipElem.offsetWidth) / 2;

      if (left < 0) {
        left = 0;
      }

      let top = coords.top - tooltipElem.offsetHeight - 5;

      if (top < 0) {
        top = coords.top + target.offsetHeight + 5;
      }

      tooltipElem.style.left = left + 'px';
      tooltipElem.style.top = top + 'px';
    }, 400);

  };

  document.onmouseout = function(e) {
    clearInterval(timeout);
    if (tooltipElem) {
      tooltipElem.remove();
      tooltipElem = null;
    }
  };
});
