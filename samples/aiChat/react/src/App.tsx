import '@nlux-dev/themes/src/nova/main.css';
import '@nlux-dev/themes/src/dev/main.css';
import '@nlux-dev/themes/src/blank/main.css';
import '@nlux-dev/themes/src/luna/main.css';
import '@nlux-dev/highlighter/src/themes/stackoverflow/dark.css';
// import {createUnsafeChatAdapter as useOpenAiChatAdapter} from '@nlux-dev/openai/src';
import {
    AiChat,
    BatchResponseComponentProps,
    ChatItem,
    ConversationLayout,
    DataTransferMode,
    PersonaOptions,
    ResponseRenderer,
    SanitizerExtension,
    StreamResponseComponentProps,
} from '@nlux-dev/react/src';
import {ConversationStarter} from '@nlux-dev/react/src/types/conversationStarter';
import DOMPurify from 'dompurify';
import {useChatAdapter as useHfChatAdapter} from '@nlux-dev/hf-react/src';
import {highlighter} from '@nlux-dev/highlighter/src';
import {useChatAdapter as useChatLangChainChatAdapter} from '@nlux-dev/langchain-react/src';
import {useChatAdapter as useNlbridgeChatAdapter} from '@nlux-dev/nlbridge-react/src';
import './App.css';
import {useCallback, useEffect, useMemo, useState} from 'react';

function App() {
    type ThemeId = 'nova' | 'luna' | 'dev' | 'blank';
    const [useCustomResponseComponent, setUseCustomResponseComponent] = useState(false);
    const [useCustomPersonaOptions, setUseCustomPersonaOptions] = useState(true);
    const [conversationLayout, setConversationLayout] = useState<ConversationLayout>('list');
    const [dataTransferMode, setDataTransferMode] = useState<DataTransferMode>('stream');
    const [theme, setTheme] = useState<ThemeId>('nova');
    const [colorScheme, setColorScheme] = useState<'light' | 'dark' | 'auto'>('dark');

    const onUseCustomResponseComponentChange = useCallback((e) => setUseCustomResponseComponent(e.target.checked),
        [setUseCustomResponseComponent],
    );

    const onUseCustomPersonaOptions = useCallback(
        (e) => setUseCustomPersonaOptions(e.target.value === 'true'),
        [setUseCustomPersonaOptions],
    );

    const onConversationsLayoutChange = useCallback((e) => setConversationLayout(e.target.value),
        [setConversationLayout],
    );

    const onThemeChange = useCallback((e) => setTheme(e.target.value as ThemeId), [setTheme]);
    const onColorSchemeChange = useCallback((e) => setColorScheme(e.target.value as 'light' | 'dark' | 'auto'),
        [setColorScheme],
    );
    const onDataTransferModeChange = useCallback((e) => setDataTransferMode(e.target.value as 'batch' | 'stream'),
        [setDataTransferMode],
    );

    useEffect(() => {
        if (colorScheme === 'auto') {
            const osColorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            document.body.style.backgroundColor = osColorScheme === 'dark' ? 'black' : 'white';
        } else {
            document.body.style.backgroundColor = colorScheme === 'dark' ? 'black' : 'white';
        }

    }, [colorScheme]);

    const nlBridgeAdapter = useNlbridgeChatAdapter({
        url: 'http://localhost:8899/',
    });

    const langChainAdapter = useChatLangChainChatAdapter({
        url: 'https://pynlux.api.nlkit.com/einbot',
        dataTransferMode,
        useInputSchema: true,
        config: {
            'param1': 'value2',
            'param2': true,
        },
    });

    const hfAdapter = useHfChatAdapter({
        dataTransferMode: 'batch',
        model: 'gpt4',
        authToken: 'N/A',
    });

    // const openAiAdapter = useOpenAiChatAdapter()
    //     .withApiKey(localStorage.getItem('openai-api-key') || 'N/A')
    //     .withDataTransferMode('batch');

    const longMessage = 'Hello, [how can I help you](http://questions.com)? This is going to be a very long greeting '
        + 'It is so long that it will be split into multiple lines. It will also showcase that no '
        + 'typing animation will be shown for this message when it is loaded. This is a very long '
        + 'message. Trust me.\n' + 'In a message, long and true,\n' + 'Words kept flowing, never few.\n'
        + 'Stories told with heartfelt grace,\n' + 'In each line, a sacred space.\n\n'
        + 'Each word a bridge, connecting souls,\n'
        + 'Across distances, making us whole.\n'
        + 'Emotions poured, thoughts unfurled,\n'
        + 'In this message, a treasure world.\n\n'
        + 'Pages filled with hopes and dreams,\n'
        + 'In this message, it truly seems,\n'
        + 'That connection can transcend the miles,\n'
        + 'In this message, love it files.\n'
        + 'So let us embrace this lengthy tale,\n'
        + 'For in its depth, we will prevail.\n'
        + 'For in a message, long and grand,\n'
        + 'We find connection, hand in hand.';

    const messageWithCode = '```python\n'
        + 'def hello_world():\n'
        + '    print("Hello, World!")\n'
        + '```\n'
        + 'This is a code block.';

    const initialConversation: ChatItem<string>[] = [
        {
            role: 'assistant',
            message: 'Hello, **how can I help you?**\n# AI speaking\nCheers!',
        },
        {
            role: 'assistant',
            message: longMessage,
        },
        {role: 'user', message: 'I need help with my account.'},
        {
            role: 'assistant',
            message: 'Sure, I can help you with that.\n\nLet\'s start with some python code:\n\n' + messageWithCode,
        },
    ];

    const personaOptions: PersonaOptions = {
        user: {
            name: 'Alex',
            avatar: 'https://docs.nlkit.com/nlux/images/personas/alex.png',
            // avatar: <div style={{backgroundColor: 'red', width: 50, height: 50}}>JsX</div>,
        },
        assistant: {
            name: 'Harry Botter',
            avatar: 'https://docs.nlkit.com/nlux/images/personas/harry-botter.png',
            tagline: 'Your friendly AI assistant',
        },
    };

    const htmlSanitizer: SanitizerExtension = useMemo(() => (html: string) => {
        const trustedTypes = window.trustedTypes as unknown as {
            createPolicy: (name: string, policy: Record<string, unknown>) => unknown;
        };

        if (typeof trustedTypes.createPolicy === 'function') {
            const policy = trustedTypes.createPolicy('htmlSanitizer', {
                createHTML: (input: string) => DOMPurify.sanitize(input),
            });

            return policy.createHTML(html);
        }
        return DOMPurify.sanitize(html);
    }, []);

    const conversationStarters: ConversationStarter[] = [
        {prompt: 'Write Hello World in Python, C++, and Java.'},
        {prompt: 'Write hello world in Python.'},
        {prompt: 'Write a poem using markdown and emojis'},
        {prompt: 'What is your name?'},
        {prompt: 'What is your favorite color?'},
    ];

    return (
        <>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                marginBottom: 10,
                backgroundColor: 'lightgray',
                padding: 10,
                borderRadius: 10,
            }}>
                <label>
                    <input
                        type="checkbox"
                        checked={useCustomResponseComponent}
                        onChange={onUseCustomResponseComponentChange}
                    />
                    Use Custom Response Renderer
                </label>
                <label>
                    Data Transfer Mode&nbsp;
                    <select value={dataTransferMode} onChange={onDataTransferModeChange}>
                        <option value="stream">Stream</option>
                        <option value="batch">Batch</option>
                    </select>
                </label>
                <hr/>
                <label>
                    Use persona options:
                    <br/>
                    <label>
                        <input
                            type="radio"
                            name="persona"
                            value="true"
                            checked={useCustomPersonaOptions}
                            onChange={onUseCustomPersonaOptions}
                        />
                        Yes
                        <input
                            type="radio"
                            name="persona"
                            value="no"
                            checked={!useCustomPersonaOptions}
                            onChange={onUseCustomPersonaOptions}
                        />
                        No
                    </label>
                </label>
                <label>
                    Conversation Layout:
                    <br/>
                    <label>
                        <input
                            type="radio"
                            name="conversationLayout"
                            value="list"
                            checked={conversationLayout === 'list'}
                            onChange={onConversationsLayoutChange}
                        />
                        List
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="conversationMode"
                            value="bubbles"
                            checked={conversationLayout === 'bubbles'}
                            onChange={onConversationsLayoutChange}
                        />
                        Bubbles
                    </label>
                </label>
                <div>
                    Theme&nbsp;
                    <select value={theme} onChange={onThemeChange}>
                        <option value="dev">Dev</option>
                        <option value="blank">Blank</option>
                        <option value="nova">Nova</option>
                        <option value="luna">Luna</option>
                    </select>
                    &nbsp;| Color Scheme&nbsp;
                    <select value={colorScheme} onChange={onColorSchemeChange}>
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                        <option value="auto">Auto</option>
                    </select>
                </div>
            </div>
            <AiChat
                // adapter={nlBridgeAdapter}
                // adapter={openAiAdapter}
                adapter={langChainAdapter}
                // adapter={hfAdapter}
                // initialConversation={initialConversation}
                composerOptions={{
                    placeholder: 'Type your prompt here',
                    autoFocus: true,
                    // submitShortcut: 'CommandEnter',
                }}
                displayOptions={{
                    width: 500,
                    height: 400,
                    themeId: theme,
                    colorScheme,
                }}
                conversationOptions={{
                    // autoScroll: false,
                    layout: conversationLayout,
                    // showWelcomeMessage: true,
                    conversationStarters,
                }}
                messageOptions={{
                    markdownLinkTarget: 'blank',
                    syntaxHighlighter: highlighter,
                    htmlSanitizer: htmlSanitizer,
                    showCodeBlockCopyButton: true,
                    streamingAnimationSpeed: 100,
                    skipStreamingAnimation: true,
                    responseRenderer: useCustomResponseComponent ? responseRenderer : undefined,
                    promptRenderer: undefined,
                }}
                personaOptions={useCustomPersonaOptions ? personaOptions : undefined}
            />
        </>
    );
}

const responseRenderer: ResponseRenderer<string> = (props) => {
    const {dataTransferMode} = props;
    const propsForBatch = props as BatchResponseComponentProps<string>;
    const propsForStream = props as StreamResponseComponentProps<string>;

    console.log('Response Renderer Props');
    console.dir(props);

    return (
        <>
            {(dataTransferMode === 'batch') && <div>{propsForBatch.content}</div>}
            {(dataTransferMode === 'stream') && <div ref={propsForStream.containerRef}/>}
            <div style={{
                backgroundColor: 'lightblue',
                padding: '10px 0',
                borderRadius: 10,
                marginTop: 10,
                fontSize: '0.8em',
                textAlign: 'center',
                width: '100%',
            }}>
                <div>What do you think of this response?</div>
                <div style={{
                    display: 'flex',
                    alignItems: 'stretch',
                    justifyContent: 'center',
                    gap: 5,
                    marginTop: 10,
                }}>
                    <button>👍</button>
                    <button>👎</button>
                    <button>Retry</button>
                </div>
            </div>
        </>
    );
};

export default App;
