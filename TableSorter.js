/**
 * tableSorter class to sort table html element in visual inventory
 *
 * In Progress....
 */

(function() {
    function getCellText(cell) {
        return cell.textContent || cell.innerText;
    }

    window.tableSorter = function () {
        this.options = {
            element:null, //table element
            /**
             * Comparison function use for the sort function
             * @param a the first item to compare
             * @param b the second item to compare
             * @param columnIndex the number of the column that is currently sorted
             * @return {Number}
             */
            compareFunction:function (a, b, columnIndex, asc) {
                if(isNaN(parseInt(a))) {
                    return asc ?
                                (a < b ? -1 : 1) :
                                (a < b ? 1 : -1);
                } else {
                    return asc ?
                                parseFloat(a)-parseFloat(b) :
                                parseFloat(b)-parseFloat(a);
                }
            }
        };

        this.init.apply(this, arguments);
    };

    tableSorter.prototype = {
        constructor:tableSorter.prototype.constructor,

        init:function (options) {
            $.extend(this.options, options);
            this.element = $(this.options.element);

            this.thead = this.element[0].tHead;
            this.tbody = this.element[0].tBodies[0];

            this.addEvents();
        },

        addEvents:function () {
            var _this = this;


            $.each(this.thead.rows[0].cells, function (index, cell) {
                $(cell).click(function () {
                    var direction = $(this).attr('direction');
                    if(direction===undefined) direction = -1;
                    direction = direction == 1 ? -1 : 1;
                    $(this).attr('direction', direction);
                    _this.sortColumn(index, direction);
                });
            });
        },

        /**
         * Sort the column by using Array.sort method on dom element, after dom element are sorted
         * appendChild each of the row into its parent.
         * The callback of sort is this.options.compareFunction.
         * @param columnIndex
         */
        sortColumn:function (columnIndex, direction) {
            var _this = this;
            // make an array of rows and sort it by using compare function
            var sortFunc = function (a, b) {
                return _this.options.compareFunction(getCellText(a.cells[columnIndex]), getCellText(b.cells[columnIndex]), columnIndex, direction===1);
            };
            var rows = Array.prototype.slice.call(this.tbody.rows,0).sort(sortFunc).sort(sortFunc);

            for (var i = 0; i < rows.length; i++) {
                this.tbody.appendChild(rows[i]);
            }
        }
    };
})();

