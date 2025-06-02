/* .eslintrc.cjs */
module.exports = {
    root: true,
    // Indica que estamos en un proyecto ECMAScript 2021 con módulos
    env: {
      browser: true,
      es2021: true,
      node: true,
    },
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      ecmaFeatures: { jsx: true },
    },
    // Conjunto de reglas recomendado por ESLint
    extends: ['eslint:recommended'],
    // Ajustes adicionales para React (opcional pero útil)
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // Aquí puedes añadir tus propias reglas o modificar severidades.
      // Ejemplo:
      // 'no-unused-vars': 'warn',
    },
  };
  