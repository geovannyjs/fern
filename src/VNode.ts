enum Type {
  Component = 0,
  Fragment,
  Raw,
  Tag,
  Text
}

type VNode = {
  type: Type
  tag?: string
  content?: string
  children: Array<VNode>
}

export {
  Type,
  VNode
}
