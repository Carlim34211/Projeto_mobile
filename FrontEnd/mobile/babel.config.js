module.exports = {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module:react-native-dotenv', // Usando o dotenv para carregar variáveis de ambiente
        {
          moduleName: '@env',          // Nome do módulo para importar as variáveis
          path: '.env',                // Caminho do arquivo .env
        },
      ],
    ],
  };
  