import { Component } from './Component';
declare type Redraw = () => void;
declare type GlobalRef = {
    redraw: Redraw;
};
declare const mount: (root: Element) => (component: Component<any>, attrs?: object) => Redraw;
export { GlobalRef, Redraw, mount };
