import Presenter from '../shared/presenter';
import EventsFilterFormView from '../view/events-filter-form-view';
import { DEFAULT_SORTING_TYPE } from '../config/sorting-types';
import { ModelActions } from '../service/actions';
import { filterTypeByFunction } from '../utills/filter';
import { remove, render, replace } from '../framework/render';

export default class FilterPresenter extends Presenter {
  /**
   * @type { HTMLElement }
   */
  #rootElement = null;

  /**
   * @type { EventsFilterFormView }
   */
  #filterView = null;

  /**
   * @type { FilterModel }
   */
  #filterModel = null;

  /**
   * @type { SortModel }
   */
  #sortModel = null;

  /**
   * @param { PresenterConstructorParams } params
   */
  constructor({ rootElement, filterModel, sortModel, ...basePreseneterParams }) {
    super(basePreseneterParams);
    this.#filterModel = filterModel;
    this.#sortModel = sortModel;
    this.#rootElement = rootElement;
    this.#filterModel.addObserver(this.#handleModelActions);
    this._routeModel.addObserver(this.#handleModelActions);
  }

  #handleModelActions = (actionType) => {
    switch(actionType) {
      case ModelActions.PATCH:
      case ModelActions.MINOR_UPDATE:
      case ModelActions.MAJOR_UPDATE: {
        this.init();
        break;
      }
    }
  };

  /**
   * @param { FilterTypes } newFilterValue
   */
  #filterChangeHandler = (newFilterValue) => {
    this.#sortModel.changeSort(ModelActions.PATCH, DEFAULT_SORTING_TYPE);
    this.#filterModel.changeFilter(ModelActions.MINOR_UPDATE, newFilterValue);
  };

  #renderFilterView() {
    const newFilterView = new EventsFilterFormView({
      onFilterChange: this.#filterChangeHandler,
      activeFilterType: this.#filterModel.filterType,
      filtersRecordCountInfo: this._routeModel.getRoutesCountByFilters(filterTypeByFunction, new Date())
    });

    if (this.#filterView) {
      replace(newFilterView, this.#filterView);
      remove(this.#filterView);
    } else {
      render(newFilterView, this.#rootElement);
    }

    this.#filterView = newFilterView;
  }

  init() {
    this.#renderFilterView();
  }
}

/**
 * @typedef { import('../shared/presenter').PresenterConstructorParams } BasePresenterConstructorParams
 */

/**
 * @typedef { import('../model/fliter-model').default } FilterModel
 */

/**
 * @typedef { Object } FilterPresenterAdditionalParams
 * @property { FilterModel } FilterPresenterAdditionalParams.filterModel
 * @property { SortModel } FilterPresenterAdditionalParams.sortModel
 * @property { HTMLElement } FilterPresenterAdditionalParams.rootElement
 */

/**
 * @typedef { BasePresenterConstructorParams & FilterPresenterAdditionalParams } PresenterConstructorParams
 */

/**
 * @typedef { import('../model/sort-model').default } SortModel
 */
