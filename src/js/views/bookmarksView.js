import View from './view';
import icons from '../../img/icons.svg';
import previewView from './previewView';

class BookmarksView extends View {
    _parentElement = document.querySelector('.bookmarks__list');
    _errorMessage = 'No bookmarks yet, please find a recipe and bookmark it.';
    _message = '';

    addHandlerRender(handler) {
        window.addEventListener('load', handler);
    }

    _generateMarkup() {
        console.log(this._data);
        return this._data
            .map(bookmark => previewView.render(bookmark, false))
            .join('');
    }
}

export default new BookmarksView();
