export default {
  'entry': 'src/pages/*.js',
  'outputPath': './dist',
  'publicPath': '../cf/',
  'multiPage': true,
  'env': {
    'development': {
      'extraBabelPlugins': [
        'dva-hmr',
        'transform-runtime',
        ['import', { 'libraryName': 'antd', 'style': 'css' }]
      ]
    },
    'production': {
      'extraBabelPlugins': [
        'transform-runtime',
        ['import', { 'libraryName': 'antd', 'style': 'css' }]
      ]
    }
  }
}

