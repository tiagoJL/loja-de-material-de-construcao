function getElement(cssSelector) {
    return document.querySelector(cssSelector)
}

function getAllElement(cssSelector) {
    return document.querySelectorAll(cssSelector)
}


export default class Slide {
    constructor(autoPlay=true, controlsButtons=true, autoPlayTimeDefault=5000){
        this.autoPlay = autoPlay
        this.controlsButtons = controlsButtons
        this.autoPlayTimeDefault = autoPlayTimeDefault
        this.loadingDefaultCssSelector()
        this.captureMainElements()
        this.createSlideLoading()
        this.createControlsButtons()
        this.init()
    }

    captureMainElements(){
        this.slideWrapper = getElement(this.slideWrapperCssSelector)
        this.slideListWrapper = getElement(this.slideListWrapperCssSelector)
        this.slideNavButtonsWrapper = getElement(this.slideNavButtonsWrapperCssSelector)
        this.slideNavButtonPrev = getElement(this.slideNavButtonPrevCssSelector)
        this.slideNavButtonNext = getElement(this.slideNavButtonNextCssSelector)
        this.slideItems = getAllElement(this.slideItemCssSelector)
    }

    next(){
        const currentIndex = this.getCurrentActiveIndex()
        const condition = currentIndex + 1 <= this.slideItems.length -1
        const nextIndex = condition ? currentIndex + 1: 0
        this.configClassActiveSlideIndexOnAllAvailableElements(currentIndex, "remove")
        this.configClassActiveSlideIndexOnAllAvailableElements(nextIndex, "add")
    }
    prev(){
        const currentIndex = this.getCurrentActiveIndex()
        const condition = currentIndex - 1 >= 0
        const prevIndex = condition ? currentIndex - 1: this.slideItems.length -1
        this.configClassActiveSlideIndexOnAllAvailableElements(currentIndex, "remove")
        this.configClassActiveSlideIndexOnAllAvailableElements(prevIndex, "add")
    }

    createControlsButtons(){
        if (this.controlsButtons) {
            let parentElement = this.slideControlsButtonWrapperParentElement
            let childrenElement = this.slideControlsButtonChildrenElement
            let parentElementCss = this.slideControlsButtonWrapperCssSelector
            let childrenElementCss = this.slideControlsButtonCssSelector
            this.createParentChildrenOnSlideWrapper(
                parentElement=parentElement,
                childrenElement=childrenElement,
                parentElementCss=parentElementCss,
                childrenElementCss=childrenElementCss
                )
            this.controlsButtonsElements = getAllElement(childrenElementCss)
        }
    }

    createSlideLoading(){
        if (this.autoPlay) {
            let parentElement = this.slideLoadingWrapperElement
            let childrenElement = this.slideLoadingChildrenElement
            let parentElementCss = this.slideLoadingWrapperCssSelector
            let childrenElementCss = this.slideLoadingCssSelector
            this.createParentChildrenOnSlideWrapper(
                parentElement=parentElement,
                childrenElement=childrenElement,
                parentElementCss=parentElementCss,
                childrenElementCss=childrenElementCss
                )
            }
        }
        
    loadingDefaultCssSelector(){
        this.slideItemCssSelector = ".slide-item"
        this.slideWrapperCssSelector = ".slide-wrapper"
        this.slideNavButtonsWrapperCssSelector = ".slide-nav-buttons-wrapper"
        this.slideListWrapperCssSelector = ".slide-list-wrapper"
        this.slideNavButtonPrevCssSelector = ".slide-nav-button-prev"
        this.slideNavButtonNextCssSelector = ".slide-nav-button-next"
        this.defaultIndexCssSelector = ".active-slide-index"
        if (this.autoPlay){
            this.slideLoadingWrapperCssSelector = ".slide-loading-wrapper"
            this.slideLoadingCssSelector = ".slide-loading"
            this.slideLoadingWrapperElement = "div"
            this.slideLoadingChildrenElement = "span"
        }
        if (this.controlsButtons){
            this.slideControlsButtonWrapperCssSelector = ".slide-controls-button-wrapper"
            this.slideControlsButtonCssSelector = ".slide-controls-button"
            this.slideControlsButtonWrapperParentElement = "div"
            this.slideControlsButtonChildrenElement = "button"
        }
    }

    createParentChildrenOnSlideWrapper(parentElement="div", childrenElement="span", parentElementCss, childrenElementCss){
        const parentElementHtml = `<${parentElement} class=${parentElementCss}></${parentElement}>`

        if (!getElement(parentElementCss)){
            this.slideWrapper.insertAdjacentHTML("afterbegin", parentElementHtml.replace(".", ""))
        }

        const parent = getElement(parentElementCss)
        const numberOfItems = this.slideItems.length - 1
        let initial =  getAllElement(childrenElementCss).length
        let final = numberOfItems > -1 ? numberOfItems: 0
        for (initial; initial <= final; initial++) {
            let childrenElementHtml = `<${childrenElement} class=${childrenElementCss.replace(".", "")} data-index=${initial}></${childrenElement}>`
            parent.insertAdjacentHTML("beforeend", childrenElementHtml)
        }
    }

    getCurrentActiveIndex(){
        return +getElement(this.defaultIndexCssSelector).dataset.index
    }
    
    configIndexClass(defaultConfig="add", element=null){

        if (defaultConfig == "add") {
            element.classList.add(this.defaultIndexCssSelector.replace(".", ""))
            return
        }
        element.classList.remove(this.defaultIndexCssSelector.replace(".", ""))
    }

    constrolsGoTo(index){
        const currentIndex = this.getCurrentActiveIndex()
        this.configClassActiveSlideIndexOnAllAvailableElements(currentIndex, "remove")
        this.configClassActiveSlideIndexOnAllAvailableElements(index, "add")
    }


    configClassActiveSlideIndexOnAllAvailableElements(index=0, config="add"){
        const cssItem = `${this.slideItemCssSelector}[data-index="${index}"]`
        const item = getElement(cssItem)

        this.configIndexClass(config, item)

        if (this.autoPlay) {
            const cssSlideLoading = `${this.slideLoadingCssSelector}[data-index="${index}"]`
            const slideLoading = getElement(cssSlideLoading)
            this.configIndexClass(config, slideLoading)
        }

        if (this.autoPlay && config == "add"){
            clearTimeout(this.timout)
            this.timout = setTimeout(this.next, this.autoPlayTimeDefault)
        }

        if (this.controlsButtons){
            const cssSlideControlsButton = `${this.slideControlsButtonCssSelector}[data-index="${index}"]`
            const slideControlsButton = getElement(cssSlideControlsButton)
            this.configIndexClass(config, slideControlsButton)
        }
    }

    init(){
        this.prev = this.prev.bind(this)
        this.next = this.next.bind(this)
        this.constrolsGoTo = this.constrolsGoTo.bind(this)
        this.slideNavButtonPrev.addEventListener("click", this.prev)
        this.slideNavButtonNext.addEventListener("click", this.next)
        this.configClassActiveSlideIndexOnAllAvailableElements()
        if (this.controlsButtons){
            this.controlsButtonsElements.forEach(button => {
                button.addEventListener("click", (event) => {
                    const goToIndex = event.currentTarget.dataset.index
                    this.constrolsGoTo(goToIndex)
                })})
            }
    }
}