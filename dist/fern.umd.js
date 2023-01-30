(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.fern = {}));
})(this, (function (exports) { 'use strict';

    var Type;
    (function (Type) {
        Type[Type["Component"] = 1] = "Component";
        Type[Type["Fragment"] = 2] = "Fragment";
        Type[Type["Raw"] = 3] = "Raw";
        Type[Type["Tag"] = 4] = "Tag";
        Type[Type["Text"] = 5] = "Text";
    })(Type || (Type = {}));
    const normalize = (node) => {
        // already a vnode
        if (node._fern_)
            return node;
        // an array, so make it a fragment
        if (Array.isArray(node))
            return { _fern_: Type.Fragment, children: normalizeChildren(node) };
        // so it is a text node
        return { _fern_: Type.Text, item: String(node) };
    };
    const normalizeChildren = (children) => {
        for (let i = 0; i < children.length; i++) {
            // null children will be removed
            if (children[i] == null)
                children.splice(i, 1);
            else
                children[i] = normalize(children[i]);
        }
        return children;
    };

    const fragment = (...nodes) => ({
        _fern_: Type.Fragment,
        children: normalizeChildren(nodes)
    });
    function h(itemOrComponent, a, ...children) {
        const isComponent = typeof itemOrComponent == 'function';
        const attrs = a || {};
        return isComponent ? {
            _fern_: Type.Component,
            attrs,
            component: itemOrComponent,
            // component children do not need to be normalized, it will be normalized when component's view function is evaluated
            children
        } : {
            _fern_: Type.Tag,
            attrs,
            item: itemOrComponent,
            children: normalizeChildren(children)
        };
    }

    //import { Type as NodeType, buildNode, buildNodeTag, setElementAttrs } from './Node'
    const diff = (ref, old, cur, index = 0) => {
        var _a;
        if (old._fern_ !== cur._fern_) { /*
          if(old.node?.nodeType === NodeType.Fragment) {
            let oldChildren = Array.from(<Array<ChildNode>><unknown>old.parent?.childNodes)
            old.parent && ( old.parent.textContent = '' )
            let curNode = oldChildren.slice(0, index).concat(<ChildNode>buildNode(ref, cur), oldChildren.slice(index + old.children.length + 1))
            for(let i = 0; i < curNode.length; i++) old.parent?.appendChild(curNode[i])
          }
          else {
            ;(<Element>old.node).replaceWith(buildNode(ref, cur))
          }
          cur.parent = old.parent*/
            return;
        }
        else {
            // Text
            /*
            if(cur.type === VNodeType.Text) {
              if(<string>old.item != <string>cur.item) { ;(<Element>old.node).textContent = <string>cur.item }
              cur.node = old.node
              cur.parent = old.parent
              return
            }
            */
            // Component
            //else 
            if (cur._fern_ === Type.Component) {
                // component is different, so create a new instance
                if (old.component !== cur.component)
                    cur.instance = cur.component(cur.attrs, ref.redraw);
                else
                    cur.instance = old.instance;
                cur.children = cur.instance ? [(_a = cur.instance) === null || _a === void 0 ? void 0 : _a.view({ attrs: cur.attrs || {}, children: cur.children || [] })] : [];
            }
            /*
                // Tag
                else if(cur.type === VNodeType.Tag) {
                  if(old.item !== cur.item) {
                    (<Element>old.node).replaceWith(buildNodeTag(ref, cur))
                    return
                  }
                  // diff attrs
                  else {
                    // if old attrs do not exist in the cur, delete them
                    const oldAttrs = Object.keys(old.attrs)
                    type OldAttrsKey = keyof typeof old.attrs
                    for(let i = 0; i < oldAttrs.length; i++) {
                      if(oldAttrs[i].slice(0, 2) === 'on') { ;(<Element>old.node).removeEventListener(oldAttrs[i].slice(2), old.attrs[oldAttrs[i] as OldAttrsKey]) }
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
                    old.parent?.appendChild(buildNode(ref, cur.children[i]))
                    cur.children[i].parent = old.node
                  }
                }
                // old has more children, so remove them
                else if(toDiff < old.children.length) {
                  for(let i = toDiff; i < old.children.length; i++) {
                    if(old.node?.nodeType === NodeType.Fragment) old.parent?.removeChild(<Node>old.children[i].node)
                    else old.node?.removeChild(<Node>old.children[i].node)
                  }
                }
            
                // diff the number of children in common
                for(let i=0; i < toDiff; i++) diff(ref, old.children[i], cur.children[i], i)
                cur.node = old.node
                cur.parent = old.parent
                */
        }
    };

    const rAF = typeof requestAnimationFrame === 'undefined' ? (fn) => fn() : requestAnimationFrame;
    const mount = (root) => (component, attrs = {}) => {
        // we start the old vnode as an empty fragment
        let oldVNode = fragment();
        // FIXME TEST
        oldVNode._fern_ = 1;
        oldVNode.parent = root;
        root.nodeValue = '';
        // redraw
        const redraw = () => rAF(() => {
            const vnode = h(component, attrs);
            diff({ redraw }, oldVNode, vnode);
            oldVNode = vnode;
        });
        // first drawn
        rAF(() => {
            const vnode = h(component, attrs);
            diff({ redraw }, oldVNode, vnode);
            oldVNode = vnode;
        });
        return redraw;
    };

    exports.h = h;
    exports.mount = mount;

}));
