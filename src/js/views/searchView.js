import View from './view';

class SearchView extends View {
    _parentElement = document.querySelector('.search');
    inputElement = this._parentElement.querySelector('.search__field');

    getQuery() {
        const query = this.inputElement.value;
        this._clearElem(this.inputElement);
        return query;
    }

    addHandler(handler) {
        this._parentElement.addEventListener('submit', function (evt) {
            evt.preventDefault();
            handler();
        });
    }
}

export default new SearchView();
