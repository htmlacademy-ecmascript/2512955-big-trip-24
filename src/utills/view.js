import { render, replace, remove, RenderPosition } from '../framework/render';
import AbstractView from '../framework/view/abstract-view';
import { EventsListItemView } from '../view/events-list-view';

/**
 * Contain view into EventsListItemView
 * @param { AbstractView } view
 * @returns { EventsListItemView | null }
 */
export const asEventListItemView = (view) => {
  if (view instanceof AbstractView) {
    const listItemView = new EventsListItemView();
    render(view, listItemView.element);
    return listItemView;
  }

  return null;
};

/**
 * Replace or render
 * @param { AbstractView } renderedView Inserted view
 * @param { AbstractView } replacedView Old View
 * @param { HTMLElement } container Render root element
 * @param { RenderPosition } position
 */
export const renderOrReplace = (renderedView, replacedView, container, position = RenderPosition.BEFOREEND) => {
  if (replacedView) {
    replace(renderedView, replacedView);
    remove(replacedView);
    return;
  }

  render(renderedView, container, position);
};
