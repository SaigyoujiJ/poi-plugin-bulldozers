// Minimal React stub for Jest: views are only imported (never rendered) in
// smoke tests, so a bare Component class plus a few no-op helpers is enough.
class Component {
  constructor(props) {
    this.props = props || {}
    this.state = {}
  }

  setState() {}
}

const React = {
  Component,
  Fragment: 'Fragment',
  createElement: () => null,
  createRef: () => ({ current: null }),
}

module.exports = { __esModule: true, default: React, ...React }
