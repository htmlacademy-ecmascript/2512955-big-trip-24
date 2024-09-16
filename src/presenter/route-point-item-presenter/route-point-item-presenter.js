import Presenter from '../../shared/presenter';
import { DEFAULT_VIEW_MODE, ViewModes } from './view-mode';
import { remove, render, replace } from '../../framework/render';
import EditEventFormView from '../../view/events/edit-event-form-view';
import EventInfoView from '../../view/events/event-info-view';
import DataTransferObjectService from '../../service/data-transfer-object-service';
import AbstractView from '../../framework/view/abstract-view';
import { EventsListItemView } from '../../view/events-list-view';

export default class RoutePointItemPresenter extends Presenter {
  /**
   * @type { RoutePointDto }
   */
  #routePoint = null;

  /**
   * @type { AbstractView }
   */
  #itemView = null;

  /**
   * @type { HTMLElement }
   */
  #rootElement = null;

  /**
   * @type { ViewModes }
   */
  #viewMode = DEFAULT_VIEW_MODE;
  #onRollupButtonClickCallback = null;

  /**
   * Presenter constructor
   * @param { RoutePointItemConstructorParams } presenterParams
   */
  constructor({ rootElement, routePoint, onRollupClickCallback, ...presenterParams }) {
    super(presenterParams);
    this.#rootElement = rootElement;
    this.#routePoint = routePoint;
    this.#onRollupButtonClickCallback = onRollupClickCallback;
  }

  #asEventListItem(view) {
    if (view instanceof AbstractView) {
      const listItemView = new EventsListItemView();
      render(view, listItemView.element);
      return listItemView;
    }
  }

  /**
   * View render
   * @param { AbstractView } view
   */
  #renderView(view) {
    if (view instanceof AbstractView) {
      if (this.#itemView) {
        replace(view, this.#itemView);
        remove(this.#itemView);
      } else {
        render(this.#asEventListItem(view), this.#rootElement);
      }
      this.#itemView = view;
    }
  }

  /**
  * @param { KeyboardEvent } event
  */
  #onEscapeKeydown = (event) => {
    if (event.key === 'Escape') {
      this.#replaceEditViewToInfoView();
    }
  };

  #replaceInfoViewToEditView() {
    if (this.#viewMode === ViewModes.VIEW) {
      this.#showViewByMode(ViewModes.EDIT);
    }
  }

  #replaceEditViewToInfoView() {
    if (this.#viewMode === ViewModes.EDIT) {
      document.removeEventListener('keydown', this.#onEscapeKeydown);
      this.#showViewByMode(ViewModes.VIEW);
    }
  }

  #onFavoriteButtonClick() {
    this._routeModel.updateRoutePoint(
      DataTransferObjectService.createRoutePointDataByRoutePointDto(
        {
          ...this.#routePoint,
          isFavorite: !this.#routePoint.isFavorite
        })
    );

    this.#routePoint = DataTransferObjectService.getFullRoutePointDto(
      this._routeModel.getRoutePointById(this.#routePoint.id),
      this._offerModel.getOffersByEventType(this.#routePoint.type),
      this._routeDestinationModel.data
    );
    this.#showViewByMode(this.#viewMode);
  }

  /**
   * Create edit view by this.#routePoint
   * @returns { EditEventFormView }
   */
  #createEditView() {
    return new EditEventFormView({
      routePoint: this.#routePoint,
      getOffers: (eventType) => this._offerModel
        .getOffersByEventType(eventType)
        .map((current) => DataTransferObjectService.getOfferDto(current)),
      getDestinations: () => this._routeDestinationModel.data.map((current) => DataTransferObjectService.getDestinationDto(current)),
      onRollupButtonClick: () => {
        this.#replaceEditViewToInfoView();
      },
      onSaveButtonClick: () => this.#replaceEditViewToInfoView()
    });
  }

  /**
   * Create info view by this.#routePoint
   * @returns { EventInfoView }
   */
  #createInfoView() {
    return new EventInfoView({
      routePoint: this.#routePoint,
      onRollupButtonClick: () => {
        this.#onRollupButtonClickCallback();
        this.#replaceInfoViewToEditView();
        document.addEventListener('keydown', this.#onEscapeKeydown);
      },
      onFavoriteButtonClickCallback: () => this.#onFavoriteButtonClick()
    });
  }

  /**
   * Create and render view
   * @param { ViewModes } [viewMode=DEFAULT_VIEW_MODE]
   */
  #showViewByMode(viewMode = DEFAULT_VIEW_MODE) {
    this.#viewMode = viewMode;
    const view = this.#createView(viewMode);

    if (view instanceof AbstractView) {
      this.#renderView(view);
    }
  }

  /**
   * Create view
   * @param { ViewModes } [viewMode]
   * @returns { AbstractView }
   */
  #createView(viewMode = DEFAULT_VIEW_MODE) {
    switch(viewMode) {
      case ViewModes.EDIT: {
        return this.#createEditView();
      }
      case ViewModes.VIEW: {
        return this.#createInfoView();
      }
    }
  }

  resetView() {
    if (this.#viewMode !== DEFAULT_VIEW_MODE) {
      this.#showViewByMode(DEFAULT_VIEW_MODE);
    }
  }

  /**
   * Init presenter by route point parameter
   * @param { RoutePointDto } [routePoint=null]
   */
  init(routePoint = null) {
    if (routePoint) {
      this.#routePoint = routePoint;
    }
    this.#showViewByMode(DEFAULT_VIEW_MODE);
  }
}

/**
 * @typedef { import('../../service/data-transfer-object-service').RoutePointDto } RoutePointDto
 */

/**
 * @typedef { import('../../shared/presenter').PresenterConstructorParams } PresenterConstructorParams
 */

/**
 * @typedef { Object } RoutePountPresenterAdditionalParams
 * @property { RoutePointDto } RoutePountPresenterAdditionalParams.routePoint
 * @property { HTMLElement } RoutePountPresenterAdditionalParams.rootElement
 * @property { () => void } RoutePountPresenterAdditionalParams.onRollupClickCallback
 */

/**
 * @typedef { import('../../framework/view/abstract-view').default } AbstractView
 */

/**
 * @typedef { PresenterConstructorParams & RoutePountPresenterAdditionalParams } RoutePointItemConstructorParams
 */
