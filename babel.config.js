module.exports = {
  presets: [
    ["@vue/app", {
      useBuiltIns: "entry",
      "targets": {
        "ie": "8"
      }
    }]
  ],
  plugins: [
    ['import', {
      libraryName: 'vant',
      libraryDirectory: 'es',
      style: true
    }, 'vant']
  ]
}
