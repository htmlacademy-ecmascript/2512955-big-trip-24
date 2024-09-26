import { remove, render, RenderPosition, replace } from '../framework/render';
import { ModelActions } from '../service/actions';
import Presenter from '../shared/presenter';
import EventsSortFormView from '../view/events-sort-form-view/events-sort-form-view';

export default class SortPresenter extends Presenter {
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
  constructor({ sortModel, previousElement, ...presenterParams }) {
    super(presenterParams);
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
 * @typedef { import('../shared/presenter').PresenterConstructorParams } BasePresenterParams
 */

/**
 * @typedef { Object } PresenterAdditionalParams
 * @property { SorModel } PresenterAdditionalParams.sortModel
 * @property { HTMLElement } PresenterAdditionalParams.previousElement
 */

/**
 * @typedef { BasePresenterParams & PresenterAdditionalParams } PresenterParams
 */
