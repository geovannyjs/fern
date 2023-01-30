import { Component } from './Component'
import { diff } from './diff'
import { h, fragment } from './hyperscript'
import { VNode } from './VNode'


type Redraw = () => void
type GlobalRef = {
  redraw: Redraw
}


const rAF = typeof requestAnimationFrame === 'undefined' ? (fn: Function) => fn() : requestAnimationFrame

const mount = (root: Element) => (component: Component<any>, attrs: object = {}): Redraw => {

  // we start the old vnode as an empty fragment
  let oldVNode: VNode = fragment()

  // FIXME TEST
  oldVNode._fern_ = 1

  oldVNode.parent = root
  root.nodeValue = ''

  // redraw
  const redraw = () => rAF(() => {
    const vnode = h(component, attrs);
    diff({ redraw }, oldVNode, vnode)
    oldVNode = vnode
  })

  // first drawn
  rAF(() => {
    const vnode = h(component, attrs)
    diff({ redraw }, oldVNode, vnode)
    oldVNode = vnode
  })

  return redraw

}

export {
  GlobalRef,
  mount
}
