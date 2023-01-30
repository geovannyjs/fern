import { Component } from './Component';
import { VNode } from './VNode';
declare const fragment: (...nodes: Array<any>) => VNode;
declare function h(itemOrComponent: string | Component<any>, a: object | null, ...children: Array<any>): VNode;
declare const trust: (html?: string) => VNode;
export { fragment, h, trust };
