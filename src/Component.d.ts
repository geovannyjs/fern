import { Redraw } from './mount';
import { VNode } from './VNode';
declare type Attrs<T extends object> = T;
declare type ComponentLifeCycleMethods = {
    created?: () => any;
    delayRemove?: () => any;
    removed?: () => any;
    shouldUpdate?: () => boolean;
    updated?: () => any;
};
declare type ComponentViewMethod = {
    view: ({ attrs, children }: {
        attrs: object;
        children: Array<any>;
    }) => VNode;
};
declare type ComponentReturn = ComponentLifeCycleMethods & ComponentViewMethod;
declare type Component<T extends object> = (attrs: Attrs<T>, redraw: Redraw) => ComponentReturn;
export { Component, ComponentReturn };
