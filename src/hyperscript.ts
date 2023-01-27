import {
  Type as VNodeType,
  VNode
} from './VNode'



const h = (tag: string, child: string): VNode => {


  return {
    type: VNodeType.Tag,
    tag,
    children: [{
      type: VNodeType.Text,
      content: child,
      children: []
    }]
  }

}


export {
  h
}
