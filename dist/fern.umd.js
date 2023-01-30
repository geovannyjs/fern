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
        if (node._fern_)
            return node;
        if (Array.isArray(node))
            return { _fern_: Type.Fragment, children: normalizeChildren(node) };
        return { _fern_: Type.Text, item: String(node) };
    };
    const normalizeChildren = (children) => {
        for (let i = 0; i < children.length; i++) {
            if (children[i] == null)
                children.splice(i, 1);
            else
                children[i] = normalize(children[i]);
        }
        return children;
    };

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

    exports.h = h;

}));
