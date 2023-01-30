import Benchmark from 'benchmark'

import fern from '../../../dist/fern.umd.js'
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
  .add('fern#text', () => fern.h('span', null, [...Array(1000).keys()].map(_ => 'Test')))
  .add('Hyperapp#text', () => h('span', {}, [...Array(1000).keys()].map(_ => text('Test'))))
  .add('Mithril#text', () => m('span', [...Array(1000).keys()].map(_ => 'Test')))
  .run()
