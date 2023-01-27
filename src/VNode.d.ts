declare enum Type {
    Component = 0,
    Fragment = 1,
    Raw = 2,
    Tag = 3,
    Text = 4
}
declare type VNode = {
    type: Type;
    tag?: string;
    content?: string;
    children: Array<VNode>;
};
export { Type, VNode };
