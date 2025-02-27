import {AiChat} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForReactRenderCycle} from '../../../../utils/wait';

describe('<AiChat /> + conversationOptions + layout', () => {
    let adapterController: AdapterController | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder()
            .withBatchText(true)
            .withStreamText(false)
            .create();
    });

    afterEach(() => {
        adapterController = undefined;
    });

    describe('When the user adds a message to an AiChat without layout config', () => {
        it('The default layout used to should be bubbles layout', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter}/>;
            const {container} = render(aiChat);
            await waitForReactRenderCycle();
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello AI!{enter}');
            await waitForReactRenderCycle();

            adapterController!.resolve('Hi there!');
            await waitForReactRenderCycle();

            // Assert
            const humanMessage: HTMLTextAreaElement = container.querySelector('.nlux-comp-chatItem.nlux-comp-chatItem--sent')!;
            const aiMessage: HTMLTextAreaElement = container.querySelector('.nlux-comp-chatItem.nlux-comp-chatItem--received')!;

            expect(humanMessage.classList.contains('nlux-comp-chatItem--bubblesLayout')).toBe(true);
            expect(aiMessage.classList.contains('nlux-comp-chatItem--bubblesLayout')).toBe(true);
        });
    });

    describe('When the user adds a message to an AiChat with bubbles layout config', () => {
        it('The layout used should be bubbles layout', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter} conversationOptions={{layout: 'bubbles'}}/>;
            const {container} = render(aiChat);
            await waitForReactRenderCycle();
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello AI!{enter}');
            await waitForReactRenderCycle();

            adapterController!.resolve('Hi there!');
            await waitForReactRenderCycle();

            // Assert
            const humanMessage: HTMLTextAreaElement = container.querySelector('.nlux-comp-chatItem.nlux-comp-chatItem--sent')!;
            const aiMessage: HTMLTextAreaElement = container.querySelector('.nlux-comp-chatItem.nlux-comp-chatItem--received')!;

            expect(humanMessage.classList.contains('nlux-comp-chatItem--bubblesLayout')).toBe(true);
            expect(aiMessage.classList.contains('nlux-comp-chatItem--bubblesLayout')).toBe(true);
        });

        describe('When the layout message changes to list layout', () => {
            it('The layout used should be list layout after initial render', async () => {
// Arrange
                const aiChat = <AiChat adapter={adapterController!.adapter} conversationOptions={{layout: 'bubbles'}}/>;
                const {container, rerender} = render(aiChat);
                await waitForReactRenderCycle();
                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;

                // Act
                await userEvent.type(textArea, 'Hello AI!{enter}');
                await waitForReactRenderCycle();

                adapterController!.resolve('Hi there!');
                await waitForReactRenderCycle();

                // Assert
                const humanMessage: HTMLTextAreaElement = container.querySelector(
                    '.nlux-comp-chatItem.nlux-comp-chatItem--sent')!;
                const aiMessage: HTMLTextAreaElement = container.querySelector('.nlux-comp-chatItem.nlux-comp-chatItem--received')!;

                expect(humanMessage.classList.contains('nlux-comp-chatItem--bubblesLayout')).toBe(true);
                expect(aiMessage.classList.contains('nlux-comp-chatItem--bubblesLayout')).toBe(true);

                // Act
                rerender(<AiChat adapter={adapterController!.adapter} conversationOptions={{layout: 'list'}}/>);
                await waitForReactRenderCycle();

                // Assert
                const humanMessageAfterRerender: HTMLTextAreaElement = container.querySelector(
                    '.nlux-comp-chatItem.nlux-comp-chatItem--sent')!;
                const aiMessageAfterRerender: HTMLTextAreaElement = container.querySelector(
                    '.nlux-comp-chatItem.nlux-comp-chatItem--received')!;

                expect(humanMessageAfterRerender.classList.contains('nlux-comp-chatItem--listLayout')).toBe(true);
                expect(aiMessageAfterRerender.classList.contains('nlux-comp-chatItem--listLayout')).toBe(true);
            });
        });
    });

    describe('When the user adds a message to an AiChat with list layout config', () => {
        it('The layout used should be list layout', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter} conversationOptions={{layout: 'list'}}/>;
            const {container} = render(aiChat);
            await waitForReactRenderCycle();
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello AI!{enter}');
            await waitForReactRenderCycle();

            adapterController!.resolve('Hi there!');
            await waitForReactRenderCycle();

            // Assert
            const humanMessage: HTMLTextAreaElement = container.querySelector('.nlux-comp-chatItem.nlux-comp-chatItem--sent')!;
            const aiMessage: HTMLTextAreaElement = container.querySelector('.nlux-comp-chatItem.nlux-comp-chatItem--received')!;

            expect(humanMessage.classList.contains('nlux-comp-chatItem--listLayout')).toBe(true);
            expect(aiMessage.classList.contains('nlux-comp-chatItem--listLayout')).toBe(true);
        });

        describe('When the layout message changes to bubbles layout', () => {
            it('The layout should be updated to bubbles layout', async () => {
                // Arrange
                const aiChat = <AiChat adapter={adapterController!.adapter} conversationOptions={{layout: 'list'}}/>;
                const {container, rerender} = render(aiChat);
                await waitForReactRenderCycle();
                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;

                // Act
                await userEvent.type(textArea, 'Hello AI!{enter}');
                await waitForReactRenderCycle();

                adapterController!.resolve('Hi there!');
                await waitForReactRenderCycle();

                // Assert
                const humanMessage: HTMLTextAreaElement = container.querySelector(
                    '.nlux-comp-chatItem.nlux-comp-chatItem--sent')!;
                const aiMessage: HTMLTextAreaElement = container.querySelector('.nlux-comp-chatItem.nlux-comp-chatItem--received')!;

                expect(humanMessage.classList.contains('nlux-comp-chatItem--listLayout')).toBe(true);
                expect(aiMessage.classList.contains('nlux-comp-chatItem--listLayout')).toBe(true);

                // Act
                rerender(<AiChat adapter={adapterController!.adapter} conversationOptions={{layout: 'bubbles'}}/>);
                await waitForReactRenderCycle();

                // Assert
                const humanMessageAfterRerender: HTMLTextAreaElement = container.querySelector(
                    '.nlux-comp-chatItem.nlux-comp-chatItem--sent')!;
                const aiMessageAfterRerender: HTMLTextAreaElement = container.querySelector(
                    '.nlux-comp-chatItem.nlux-comp-chatItem--received')!;

                expect(humanMessageAfterRerender.classList.contains('nlux-comp-chatItem--bubblesLayout')).toBe(true);
                expect(aiMessageAfterRerender.classList.contains('nlux-comp-chatItem--bubblesLayout')).toBe(true);
            });
        });
    });
});
