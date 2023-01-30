import { Component, ComponentReturn } from './Component'


enum Type {
  Component = 1,
  Fragment,
  Raw,
  Tag,
  Text
}

type VNode = {
  _fern_: Type
  attrs?: object
  item?: string
  component?: Component<any>
  instance?: ComponentReturn
  children?: Array<VNode>
  node?: Node
  parent?: Node
}

const normalize = (node: any): VNode => {
  // already a vnode
  if(node._fern_) return node
  // an array, so make it a fragment
  if(Array.isArray(node)) return { _fern_: Type.Fragment, children: normalizeChildren(node) }
  // so it is a text node
  return { _fern_: Type.Text, item: String(node) }
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
  Type,
  VNode,
  normalizeChildren
}
