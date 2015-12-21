const DEFAULT_ATTRIBUTE = 'data-lazy-load';
const DEFAULT_SELECTOR = `[${DEFAULT_ATTRIBUTE}]`;

export function offset(el){
    let top = 0;
    let left = 0;

    while(el){
        left += el.offsetLeft;
        top += el.offsetTop;
        el = el.offsetParent;
    }

    return {left, top};
};

export default class LazyLoad {
    constructor(options = {}){
        let {
            selector = DEFAULT_SELECTOR,
            onImageLoaded = () => {},
            onScrollToImage = () => {},
            delay
        } = options;

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
            _window: window,
        });

        this._getAllElementOffsets();

        this._onScrollHandler = this._onScrollHandler.bind(this);
        this._onResizeHandler = this._onResizeHandler.bind(this);

        this._attachEvents();
    }

    _onResizeHandler(e){
        return this._getAllElementOffsets(e) && this._onScrollHandler(e);
    }

    _onScrollHandler(e){
        console.log('scroll')
        return this._scrollResizeHandler(e) && this._maybeRevealElements();
    }

    _attachEvents(){
        this._doc.addEventListener('scroll', this._onScrollHandler);
        this._doc.addEventListener('resize', this._onResizeHandler);
    }

    _getOffsetTop(document, element){
        let box = element.getBoundingClientRect();
        return box.top + document.scrollY;
    }

    _loadImage(image){
        // Return early if the image is already loading.
        let imageInfo = this._distances.get(image);
        if (!image || (imageInfo && imageInfo.isLoading))
            return;

        let loadedCallback = e => {
            image.removeEventListener('load', loadedCallback);
            this._distances.delete(image);
            this._onImageLoaded(image);

            if (this._distances.length === 0)
                this.destroy();
        };
        image.addEventListener('load', loadedCallback);
        image.setAttribute('src', image.getAttribute(DEFAULT_ATTRIBUTE));

        // Set the image as loading.
        this._distances.set(image, Object.assign({}, this._distances.get(image), {isLoading: true}));
        // Call scroll to callback.
        this._onScrollToImage(image);
    }

    _maybeRevealElements(e){
        Array.from(this._distances.keys()).forEach(image => (this._distanceScrolled >= this._distances.get(image).offsetTop) && this._loadImage(image));
    }

    _getAllElementOffsets(){
        this._distances = this._images.reduce((images, image) => {

            if (images.has(image) && !images.get(image).isLoading)
                return images;

            images.set(image, {
                offsetTop: offset(image).top,
                isLoading: false,
                timeOut: null
            });

            return images;
        }, this._distances || new Map());
        return true;
    }

    _getScrolledHeight(){
        return window.innerHeight + window.scrollY;
    }

    _scrollResizeHandler(e){
        let distance = this._getScrolledHeight();
        
        if (distance <= this._distanceScrolled) return;

        this._distanceScrolled = distance;

        return true;
    }

    destroy(){
        this._doc.removeEventListener('scroll', this._onScrollHandler);
        this._doc.removeEventListener('resize', this._onResizeHandler);
    }
}

