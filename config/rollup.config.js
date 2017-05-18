import babel from 'rollup-plugin-babel'
import localResolve from 'rollup-plugin-local-resolve'
import json from 'rollup-plugin-json'
import fs from 'fs'
import path from 'path'

const external = ['history/lib/createBrowserHistory']
  .concat(fs.readdirSync(path.resolve(__dirname, '../node_modules')))
  .concat(fs.readdirSync(path.resolve(__dirname, '../node_modules/react-intl/locale-data')).map(str => `react-int/locale-data/${str}`))

export default {
  plugins: [json(), babel(), localResolve()],
  external: external
}
