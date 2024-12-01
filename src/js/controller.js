'use strict';
import AppError from './AppError';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { MODAL_SECS } from './config.js';

if (module.hot) module.hot.accept();

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipe = async () => {
    const hashId = window.location.hash.slice(1);
    if (!hashId) return;
    try {
        recipeView.renderSpinner();
        resultsView.update(model.getSearchResultsPage());
        bookmarksView.update(model.state.bookmarks);
        await model.loadRecipe(hashId);
        recipeView.render(model.state.recipe);
    } catch (err) {
        console.error(err);
        recipeView.renderError(err.message);
    }
};

const controlSearchResults = async () => {
    try {
        const query = searchView.getQuery();
        if (!query) return;
        resultsView.renderSpinner();
        await model.loadSearchResults(query);
        resultsView.render(model.getSearchResultsPage());
        paginationView.render(model.state.search);
    } catch (err) {
        console.error(err);
    }
};

const controlPagination = function (goToPage) {
    resultsView.render(model.getSearchResultsPage(goToPage));
    paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
    model.updateServings(newServings);
    recipeView.update(model.state.recipe);
};

//prettier-ignore
const controlAddBookmark = function () {

    if (!model.state.recipe.bookmarked) {
        model.addBookmark(model.state.recipe)
    } else model.deleteBookmark(model.state.recipe.id);

    recipeView.update(model.state.recipe);

    bookmarksView.render(model.state.bookmarks)
};

const controlBookmarks = () => {
    bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async newRecipe => {
    try {
        addRecipeView.renderSpinner();
        await model.uploadRecipe(newRecipe);
        recipeView.render(model.state.recipe);
        addRecipeView.renderMessage();
        bookmarksView.render(model.state.bookmarks);
        // History pushState helps change the URL. History can also be used to move back and forth between urls.
        window.history.pushState(null, '', `#${model.state.recipe.id}`);
        setTimeout(() => addRecipeView.toggleWindow(), MODAL_SECS * 1000);
    } catch (err) {
        addRecipeView.renderError(err.message);
    }
};

const init = () => {
    bookmarksView.addHandlerRender(controlBookmarks);
    recipeView.addHandler(controlRecipe);
    recipeView.addHandlerServing(controlServings);
    recipeView.addHandlerBookmark(controlAddBookmark);
    searchView.addHandler(controlSearchResults);
    paginationView.addHandler(controlPagination);
    addRecipeView._addHandlerUpload(controlAddRecipe);
};
init();
