(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.offset = offset;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULT_ATTRIBUTES = {
    IMAGE_SELECTOR: '[data-lazy-load]',
    WIDTH: '[data-lazy-width]',
    HEIGHT: '[data-lazy-height]'
};

function offset(el) {
    var top = 0;
    var left = 0;

    while (el) {
        left += el.offsetLeft;
        top += el.offsetTop;
        el = el.offsetParent;
    }

    return { left: left, top: top };
};

var LazyLoad = (function () {
    function LazyLoad() {
        var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, LazyLoad);

        var _options$selector = options.selector;
        var selector = _options$selector === undefined ? DEFAULT_ATTRIBUTES.IMAGE_SELECTOR : _options$selector;
        var _options$onImageLoade = options.onImageLoaded;
        var onImageLoaded = _options$onImageLoade === undefined ? function () {} : _options$onImageLoade;
        var _options$onScrollToIm = options.onScrollToImage;
        var onScrollToImage = _options$onScrollToIm === undefined ? function () {} : _options$onScrollToIm;
        var delay = options.delay;

        Object.assign(this, {
            _delay: delay,
            _selector: selector,
            _images: Array.from(document.querySelectorAll(selector)),

            /**
             * Called when the image is loaded.
             * @type {Function}
             */
            _onImageLoaded: onImageLoaded,

            /**
             * Called when the image comes into the view port.
             * @type {Function}
             */
            _onScrollToImage: onScrollToImage,

            _distances: null,
            _distanceScrolled: 0,
            _doc: window.document,
            _window: window
        });

        this._getAllElementOffsets();

        this._onScrollHandler = this._onScrollHandler.bind(this);
        this._onResizeHandler = this._onResizeHandler.bind(this);

        this._attachEvents();
    }

    _createClass(LazyLoad, [{
        key: '_onResizeHandler',
        value: function _onResizeHandler(e) {
            return this._getAllElementOffsets(e) && this._onScrollHandler(e);
        }
    }, {
        key: '_onScrollHandler',
        value: function _onScrollHandler(e) {
            console.log('scroll');
            return this._scrollResizeHandler(e) && this._maybeRevealElements();
        }
    }, {
        key: '_attachEvents',
        value: function _attachEvents() {
            this._doc.addEventListener('scroll', this._onScrollHandler);
            this._doc.addEventListener('resize', this._onResizeHandler);
        }
    }, {
        key: '_getOffsetTop',
        value: function _getOffsetTop(document, element) {
            var box = element.getBoundingClientRect();
            return box.top + document.scrollY;
        }
    }, {
        key: '_loadImage',
        value: function _loadImage(image) {
            var _this = this;

            console.log('yep', image);
            // Return early if the image is already loading.
            if (this._distances.get(image).isLoading) return;

            var loadedCallback = function loadedCallback(e) {
                image.removeEventListener('load', loadedCallback);
                _this._distances.delete(image);
                _this._onImageLoaded(image);

                if (_this._distances.length === 0) _this.destroy();
            };
            image.addEventListener('load', loadedCallback);
            image.setAttribute('src', image.getAttribute(DEFAULT_SELECTOR));

            // Set the image as loading.
            this._distances.set(image, Object.assign({}, this._distances.get(image), { isLoading: true }));
            // Call scroll to callback.
            this._onScrollToImage(image);
        }
    }, {
        key: '_maybeRevealElements',
        value: function _maybeRevealElements(e) {
            var _this2 = this;

            this._distances.forEach(function (image) {
                return _this2._distanceScrolled >= image.offsetTop && _this2._loadImage(image);
            });
        }
    }, {
        key: '_getAllElementOffsets',
        value: function _getAllElementOffsets() {
            this._distances = this._images.reduce(function (images, image) {

                if (images.has(image) && !images.get(image).isLoading) return images;

                images.set(image, {
                    offsetTop: offset(image).top,
                    isLoading: false,
                    timeOut: null
                });

                return images;
            }, this._distances || new Map());
        }
    }, {
        key: '_getScrolledHeight',
        value: function _getScrolledHeight() {
            return window.innerHeight + window.scrollY;
        }
    }, {
        key: '_scrollResizeHandler',
        value: function _scrollResizeHandler(e) {
            var distance = this._getScrolledHeight();

            if (distance <= this._distanceScrolled) return;

            this._distanceScrolled = distance;
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this._doc.removeEventListener('scroll', this._onScrollHandler);
            this._doc.removeEventListener('resize', this._onResizeHandler);
        }
    }]);

    return LazyLoad;
})();

exports.default = LazyLoad;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7O1FDTWdCLE1BQU0sR0FBTixNQUFNOzs7O0FBTnRCLElBQU0sa0JBQWtCLEdBQUc7QUFDdkIsa0JBQWMsRUFBRSxrQkFBa0I7QUFDbEMsU0FBSyxFQUFFLG1CQUFtQjtBQUMxQixVQUFNLEVBQUUsb0JBQW9CO0NBQy9CLENBQUM7O0FBRUssU0FBUyxNQUFNLENBQUMsRUFBRSxFQUFDO0FBQ3RCLFFBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztBQUNaLFFBQUksSUFBSSxHQUFHLENBQUMsQ0FBQzs7QUFFYixXQUFNLEVBQUUsRUFBQztBQUNMLFlBQUksSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDO0FBQ3RCLFdBQUcsSUFBSSxFQUFFLENBQUMsU0FBUyxDQUFDO0FBQ3BCLFVBQUUsR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDO0tBQ3hCOztBQUVELFdBQU8sRUFBQyxJQUFJLEVBQUosSUFBSSxFQUFFLEdBQUcsRUFBSCxHQUFHLEVBQUMsQ0FBQztDQUN0QixDQUFDOztJQUVtQixRQUFRO0FBQ3pCLGFBRGlCLFFBQVEsR0FDQTtZQUFiLE9BQU8seURBQUcsRUFBRTs7OEJBRFAsUUFBUTs7Z0NBT2pCLE9BQU8sQ0FKUCxRQUFRO1lBQVIsUUFBUSxxQ0FBRyxrQkFBa0IsQ0FBQyxjQUFjO29DQUk1QyxPQUFPLENBSFAsYUFBYTtZQUFiLGFBQWEseUNBQUcsWUFBTSxFQUFFO29DQUd4QixPQUFPLENBRlAsZUFBZTtZQUFmLGVBQWUseUNBQUcsWUFBTSxFQUFFO1lBQzFCLEtBQUssR0FDTCxPQUFPLENBRFAsS0FBSzs7QUFHVCxjQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRTtBQUNoQixrQkFBTSxFQUFFLEtBQUs7QUFDYixxQkFBUyxFQUFFLFFBQVE7QUFDbkIs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Z0JBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1NBQ2xFOzs7V0FySGdCLFFBQVE7OztrQkFBUixRQUFRIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNvbnN0IERFRkFVTFRfQVRUUklCVVRFUyA9IHtcbiAgICBJTUFHRV9TRUxFQ1RPUjogJ1tkYXRhLWxhenktbG9hZF0nLFxuICAgIFdJRFRIOiAnW2RhdGEtbGF6eS13aWR0aF0nLFxuICAgIEhFSUdIVDogJ1tkYXRhLWxhenktaGVpZ2h0XScsXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gb2Zmc2V0KGVsKXtcbiAgICBsZXQgdG9wID0gMDtcbiAgICBsZXQgbGVmdCA9IDA7XG5cbiAgICB3aGlsZShlbCl7XG4gICAgICAgIGxlZnQgKz0gZWwub2Zmc2V0TGVmdDtcbiAgICAgICAgdG9wICs9IGVsLm9mZnNldFRvcDtcbiAgICAgICAgZWwgPSBlbC5vZmZzZXRQYXJlbnQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtsZWZ0LCB0b3B9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGF6eUxvYWQge1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSl7XG4gICAgICAgIGxldCB7XG4gICAgICAgICAgICBzZWxlY3RvciA9IERFRkFVTFRfQVRUUklCVVRFUy5JTUFHRV9TRUxFQ1RPUixcbiAgICAgICAgICAgIG9uSW1hZ2VMb2FkZWQgPSAoKSA9PiB7fSxcbiAgICAgICAgICAgIG9uU2Nyb2xsVG9JbWFnZSA9ICgpID0+IHt9LFxuICAgICAgICAgICAgZGVsYXlcbiAgICAgICAgfSA9IG9wdGlvbnM7XG5cbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7XG4gICAgICAgICAgICBfZGVsYXk6IGRlbGF5LFxuICAgICAgICAgICAgX3NlbGVjdG9yOiBzZWxlY3RvcixcbiAgICAgICAgICAgIF9pbWFnZXM6IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpLFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIENhbGxlZCB3aGVuIHRoZSBpbWFnZSBpcyBsb2FkZWQuXG4gICAgICAgICAgICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIF9vbkltYWdlTG9hZGVkOiBvbkltYWdlTG9hZGVkLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIENhbGxlZCB3aGVuIHRoZSBpbWFnZSBjb21lcyBpbnRvIHRoZSB2aWV3IHBvcnQuXG4gICAgICAgICAgICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIF9vblNjcm9sbFRvSW1hZ2U6IG9uU2Nyb2xsVG9JbWFnZSxcblxuICAgICAgICAgICAgX2Rpc3RhbmNlczogbnVsbCxcbiAgICAgICAgICAgIF9kaXN0YW5jZVNjcm9sbGVkOiAwLFxuICAgICAgICAgICAgX2RvYzogd2luZG93LmRvY3VtZW50LFxuICAgICAgICAgICAgX3dpbmRvdzogd2luZG93LFxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9nZXRBbGxFbGVtZW50T2Zmc2V0cygpO1xuXG4gICAgICAgIHRoaXMuX29uU2Nyb2xsSGFuZGxlciA9IHRoaXMuX29uU2Nyb2xsSGFuZGxlci5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLl9vblJlc2l6ZUhhbmRsZXIgPSB0aGlzLl9vblJlc2l6ZUhhbmRsZXIuYmluZCh0aGlzKTtcblxuICAgICAgICB0aGlzLl9hdHRhY2hFdmVudHMoKTtcbiAgICB9XG5cbiAgICBfb25SZXNpemVIYW5kbGVyKGUpe1xuICAgICAgICByZXR1cm4gdGhpcy5fZ2V0QWxsRWxlbWVudE9mZnNldHMoZSkgJiYgdGhpcy5fb25TY3JvbGxIYW5kbGVyKGUpO1xuICAgIH1cblxuICAgIF9vblNjcm9sbEhhbmRsZXIoZSl7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzY3JvbGwnKVxuICAgICAgICByZXR1cm4gdGhpcy5fc2Nyb2xsUmVzaXplSGFuZGxlcihlKSAmJiB0aGlzLl9tYXliZVJldmVhbEVsZW1lbnRzKCk7XG4gICAgfVxuXG4gICAgX2F0dGFjaEV2ZW50cygpe1xuICAgICAgICB0aGlzLl9kb2MuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5fb25TY3JvbGxIYW5kbGVyKTtcbiAgICAgICAgdGhpcy5fZG9jLmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX29uUmVzaXplSGFuZGxlcik7XG4gICAgfVxuXG4gICAgX2dldE9mZnNldFRvcChkb2N1bWVudCwgZWxlbWVudCl7XG4gICAgICAgIGxldCBib3ggPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICByZXR1cm4gYm94LnRvcCArIGRvY3VtZW50LnNjcm9sbFk7XG4gICAgfVxuXG4gICAgX2xvYWRJbWFnZShpbWFnZSl7XG4gICAgICAgIGNvbnNvbGUubG9nKCd5ZXAnLCBpbWFnZSk7XG4gICAgICAgIC8vIFJldHVybiBlYXJseSBpZiB0aGUgaW1hZ2UgaXMgYWxyZWFkeSBsb2FkaW5nLlxuICAgICAgICBpZiAodGhpcy5fZGlzdGFuY2VzLmdldChpbWFnZSkuaXNMb2FkaW5nKSBcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBsZXQgbG9hZGVkQ2FsbGJhY2sgPSBlID0+IHtcbiAgICAgICAgICAgIGltYWdlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBsb2FkZWRDYWxsYmFjayk7XG4gICAgICAgICAgICB0aGlzLl9kaXN0YW5jZXMuZGVsZXRlKGltYWdlKTtcbiAgICAgICAgICAgIHRoaXMuX29uSW1hZ2VMb2FkZWQoaW1hZ2UpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5fZGlzdGFuY2VzLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgICAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICAgICAgfTtcbiAgICAgICAgaW1hZ2UuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGxvYWRlZENhbGxiYWNrKTtcbiAgICAgICAgaW1hZ2Uuc2V0QXR0cmlidXRlKCdzcmMnLCBpbWFnZS5nZXRBdHRyaWJ1dGUoREVGQVVMVF9TRUxFQ1RPUikpO1xuXG4gICAgICAgIC8vIFNldCB0aGUgaW1hZ2UgYXMgbG9hZGluZy5cbiAgICAgICAgdGhpcy5fZGlzdGFuY2VzLnNldChpbWFnZSwgT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5fZGlzdGFuY2VzLmdldChpbWFnZSksIHtpc0xvYWRpbmc6IHRydWV9KSk7XG4gICAgICAgIC8vIENhbGwgc2Nyb2xsIHRvIGNhbGxiYWNrLlxuICAgICAgICB0aGlzLl9vblNjcm9sbFRvSW1hZ2UoaW1hZ2UpO1xuICAgIH1cblxuICAgIF9tYXliZVJldmVhbEVsZW1lbnRzKGUpe1xuICAgICAgICB0aGlzLl9kaXN0YW5jZXMuZm9yRWFjaChpbWFnZSA9PiAodGhpcy5fZGlzdGFuY2VTY3JvbGxlZCA+PSBpbWFnZS5vZmZzZXRUb3ApICYmIHRoaXMuX2xvYWRJbWFnZShpbWFnZSkpO1xuICAgIH1cblxuICAgIF9nZXRBbGxFbGVtZW50T2Zmc2V0cygpe1xuICAgICAgICB0aGlzLl9kaXN0YW5jZXMgPSB0aGlzLl9pbWFnZXMucmVkdWNlKChpbWFnZXMsIGltYWdlKSA9PiB7XG5cbiAgICAgICAgICAgIGlmIChpbWFnZXMuaGFzKGltYWdlKSAmJiAhaW1hZ2VzLmdldChpbWFnZSkuaXNMb2FkaW5nKVxuICAgICAgICAgICAgICAgIHJldHVybiBpbWFnZXM7XG5cbiAgICAgICAgICAgIGltYWdlcy5zZXQoaW1hZ2UsIHtcbiAgICAgICAgICAgICAgICBvZmZzZXRUb3A6IG9mZnNldChpbWFnZSkudG9wLFxuICAgICAgICAgICAgICAgIGlzTG9hZGluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgdGltZU91dDogbnVsbFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBpbWFnZXM7XG4gICAgICAgIH0sIHRoaXMuX2Rpc3RhbmNlcyB8fCBuZXcgTWFwKCkpO1xuICAgIH1cblxuICAgIF9nZXRTY3JvbGxlZEhlaWdodCgpe1xuICAgICAgICByZXR1cm4gd2luZG93LmlubmVySGVpZ2h0ICsgd2luZG93LnNjcm9sbFk7XG4gICAgfVxuXG4gICAgX3Njcm9sbFJlc2l6ZUhhbmRsZXIoZSl7XG4gICAgICAgIGxldCBkaXN0YW5jZSA9IHRoaXMuX2dldFNjcm9sbGVkSGVpZ2h0KCk7XG4gICAgICAgIFxuICAgICAgICBpZiAoZGlzdGFuY2UgPD0gdGhpcy5fZGlzdGFuY2VTY3JvbGxlZCkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuX2Rpc3RhbmNlU2Nyb2xsZWQgPSBkaXN0YW5jZTtcbiAgICB9XG5cbiAgICBkZXN0cm95KCl7XG4gICAgICAgIHRoaXMuX2RvYy5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLl9vblNjcm9sbEhhbmRsZXIpO1xuICAgICAgICB0aGlzLl9kb2MucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fb25SZXNpemVIYW5kbGVyKTtcbiAgICB9XG59XG5cbiJdfQ==
