import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom';

class ResizeObserver {
  observe() {}

  unobserve() {}

  disconnect() {}
}

global.ResizeObserver = ResizeObserver;
