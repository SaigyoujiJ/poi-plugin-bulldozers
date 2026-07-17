module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    // views contain JSX; poi's own pipeline handles it at runtime, Jest needs this
    ['@babel/preset-react', { runtime: 'classic' }],
  ],
}
