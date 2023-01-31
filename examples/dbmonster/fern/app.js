'use strict'

perfMonitor.startFPSMonitor()
perfMonitor.startMemMonitor()
perfMonitor.initProfiler('render')

const h = fern.h

fern.mount(document.getElementById('app'))((attrs, redraw) => {

  let data = []

  const update = () => {
    requestAnimationFrame(update)

    data = ENV.generateData().toArray()

    perfMonitor.startProfile('render')
    redraw()
    perfMonitor.endProfile('render')
  }

  update()

  return {
    view: () => h('div', null, [
      h('table', { class: 'table table-striped latest-data' }, [
        h('tbody', null,
          data.map((db) => h('tr', null, [
            h('td', { class: 'dbname' }, db.dbname),
            h('td', { class: 'query-count' },  [
              h('span', { class: db.lastSample.countClassName }, db.lastSample.nbQueries)
            ]),
            db.lastSample.topFiveQueries.map((query) => h('td', { class: query.elapsedClassName }, [
              query.formatElapsed,
              h('div', { class: 'popover left' }, [
                h('div', { class: 'popover-content' }, query.query),
                h('div', { class: 'arrow' })
              ])
            ]))
          ]))
        )
      ])
    ])
  }

})
