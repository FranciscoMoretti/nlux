import {beforeEach, describe, expect, it} from 'vitest';
import {createMdStreamRenderer} from '@shared/markdown/stream/streamParser';
import {StandardStreamParserOutput} from '@shared/types/markdown/streamParser';
import {waitForMdStreamToComplete} from '../../utils/wait';

describe('Hyperlinks Markdowns Parser', () => {
    let streamRenderer: StandardStreamParserOutput;
    let rootElement: HTMLElement;

    beforeEach(() => {
        rootElement = document.createElement('div');
        streamRenderer = createMdStreamRenderer(rootElement, {
            skipStreamingAnimation: true,
            streamingAnimationSpeed: 0,
            markdownLinkTarget: 'self',
        });
    });

    it('should render a link that opens in a new window by default', async () => {
        rootElement = document.createElement('div');
        streamRenderer = createMdStreamRenderer(rootElement,
            {
                skipStreamingAnimation: true,
                streamingAnimationSpeed: 0,
            },
        );
        streamRenderer.next('[Hi World](http://world.com)');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p><a href="http://world.com" target="_blank">Hi World</a></p>');
    });

    it('should render a link that opens in the same window', async () => {
        streamRenderer.next('[Hi World](http://world.com)');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p><a href="http://world.com">Hi World</a></p>');
    });

    it('should render a link that opens in a new window', async () => {
        rootElement = document.createElement('div');
        streamRenderer = createMdStreamRenderer(rootElement,
            {
                skipStreamingAnimation: true,
                streamingAnimationSpeed: 0,
                markdownLinkTarget: 'blank',
            },
        );

        streamRenderer.next('[Hi New Window](http://world.com)');
        streamRenderer.complete!();
        await waitForMdStreamToComplete(50);

        expect(rootElement.innerHTML).toBe('<p><a href="http://world.com" target="_blank">Hi New Window</a></p>');
    });

    it('should render a link to the same window', async () => {
        rootElement = document.createElement('div');
        streamRenderer = createMdStreamRenderer(rootElement,
            {
                skipStreamingAnimation: true,
                streamingAnimationSpeed: 0,
                markdownLinkTarget: 'self',
            },
        );

        streamRenderer.next('[Hi New Window](http://world.com)');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p><a href="http://world.com">Hi New Window</a></p>');
    });

    it('should render an empty link', async () => {
        streamRenderer.next('[]()');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p><a href=""></a></p>');
    });

    it('should render an empty link inside a paragraph', async () => {
        streamRenderer.next('I said []() to all!');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p>I said <a href=""></a> to all!</p>');
    });

    it('should render a link without text', async () => {
        streamRenderer.next('[](http://world.com)');
        streamRenderer.complete!();
        await waitForMdStreamToComplete(50);

        expect(rootElement.innerHTML).toBe('<p><a href="http://world.com"></a></p>');
    });

    it('should render a link without text inside a paragraph', async () => {
        streamRenderer.next('I said [](http://world.com) to all!');
        streamRenderer.complete!();
        await waitForMdStreamToComplete(50);

        expect(rootElement.innerHTML).toBe('<p>I said <a href="http://world.com"></a> to all!</p>');
    });

    it('should render a link without url', async () => {
        streamRenderer.next('[Hi World]()');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p><a href="">Hi World</a></p>');
    });

    it('should render a link without url inside text', async () => {
        streamRenderer.next('I said [Hi World]() to all!');
        streamRenderer.complete!();
        await waitForMdStreamToComplete(50);

        expect(rootElement.innerHTML).toBe('<p>I said <a href="">Hi World</a> to all!</p>');
    });

    it('should render a link embedded in a sentence', async () => {
        streamRenderer.next('Hi [World](http://world.com) !');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p>Hi <a href="http://world.com">World</a> !</p>');
    });

    it('should render a link a link at the beginning of a sentence', async () => {
        streamRenderer.next('[World](http://world.com) !');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p><a href="http://world.com">World</a> !</p>');
    });

    it('should render a link a link at the end of a sentence', async () => {
        streamRenderer.next('Hello [World](http://world.com)');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p>Hello <a href="http://world.com">World</a></p>');
    });

    it('should render a link inside a heading', async () => {
        streamRenderer.next('# [World](http://world.com)');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<h1><a href="http://world.com">World</a></h1>');
    });

    it('should render a link inside bold', async () => {
        streamRenderer.next('**[World](http://world.com)**');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p><strong><a href="http://world.com">World</a></strong></p>');
    });

    it('should render a link inside italic', async () => {
        streamRenderer.next('*[World](http://world.com)*');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p><em><a href="http://world.com">World</a></em></p>');
    });

    it('should render a link followed by a heading', async () => {
        streamRenderer.next('[World](http://world.com)\n# Hello');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p><a href="http://world.com">World</a></p><h1>Hello</h1>');
    });

    it('should render a link followed by a paragraph', async () => {
        streamRenderer.next('[World](http://world.com)\n\nHello');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p><a href="http://world.com">World</a></p><p>Hello</p>');
    });

    it('should render a link located after a heading', async () => {
        streamRenderer.next('# Hello\n[World](http://world.com)');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<h1>Hello</h1><p><a href="http://world.com">World</a></p>');
    });

    it('should render strong inside a link', async () => {
        streamRenderer.next('[**World**](http://world.com)');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p><a href="http://world.com"><strong>World</strong></a></p>');
    });

    it('should render code inside a link', async () => {
        streamRenderer.next('[`World`](http://world.com)');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p><a href="http://world.com"><code>World</code></a></p>');
    });
});
