/**
 * Created by stef on 17.11.15.
 */
'use strict';
/** @jsx h */

var h = fern.h;
var {Store} = require('./store');

var Row = function (attrs) {
            var click = function() {
                attrs.onclick(attrs.id);
            };
            var deleteFn = function() {
                console.log(attrs.id);
                attrs.ondelete(attrs.id);
            };
    return {
        view: function({ attrs }) {
            return (<tr class={attrs.styleClass}>
                <td class="col-md-1">{attrs.id}</td>
                <td class="col-md-4">
                    <a onclick={click}>{attrs.label}</a>
                </td>
                <td class="col-md-1"><a onclick={deleteFn}><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>
                <td class="col-md-6"></td>
            </tr>);
        }
    }
};

var Controller = function (attrs, redraw) {
            var data = function() { return Store.data;};
            var selected = function() { return Store.selected;};
            var run = function() {
                Store.run();
                redraw();
            };
            var add = function() {
                Store.add();
                redraw();
            };
            var update = function() {
                Store.update();
                redraw();
            };
            var select = function(id) {
                Store.select(id);
                redraw();
            };
            var deleteFn = function(id) {
                Store.remove(id);
                redraw();
            };
            var runLots = function() {
                Store.runLots();
                redraw();
            };
            var clear = function() {
                Store.clear();
                redraw();
            };
            var swapRows = function() {
                Store.swapRows();
                redraw();
            };
    return {
    view: function({ attrs }) {
        let rows = data().map((d,i) => {
            let sel = d.id === selected() ? 'danger':'';
            return h(Row, {onclick:select, ondelete:deleteFn, key:d.id, label:d.label, id:d.id, styleClass:sel});
// this doesn't work here return (<Row onclick={this.select} onremove={this.remove} key={d.id} label={d.label} id={d.id} styleClass={sel}></Row>);
        });
        var ret = <div class="container" onupdate={this.done}>
            <div class="jumbotron">
                <div class="row">
                    <div class="col-md-6">
                        <h1>Fern v0.0.1</h1>
                    </div>
                    <div class="col-md-6">
                        <div class="col-sm-6 smallpad">
                            <button type="button" class="btn btn-primary btn-block" id="run" onclick={run}>Create 1,000 rows</button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button type="button" class="btn btn-primary btn-block" id="runlots" onclick={runLots}>Create 10,000 rows</button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button type="button" class="btn btn-primary btn-block" id="add" onclick={add}>Append 1,000 rows</button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button type="button" class="btn btn-primary btn-block" id="update" onclick={update}>Update every 10th row</button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button type="button" class="btn btn-primary btn-block" id="clear" onclick={clear}>Clear</button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button type="button" class="btn btn-primary btn-block" id="swaprows" onclick={swapRows}>Swap Rows</button>
                        </div>
                    </div>
                </div>
            </div>
            <table class="table table-hover table-striped test-data">
                <tbody class="">
                {rows}
                </tbody>
            </table>
            <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
        </div>;
        return ret;
    }
    }
};

export { Controller };
