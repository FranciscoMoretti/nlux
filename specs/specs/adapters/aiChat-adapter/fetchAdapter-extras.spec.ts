import {AiChat, createAiChat, PersonaOptions} from '@nlux-dev/core/src';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {submit, type} from '../../../utils/userInteractions';
import {waitForRenderCycle} from '../../../utils/wait';

describe('createAiChat() + withAdapter(fetchAdapter) + extras', () => {
    let adapterController: AdapterController;
    let rootElement: HTMLElement;
    let aiChat: AiChat;

    beforeEach(() => {
        adapterController = adapterBuilder()
            .withFetchText(true)
            .withStreamText(false)
            .create();
        rootElement = document.createElement('div');
        document.body.append(rootElement);
    });

    afterEach(() => {
        aiChat?.unmount();
        rootElement?.remove();
    });

    it('Options should be provided to the adapter as part of extras attribute', async () => {
        // Arrange
        const testPersonaOptions: PersonaOptions = {
            bot: {
                name: 'Test Bot',
                picture: 'https://example.com/test-bot-image.png',
                tagline: 'Test Bot Tagline',
            },
            user: {
                name: 'Test User',
                picture: 'https://example.com/test-user-image.png',
            },
        };

        aiChat = createAiChat()
            .withAdapter(adapterController!.adapter)
            .withPersonaOptions(testPersonaOptions);
        aiChat.mount(rootElement);
        await waitForRenderCycle();
        const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;

        // Act
        await userEvent.type(textArea, 'Hello{enter}');
        await waitForRenderCycle();

        // Assert
        expect(adapterController.getLastExtras()?.aiChatProps?.personaOptions)
            .toEqual(testPersonaOptions);
    });

    describe('When options are updated', () => {
        it('New options should be provided to the adapter as part of extras attribute', async () => {
            // Arrange
            const testPersonaOptions: PersonaOptions = {
                bot: {
                    name: 'Test Bot',
                    picture: 'https://example.com/test-bot-image.png',
                    tagline: 'Test Bot Tagline',
                },
                user: {
                    name: 'Test User',
                    picture: 'https://example.com/test-user-image.png',
                },
            };

            aiChat = createAiChat()
                .withAdapter(adapterController!.adapter)
                .withPersonaOptions(testPersonaOptions);

            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();

            // Act
            adapterController.resolve('Cheers!');
            aiChat.updateProps({
                personaOptions: {
                    bot: {
                        name: 'New Bot',
                        picture: 'https://example.com/new-bot-image.png',
                        tagline: 'New Bot Tagline',
                    },
                    user: {
                        name: 'New User',
                        picture: 'https://example.com/new-user-image.png',
                    },
                },
            });

            textArea.focus();
            await waitForRenderCycle();

            await userEvent.type(textArea, 'Bonjour{enter}');
            await waitForRenderCycle();

            // Assert
            expect(adapterController.getLastExtras()?.aiChatProps.personaOptions).toEqual({
                bot: {
                    name: 'New Bot',
                    picture: 'https://example.com/new-bot-image.png',
                    tagline: 'New Bot Tagline',
                },
                user: {
                    name: 'New User',
                    picture: 'https://example.com/new-user-image.png',
                },
            });
        });
    });

    it('initial conversation should be provided as part of extras.conversationHistory', async () => {
        aiChat = createAiChat()
            .withInitialConversation([
                {message: 'Hello', role: 'user'},
                {message: 'Hi there!', role: 'ai'},
            ])
            .withAdapter(adapterController.adapter);

        aiChat.mount(rootElement);
        await waitForRenderCycle();

        await type('Hello');
        await submit();

        expect(adapterController.getLastExtras()?.conversationHistory)
            .toEqual([
                {message: 'Hello', role: 'user'},
                {message: 'Hi there!', role: 'ai'},
            ]);
    });

    it('new messages should be added to the conversation history sent to adapter', async () => {
        aiChat = createAiChat()
            .withInitialConversation([
                {message: 'Hello', role: 'user'},
                {message: 'Hi there! What do you want to know?', role: 'ai'},
            ])
            .withAdapter(adapterController.adapter);

        aiChat.mount(rootElement);
        await waitForRenderCycle();

        await type('How is the weather today?');
        await submit();

        adapterController.resolve('The weather is great!');
        await waitForRenderCycle();

        await type('And what about the rain?');
        await submit();

        expect(adapterController.getLastExtras()?.conversationHistory)
            .toEqual([
                {message: 'Hello', role: 'user'},
                {message: 'Hi there! What do you want to know?', role: 'ai'},
                {message: 'How is the weather today?', role: 'user'},
                {message: 'The weather is great!', role: 'ai'},
            ]);
    });

    describe('when conversation history is disabled', () => {
        it('initial conversation history should not be provided to the adapter', async () => {
            aiChat = createAiChat()
                .withInitialConversation([
                    {message: 'Hello', role: 'user'},
                    {message: 'Hi there! What do you want to know?', role: 'ai'},
                ])
                .withConversationOptions({
                    historyPayloadSize: 0,
                })
                .withAdapter(adapterController.adapter);

            aiChat.mount(rootElement);
            await waitForRenderCycle();

            await type('How is the weather today?');
            await submit();

            expect(adapterController.getLastExtras()?.conversationHistory).toBeUndefined();
        });

        it('new messages should not be added to the conversation history sent to adapter', async () => {
            aiChat = createAiChat()
                .withConversationOptions({
                    historyPayloadSize: 'none',
                })
                .withAdapter(adapterController.adapter);

            aiChat.mount(rootElement);
            await waitForRenderCycle();

            await type('How is the weather today?');
            await submit();

            adapterController.resolve('The weather is great!');
            await waitForRenderCycle();

            await type('And what about the rain?');
            await submit();
            await waitForRenderCycle();

            expect(adapterController.getLastExtras()?.conversationHistory).toBeUndefined();
        });
    });

    describe('when conversation history config is set to a specific value', () => {
        it('conversation history should be limited to the specified value', async () => {
            aiChat = createAiChat()
                .withInitialConversation([
                    {message: 'Hello', role: 'user'},
                    {message: 'Hi there! What do you want to know?', role: 'ai'},
                    {message: 'How is the weather today?', role: 'user'},
                    {message: 'The weather is great!', role: 'ai'},
                ])
                .withConversationOptions({
                    historyPayloadSize: 3,
                })
                .withAdapter(adapterController.adapter);

            aiChat.mount(rootElement);
            await waitForRenderCycle();

            await type('And what about the rain?');
            await submit();

            adapterController.resolve('The rain is also great!');
            await waitForRenderCycle();

            expect(adapterController.getLastExtras()?.conversationHistory)
                .toEqual([
                    {message: 'Hi there! What do you want to know?', role: 'ai'},
                    {message: 'How is the weather today?', role: 'user'},
                    {message: 'The weather is great!', role: 'ai'},
                ]);

            await type('And what about the snow?');
            await submit();

            adapterController.resolve('The snow is also great!');
            await waitForRenderCycle();

            expect(adapterController.getLastExtras()?.conversationHistory)
                .toEqual([
                    {message: 'The weather is great!', role: 'ai'},
                    {message: 'And what about the rain?', role: 'user'},
                    {message: 'The rain is also great!', role: 'ai'},
                ]);
        });
    });
});
