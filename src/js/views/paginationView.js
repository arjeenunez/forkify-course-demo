import View from './view';
import icons from '../../img/icons.svg';

class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');

    _generateMarkup() {
        const numPages = Math.ceil(
            this._data.results.length / this._data.resultsPerPage
        );
        const currPage = this._data.page;

        if (currPage === 1 && numPages > 1) {
            return `
            ${this._generateMarkupButtonRight(currPage)}
            `;
        }

        if (currPage === numPages) {
            return `
            ${this._generateMarkupButtonLeft(currPage)}
            `;
        }

        if (currPage < numPages) {
            return `
            ${this._generateMarkupButtonLeft(currPage)}
            ${this._generateMarkupButtonRight(currPage)}
            `;
        }

        return '';
    }

    _generateMarkupButtonRight(currPage) {
        return `
        <button data-goto=${
            currPage + 1
        } class="btn--inline pagination__btn--next">
            <span>Page ${currPage + 1}</span>
            <svg class="search__icon">
                <use href="${icons}.svg#icon-arrow-right"></use>
            </svg>
        </button>
        `;
    }

    _generateMarkupButtonLeft(currPage) {
        return `
            <button data-goto=${
                currPage - 1
            } class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                    <use href="${icons}.svg#icon-arrow-left"></use>
                </svg>
                <span>Page ${currPage - 1}</span>
            </button>
            `;
    }

    addHandler(handler) {
        this._parentElement.addEventListener('click', function (evt) {
            const btn = evt.target.closest('.btn--inline');
            if (!btn) return;
            const goToPage = +btn.dataset.goto;
            handler(goToPage);
        });
    }
}

export default new PaginationView();
