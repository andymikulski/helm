var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'core/base'], function(require, exports, Base) {
    
    var MoreInfo = (function (_super) {
        __extends(MoreInfo, _super);
        function MoreInfo(_el) {
            _super.call(this, _el);
            this.log('MoreInfo : Constructor');
        }
        return MoreInfo;
    })(Base.Widget);
    return MoreInfo;
});
