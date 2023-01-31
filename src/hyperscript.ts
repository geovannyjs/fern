import { Component } from './Component'
import {
  Type as VNodeType,
  VNode,
  normalizeChildren,
  EMPTY_OBJECT,
  EMPTY_ARRAY
} from './VNode'


const fragment = (...nodes: Array<any>): VNode => ({
  _fern_: VNodeType.Fragment,
  attrs: EMPTY_OBJECT,
  children: normalizeChildren(nodes)
})

function h(itemOrComponent: string | Component<any>, a: object | null, ...children: Array<any>): VNode {

  const isComponent = typeof itemOrComponent == 'function'
  const attrs = a || EMPTY_OBJECT

  return isComponent ? {
    _fern_: VNodeType.Component,
    attrs,
    component: <Component<any>>itemOrComponent,
    // component children do not need to be normalized, it will be normalized when component's view function is evaluated
    children
  } : {
    _fern_: VNodeType.Tag,
    attrs,
    item: <string>itemOrComponent,
    children: normalizeChildren(children)
  }

}

const trust = (html: string = ''): VNode => ({
  _fern_: VNodeType.Raw,
  attrs: EMPTY_OBJECT,
  item: html,
  children: EMPTY_ARRAY
})

export {
  fragment,
  h,
  trust
}
