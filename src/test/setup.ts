import '@testing-library/jest-dom';

// Mock window.matchMedia for jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock AudioContext for audio feedback tests
class MockAudioContext {
  state = 'running';
  createOscillator() {
    return {
      type: 'sine',
      frequency: { setValueAtTime: () => {} },
      connect: () => {},
      start: () => {},
      stop: () => {},
    };
  }
  createGain() {
    return {
      gain: { setValueAtTime: () => {}, linearRampToValueAtTime: () => {} },
      connect: () => {},
    };
  }
  resume() {
    return Promise.resolve();
  }
  close() {
    return Promise.resolve();
  }
  destination = {};
}

Object.defineProperty(window, 'AudioContext', {
  writable: true,
  value: MockAudioContext,
});
