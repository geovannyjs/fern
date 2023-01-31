import { Component } from './Component'
import { diff } from './diff'
import { h } from './hyperscript'
import { buildNodeFragment } from './Node'
import { EMPTY_OBJECT, VNode, fragment } from './VNode'


type Redraw = () => void
type GlobalRef = {
  redraw: Redraw
}

const rAF = typeof requestAnimationFrame === 'undefined' ? (fn: Function) => fn() : requestAnimationFrame

const mount = (root: Element) => (component: Component<any>, attrs: object = EMPTY_OBJECT): Redraw => {

  const global: GlobalRef = {
    redraw: () => {}
  }

  // if pending is true, a redraw is running
  let pending = false

  // we start the old vnode as an empty fragment
  let oldVNode: VNode = fragment()


  // redraw
  global.redraw = () => {
    if(pending) return
    pending = true
    rAF(() => {
      const vnode = h(component, attrs);
      diff(global, oldVNode, vnode)
      oldVNode = vnode
      pending = false
    })
  }

  // first drawn
  rAF(() => {
    const vnode = h(component, attrs)

    buildNodeFragment(global, oldVNode)
    oldVNode.parent = root
    root.nodeValue = ''

    diff(global, oldVNode, vnode)
    oldVNode = vnode
  })

  return global.redraw

}

export {
  GlobalRef,
  Redraw,
  mount
}
