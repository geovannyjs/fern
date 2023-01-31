(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.fern = {}));
})(this, (function (exports) { 'use strict';

    var Type$1;
    (function (Type) {
        Type[Type["Component"] = 1] = "Component";
        Type[Type["Fragment"] = 2] = "Fragment";
        Type[Type["Raw"] = 3] = "Raw";
        Type[Type["Tag"] = 4] = "Tag";
        Type[Type["Text"] = 5] = "Text";
    })(Type$1 || (Type$1 = {}));
    const EMPTY_ARRAY = [];
    const EMPTY_OBJECT = {};
    const fragment = (...nodes) => ({
        _fern_: Type$1.Fragment,
        attrs: EMPTY_OBJECT,
        children: normalizeChildren(nodes)
    });
    const normalize = (node) => {
        // already a vnode
        if (node._fern_)
            return node;
        // an array, so make it a fragment
        if (Array.isArray(node))
            return fragment(...node);
        // so it is a text node
        return { _fern_: Type$1.Text, attrs: EMPTY_OBJECT, item: String(node), children: EMPTY_ARRAY };
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

    function h(itemOrComponent, a, ...children) {
        const isComponent = typeof itemOrComponent == 'function';
        const attrs = a || EMPTY_OBJECT;
        return isComponent ? {
            _fern_: Type$1.Component,
            attrs,
            component: itemOrComponent,
            // component children do not need to be normalized, it will be normalized when component's view function is evaluated
            children
        } : {
            _fern_: Type$1.Tag,
            attrs,
            item: itemOrComponent,
            children: normalizeChildren(children)
        };
    }

    var Type;
    (function (Type) {
        Type[Type["Element"] = 1] = "Element";
        Type[Type["Attribute"] = 2] = "Attribute";
        Type[Type["Text"] = 3] = "Text";
        Type[Type["CDataSection"] = 4] = "CDataSection";
        Type[Type["ProcessingInstruction"] = 7] = "ProcessingInstruction";
        Type[Type["Comment"] = 8] = "Comment";
        Type[Type["Document"] = 9] = "Document";
        Type[Type["DocumentType"] = 10] = "DocumentType";
        Type[Type["Fragment"] = 11] = "Fragment";
    })(Type || (Type = {}));
    // FIXME it would be good to accept document as a param
    // so it would be possible to use something like jsdom
    const $doc = typeof process == 'undefined' ? window.document : {};
    const setElementAttrs = (el, attrs) => {
        const keys = Object.keys(attrs);
        for (let i = 0; i < keys.length; i++) {
            let k = keys[i];
            let v = attrs[k];
            if (k.slice(0, 2) === 'on')
                el.addEventListener(k.slice(2), v);
            else
                el.setAttribute(k, v);
        }
    };
    const buildNode = (ref, vnode) => {
        const dispatcher = {
            [Type$1.Component]: buildNodeComponent,
            [Type$1.Fragment]: buildNodeFragment,
            [Type$1.Raw]: buildNodeRaw,
            [Type$1.Tag]: buildNodeTag,
            [Type$1.Text]: buildNodeText
        };
        return dispatcher[vnode._fern_](ref, vnode);
    };
    const buildNodeComponent = (ref, vnode) => {
        vnode.instance = vnode.component(vnode.attrs, ref.redraw);
        vnode.children = [vnode.instance.view({ attrs: vnode.attrs, children: vnode.children })];
        vnode.node = buildNode(ref, vnode.children[0]);
        return vnode.node;
    };
    const buildNodeFragment = (ref, vnode) => {
        vnode.node = $doc.createDocumentFragment();
        for (let i = 0; i < vnode.children.length; i++) {
            vnode.node.appendChild(buildNode(ref, vnode.children[i]));
            vnode.children[i].parent = vnode.node;
        }
        return vnode.node;
    };
    const buildNodeRaw = (ref, vnode) => {
        return $doc.createDocumentFragment();
    };
    const buildNodeTag = (ref, vnode) => {
        vnode.node = $doc.createElement(vnode.item);
        // set attrs
        setElementAttrs(vnode.node, vnode.attrs);
        // children
        for (let i = 0; i < vnode.children.length; i++) {
            vnode.node.appendChild(buildNode(ref, vnode.children[i]));
            vnode.children[i].parent = vnode.node;
        }
        return vnode.node;
    };
    const buildNodeText = (ref, vnode) => {
        vnode.node = $doc.createTextNode(vnode.item);
        return vnode.node;
    };

    const diff = (ref, old, cur, index = 0) => {
        var _a, _b, _c, _d, _e, _f, _g;
        if (old._fern_ != cur._fern_) {
            if (((_a = old.node) === null || _a === void 0 ? void 0 : _a.nodeType) === Type.Fragment) {
                let oldChildren = Array.from((_b = old.parent) === null || _b === void 0 ? void 0 : _b.childNodes);
                old.parent && (old.parent.nodeValue = '');
                let curNode = oldChildren.slice(0, index).concat(buildNode(ref, cur), oldChildren.slice(index + old.children.length + 1));
                for (let i = 0; i < curNode.length; i++)
                    (_c = old.parent) === null || _c === void 0 ? void 0 : _c.appendChild(curNode[i]);
            }
            else {
                old.node.replaceWith(buildNode(ref, cur));
            }
            cur.parent = old.parent;
            return;
        }
        else {
            // Text
            if (cur._fern_ == Type$1.Text) {
                if (old.item != cur.item)
                    old.node.nodeValue = cur.item;
                cur.node = old.node;
                cur.parent = old.parent;
                return;
            }
            // Component
            else if (cur._fern_ == Type$1.Component) {
                // component is different, so create a new instance
                if (old.component != cur.component)
                    cur.instance = cur.component(cur.attrs, ref.redraw);
                else
                    cur.instance = old.instance;
                cur.children = [cur.instance.view({ attrs: cur.attrs, children: cur.children })];
            }
            // Tag
            else if (cur._fern_ == Type$1.Tag) {
                if (old.item != cur.item) {
                    old.node.replaceWith(buildNode(ref, cur));
                    return;
                }
            }
            // for vnodes that may have children ( components, fragments and tags )
            // diff the children and keep the dom reference
            const toDiff = Math.min(old.children.length, cur.children.length);
            // cur has more children, so insert them
            if (toDiff < cur.children.length) {
                for (let i = toDiff; i < cur.children.length; i++) {
                    (_d = old.parent) === null || _d === void 0 ? void 0 : _d.appendChild(buildNode(ref, cur.children[i]));
                    cur.children[i].parent = old.node;
                }
            }
            // old has more children, so remove them
            else if (toDiff < old.children.length) {
                for (let i = toDiff; i < old.children.length; i++) {
                    if (((_e = old.node) === null || _e === void 0 ? void 0 : _e.nodeType) === Type.Fragment)
                        (_f = old.parent) === null || _f === void 0 ? void 0 : _f.removeChild(old.children[i].node);
                    else
                        (_g = old.node) === null || _g === void 0 ? void 0 : _g.removeChild(old.children[i].node);
                }
            }
            // diff the number of children in common
            for (let i = 0; i < toDiff; i++)
                diff(ref, old.children[i], cur.children[i], i);
            cur.node = old.node;
            cur.parent = old.parent;
        }
    };

    const rAF = typeof requestAnimationFrame === 'undefined' ? (fn) => fn() : requestAnimationFrame;
    const mount = (root) => (component, attrs = EMPTY_OBJECT) => {
        const global = {
            redraw: () => { }
        };
        // if pending is true, a redraw is running
        let pending = false;
        // we start the old vnode as an empty fragment
        let oldVNode = fragment();
        // redraw
        global.redraw = () => {
            if (pending)
                return;
            pending = true;
            rAF(() => {
                const vnode = h(component, attrs);
                diff(global, oldVNode, vnode);
                oldVNode = vnode;
                pending = false;
            });
        };
        // first drawn
        rAF(() => {
            const vnode = h(component, attrs);
            buildNodeFragment(global, oldVNode);
            oldVNode.parent = root;
            root.nodeValue = '';
            diff(global, oldVNode, vnode);
            oldVNode = vnode;
        });
        return global.redraw;
    };

    exports.fragment = fragment;
    exports.h = h;
    exports.mount = mount;

}));
