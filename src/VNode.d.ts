import { Component, ComponentReturn } from './Component';
declare enum Type {
    Component = 1,
    Fragment = 2,
    Raw = 3,
    Tag = 4,
    Text = 5
}
declare type VNode = {
    _fern_: Type;
    attrs?: object;
    item?: string;
    component?: Component<any>;
    instance?: ComponentReturn;
    children?: Array<VNode>;
    node?: Node;
    parent?: Node;
};
declare const normalizeChildren: (children: Array<any>) => Array<VNode>;
export { Type, VNode, normalizeChildren };
