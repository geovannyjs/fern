import Benchmark from 'benchmark'

import m from 'mithril'
import { h, text } from 'hyperapp'

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
  .add('Hyperapp#text', () => h('span', {}, [text('Test')]))
  .add('Mithril#text', () => m('span', 'Test'))
  .run()