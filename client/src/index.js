import GridComponent from "./components/grid";
import tooltipInit from './components/tooltip';

import './index.html';
import './style.css';

window.addEventListener('DOMContentLoaded', async () => {
  const root = document.getElementById('root');

  new GridComponent(root).render();

  tooltipInit();
});
