import { Component, ComponentReturn } from './Component'
import { GlobalRef } from './mount'
import { VNode, Type as VNodeType } from './VNode'
import { Type as NodeType, buildNode, setElementAttrs } from './Node'


const diff = (ref: GlobalRef, old: VNode, cur: VNode, index: number = 0): void => {

  if(old._fern_ != cur._fern_) {
    if((<Node>old.node).nodeType == NodeType.Fragment) {
      let oldChildren = Array.from(<Array<ChildNode>><unknown>(<Node>old.parent).childNodes)
      old.parent && ( old.parent.textContent = '' )
      let curNode = [...oldChildren.slice(0, index), <ChildNode>buildNode(ref, cur), ...oldChildren.slice(index + old.children.length + 1)]
      for(let i = 0; i < curNode.length; i++) (<Node>old.parent).appendChild(curNode[i])
    }
    else {
      ;(<Element>old.node).replaceWith(buildNode(ref, cur))
    }
    cur.parent = old.parent
    return
  }
  else {
    // Text
    if(cur._fern_ == VNodeType.Text) {
      if(old.item != cur.item) (<Node>old.node).nodeValue = <string>cur.item
      cur.node = old.node
      cur.parent = old.parent
      return
    }

    // Component
    else if(cur._fern_ == VNodeType.Component) {

      // component is different, so create a new instance
      if(old.component != cur.component) cur.instance = (<Component<any>>cur.component)(cur.attrs, ref.redraw)
      else cur.instance = old.instance

      cur.children = [(<ComponentReturn>cur.instance).view({ attrs: cur.attrs, children: cur.children })]
    }
    // Tag
    else if(cur._fern_ == VNodeType.Tag) {
      if(old.item != cur.item) { 
        (<Element>old.node).replaceWith(buildNode(ref, cur))
        return
      }
      // diff attrs
      else {
        // if old attrs do not exist in the cur, delete them
        const oldAttrs = Object.keys(old.attrs)
        type OldAttrsKey = keyof typeof old.attrs
        for(let i = 0; i < oldAttrs.length; i++) {
          if(cur.attrs[oldAttrs[i] as OldAttrsKey] == old.attrs[oldAttrs[i] as OldAttrsKey]) continue
          if(oldAttrs[i].slice(0, 2) == 'on') { old.attrs && (<Element>old.node).removeEventListener(oldAttrs[i].slice(2), old.attrs[oldAttrs[i] as OldAttrsKey]) }
          else (<Element>old.node).removeAttribute(oldAttrs[i])
        }
        // create all attrs from cur
        setElementAttrs(<Element>old.node, cur.attrs)
      }
    }
    // for vnodes that may have children ( components, fragments and tags )
    // diff the children and keep the dom reference
    const toDiff = Math.min(old.children.length, cur.children.length)

    // cur has more children, so insert them
    if(toDiff < cur.children.length) {
      for(let i = toDiff; i < cur.children.length; i++) {
        (<Node>old.parent).appendChild(buildNode(ref, cur.children[i]))
        cur.children[i].parent = old.node
      }
    }
    // old has more children, so remove them
    else if(toDiff < old.children.length) {
      for(let i = toDiff; i < old.children.length; i++) {
        if((<Node>old.node).nodeType == NodeType.Fragment) (<Node>old.parent).removeChild(<Node>old.children[i].node)
        else (<Node>old.node).removeChild(<Node>old.children[i].node)
      }
    }

    // diff the number of children in common
    for(let i=0; i < toDiff; i++) diff(ref, old.children[i], cur.children[i], i)
    cur.node = old.node
    cur.parent = old.parent
  }
}


export {
  diff
}
