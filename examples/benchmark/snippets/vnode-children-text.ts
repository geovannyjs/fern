import Benchmark from 'benchmark'

import fern from '../../../dist/fern.umd.js'
import { h, text } from 'hyperapp'
import m from 'mithril'


const suite = new Benchmark.Suite('My performance test')

suite.on('cycle', event => {
  const benchmark = event.target
  console.log(benchmark.toString())
})

suite.on('complete', event => {
  const suite = event.currentTarget
  const fastestOption = suite.filter('fastest').map('name')
  console.log(`The fastest option is ${fastestOption}`)
})

suite
  .add('fern#text', () => fern.h('span', null, 'Test'))
  .add('Hyperapp#text', () => h('span', {}, [text('Test')]))
  .add('Mithril#text', () => m('span', 'Test'))
  .run()
