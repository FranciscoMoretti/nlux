import {NluxRenderingError} from '../../../exports/error';
import {CompRenderer} from '../../../types/comp';
import {ExceptionType} from '../../../types/exception';
import {render} from '../../../utils/render';
import {source} from '../../../utils/source';
import {
    CompExceptionsBoxActions,
    CompExceptionsBoxElements,
    CompExceptionsBoxEvents,
    CompExceptionsBoxProps,
} from './types';

const __ = (styleName: string) => `nlux-xcptBx-${styleName}`;

const html = (props: CompExceptionsBoxProps) => `` +
    `<div class="${__('cntr')}">` +
    `<div class="${__('exception-container')}" style="display: none">` +
    `<div class="${__('message')}">${props.message ?? ''}</div>` +
    `</div>` +
    `</div>`;

export const renderExceptionsBox: CompRenderer<
    CompExceptionsBoxProps,
    CompExceptionsBoxElements,
    CompExceptionsBoxEvents,
    CompExceptionsBoxActions
> = ({
    props,
    appendToRoot,
}) => {
    const exceptionsBoxRoot = render(html(props));
    if (!(exceptionsBoxRoot instanceof HTMLElement)) {
        throw new NluxRenderingError({
            source: source('exceptions-box', 'render'),
            message: 'Exception alert could not be rendered',
        });
    }

    const exceptionContainerSelector = ':scope > .' + __('exception-container');
    const exceptionContainer = exceptionsBoxRoot.querySelector(exceptionContainerSelector);
    if (!(exceptionContainer instanceof HTMLElement)) {
        throw new NluxRenderingError({
            source: source('exceptions-box', 'render'),
            message: 'Exception container element could not be found with selector ' + exceptionContainerSelector,
        });
    }

    const messageSelector = ':scope > .' + __('exception-container') + ' > .' + __('message');
    const messageElement = exceptionsBoxRoot.querySelector(messageSelector);
    if (!(messageElement instanceof HTMLElement)) {
        throw new NluxRenderingError({
            source: source('exceptions-box', 'render'),
            message: 'Exception message element could not be found with selector ' + messageSelector,
        });
    }

    appendToRoot(exceptionsBoxRoot);

    return {
        elements: {},
        actions: {
            hide: () => {
                exceptionContainer.style.display = 'none';
                messageElement.replaceChildren();
            },
            show: () => {
                exceptionContainer.style.display = '';
            },
            setMessage: (message: string) => {
                messageElement.append(document.createTextNode(message));
            },
            setMessageType: (type: ExceptionType) => {
                exceptionsBoxRoot.classList.remove('error-exception', 'warning-exception');
                exceptionsBoxRoot.classList.add(`${type}-exception`);
            },
        },
        onDestroy: () => {
            exceptionsBoxRoot.remove();
        },
    };
};
