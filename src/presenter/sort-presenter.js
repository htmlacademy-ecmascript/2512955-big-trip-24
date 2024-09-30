import { remove, render, RenderPosition, replace } from '../framework/render';
import { ModelActions } from '../service/actions';
import EventsSortFormView from '../view/events-sort-form-view/events-sort-form-view';

export default class SortPresenter {
  /**
   * @type { EventsSortFormView }
   */
  #sortView = null;

  /**
   * @type { HTMLElement }
   */
  #previousElement = null;

  /**
   * @type { SorModel }
   */
  #sortModel = null;

  /**
   * @param { PresenterParams } params
   */
  constructor({ sortModel, previousElement }) {
    this.#previousElement = previousElement;
    this.#sortModel = sortModel;
    this.#sortModel.addObserver(this.#handleSortModelActions);
  }

  #handleSortModelActions = (actionType) => {
    switch(actionType) {
      case ModelActions.PATCH:
      case ModelActions.MINOR_UPDATE:
      case ModelActions.MAJOR_UPDATE: {
        this.init();
      }
    }
  };

  #sortChangeHandler = (newSortType) => {
    this.#sortModel.changeSort(ModelActions.MINOR_UPDATE, newSortType);
  };

  #renderSortView() {
    const newSortView = new EventsSortFormView({
      onSortingChangeCallback: this.#sortChangeHandler,
      activeSortType: this.#sortModel.sortType
    });

    if (this.#sortView) {
      replace(newSortView, this.#sortView);
      remove(this.#sortView);
    } else {
      render(newSortView, this.#previousElement, RenderPosition.AFTEREND);
    }

    this.#sortView = newSortView;
  }

  destroy() {
    if (this.#sortView) {
      remove(this.#sortView);
      this.#sortView = null;
    }
  }

  init() {
    this.#renderSortView();
  }
}

/**
 * @typedef { import('../model/sort-model').default } SorModel
 */

/**
 * @typedef { import('../config/sorting-types').SortingTypes } SortingTypes
 */

/**
 * @typedef { Object } PresenterParams
 * @property { SorModel } PresenterAdditionalParams.sortModel
 * @property { HTMLElement } PresenterAdditionalParams.previousElement
 */
