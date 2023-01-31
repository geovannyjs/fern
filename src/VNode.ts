import { Component, ComponentReturn } from './Component'


enum Type {
  Component = 1,
  Fragment,
  Raw,
  Tag,
  Text
}

const EMPTY_ARRAY: Array<any> = []
const EMPTY_OBJECT = {}

type VNode = {
  _fern_: Type
  attrs: object
  item?: string
  component?: Component<any>
  instance?: ComponentReturn
  children: Array<VNode>
  node?: Node
  parent?: Node
}

const fragment = (...nodes: Array<any>): VNode => ({
  _fern_: Type.Fragment,
  attrs: EMPTY_OBJECT,
  children: normalizeChildren(nodes)
})

const normalize = (node: any): VNode => {
  // already a vnode
  if(node._fern_) return node
  // an array, so make it a fragment
  if(Array.isArray(node)) return fragment(...node)
  // so it is a text node
  return { _fern_: Type.Text, attrs: EMPTY_OBJECT, item: String(node), children: EMPTY_ARRAY }
}

const normalizeChildren = (children: Array<any>): Array<VNode> => {
  for(let i = 0; i < children.length; i++) {
    // null children will be removed
    if(children[i] == null) children.splice(i, 1)
    else children[i] = normalize(children[i])
  }
  return children
}

export {
  EMPTY_ARRAY,
  EMPTY_OBJECT,
  Type,
  VNode,
  fragment,
  normalizeChildren
}
