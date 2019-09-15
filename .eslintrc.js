module.exports = {
  root: true,
  extends: '@react-native-community',
  plugins: ['react-hooks'],
  rules: {
    'object-curly-spacing': [2, 'always'],
    curly: ['error', 'multi'],
    'comma-dangle': '0',
    'react-hooks/exhaustive-deps': 'warn'
  }
};
