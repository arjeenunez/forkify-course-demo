'use strict';
import { API_KEY, API_URL, REC_PER_PAGE } from './config';
import { AJAXrequest } from './helpers';

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: REC_PER_PAGE,
    },
    bookmarks: [],
};

const createRecipeObject = function (data) {
    const { recipe } = data.data;
    return {
        ...recipe,
        source: recipe.source_url,
        image: recipe.image_url,
        cookingTime: recipe.cooking_time,
    };
};

export const loadRecipe = async hashId => {
    try {
        const data = await AJAXrequest(`${API_URL}${hashId}?key=${API_KEY}`);
        state.recipe = createRecipeObject(data);

        if (state.bookmarks.some(bookmark => bookmark.id === hashId)) {
            state.recipe.bookmarked = true;
        } else state.recipe.bookmarked = false;
    } catch (err) {
        throw err;
    }
};

export const loadSearchResults = async query => {
    try {
        state.search.query = query;
        const data = await AJAXrequest(
            `${API_URL}?search=${query}&key=${API_KEY}`
        );
        state.search.results = data.data.recipes.map(rec => {
            return { ...rec, image: rec.image_url };
        });
        state.search.page = 1;
    } catch (err) {
        throw err;
    }
};

export const getSearchResultsPage = function (page = 1) {
    state.search.page = page;
    const start = (page - 1) * state.search.resultsPerPage;
    const end = page * state.search.resultsPerPage;

    return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    });
    state.recipe.servings = newServings;
};

const persistBookmarks = function () {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
    state.bookmarks.push(recipe);
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
    persistBookmarks();
};

export const deleteBookmark = function (id) {
    state.bookmarks = state.bookmarks.filter(bookmark => bookmark !== id);
    if (id === state.recipe.id) state.recipe.bookmarked = false;
    persistBookmarks();
};

const init = function () {
    const storage = localStorage.getItem('bookmarks');
    if (storage) state.bookmarks = JSON.parse(storage);
};
init();

const clearBookmarks = function () {
    localStorage.clear('bookmarks');
};

//prettier-ignore
export const uploadRecipe = async newRecipe => {
    try {
        const ingredients = Object
            .entries(newRecipe)
            .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== "")
            .map(ing => {
                const ingArr = ing[1].split(",").map(el => el.trim());
                if (ingArr.length !== 3) throw new Error("Wrong ingredient format! Please use the correct format!");
                const [quantity, unit, description] = ingArr;
                return { quantity: quantity ? +quantity : null, unit, description };
            });
        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,
        };
        const data = await AJAXrequest(`${API_URL}?key=${API_KEY}`, recipe);
        state.recipe = createRecipeObject(data);
        addBookmark(state.recipe);
    } catch (err) {
        throw err;
    }
};

//7d5a6119-fe54-49ac-8f0e-21aa91cd9517
