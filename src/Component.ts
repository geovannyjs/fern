import { Redraw } from './mount'
import { VNode } from './VNode'


type Attrs<T extends object> = T

type ComponentLifeCycleMethods = {
  created?: () => any
  delayRemove?: () => any
  removed?: () => any
  shouldUpdate?: () => boolean
  updated?: () => any
}

type ComponentViewMethod = {
  view: ({ attrs, children }: { attrs: object, children: Array<any> }) => VNode
}

type ComponentReturn = ComponentLifeCycleMethods & ComponentViewMethod

type Component<T extends object> = (attrs: Attrs<T>, redraw: Redraw) => ComponentReturn

export {
  Component,
  ComponentReturn
}
