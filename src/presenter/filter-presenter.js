import EventsFilterFormView from '../view/events-filter-form-view';
import { DEFAULT_SORTING_TYPE } from '../config/sorting-types';
import { ModelActions } from '../service/actions';
import { filterTypeByFunction } from '../utills/filter';
import { remove, render, replace } from '../framework/render';

export default class FilterPresenter {
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
   * @type { RouteModel }
   */

  #routeModel = null;

  /**
   * @param { FilterPresenterParams } params
   */
  constructor({ rootElement, filterModel, sortModel, routeModel }) {
    this.#filterModel = filterModel;
    this.#sortModel = sortModel;
    this.#rootElement = rootElement;
    this.#routeModel = routeModel;
    this.#filterModel.addObserver(this.#handleModelActions);
    this.#routeModel.addObserver(this.#handleModelActions);
  }

  /**
   * External change filter
   * @param { FilterTypes } filterType
   */
  changeFilter = (filterType) => {
    this.#filterModel.changeFilter(ModelActions.MINOR_UPDATE, filterType);
  };

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
      filtersRecordCountInfo: this.#routeModel.getRoutesCountByFilters(filterTypeByFunction, new Date())
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
 * @typedef { Object } FilterPresenterParams
 * @property { FilterModel } FilterPresenterAdditionalParams.filterModel
 * @property { SortModel } FilterPresenterAdditionalParams.sortModel
 * @property { RouteModel } FilterPresenterAdditionalParams.routeModel
 * @property { HTMLElement } FilterPresenterAdditionalParams.rootElement
 */

/**
 * @typedef { import('../model/sort-model').default } SortModel
 */

/**
 * @typedef { import('../model/route-model').default } RouteModel
 */

/**
 * @typedef { import('../config/filter-types').FilterTypes } FilterTypes
 */
