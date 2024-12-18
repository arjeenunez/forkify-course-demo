import icons from '../../img/icons.svg';

export default class View {
    _data;

    _clearParent() {
        this._parentElement.innerHTML = '';
    }

    _clearElem(elem) {
        elem.value = '';
    }

    _addToParent(markup) {
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    /**
     * Render the received object to the DOM
     * @param {Object | Object[]} data The data to be rendered
     * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
     * @returns (undefined | string) A markup is returned if render=false
     * @this (Object) View instance
     * @author Jonas Schmedtmann
     * @todo Finish implementation
     */
    render(data, render = true) {
        if (!data || (Array.isArray(data) && data.length === 0))
            return this.renderError();
        this._data = data;
        const markup = this._generateMarkup();

        if (!render) return markup;

        this._clearParent();
        this._addToParent(markup);
    }

    update(data) {
        this._data = data;
        const newMarkup = this._generateMarkup();
        const newDOM = document
            .createRange()
            .createContextualFragment(newMarkup);
        const newElements = Array.from(newDOM.querySelectorAll('*'));
        const currElements = Array.from(
            this._parentElement.querySelectorAll('*')
        );
        newElements.forEach((newEl, i) => {
            const currEl = currElements[i];
            if (
                !newEl.isEqualNode(currEl) &&
                newEl.firstChild?.nodeValue.trim() !== ''
            ) {
                currEl.textContent = newEl.textContent;
            }

            if (!newEl.isEqualNode(currEl)) {
                [...newEl.attributes].forEach(attr => {
                    currEl.setAttribute(attr.name, attr.value);
                });
            }
        });
    }

    renderError(errorMessage = this._errorMessage) {
        const markup = `
        <div class="error">
            <div>
              <svg>
                <use href="${icons}.svg#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${errorMessage}</p>
        </div>`;
        this._clearParent();
        this._addToParent(markup);
    }

    renderMessage(message = this._message) {
        const markup = `
        <div class="error">
            <div>
              <svg>
                <use href="${icons}.svg#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
        </div>`;
        this._clearParent();
        this._addToParent(markup);
    }

    renderSpinner() {
        const markup = `
            <div class="spinner">
                <svg>
                    <use href="${icons}#icon-loader"></use>
                </svg>
            </div>
        `;
        this._clearParent();
        this._addToParent(markup);
    }

    //prettier-ignore
}
