import {ChatAdapterBuilder as CoreChatAdapterBuilder, DataTransferMode, StandardChatAdapter} from '@nlux/core';

export interface ChatAdapterBuilder<AiMsg> extends CoreChatAdapterBuilder<AiMsg> {
    /**
     * Create a new ChatGPT API adapter.
     * Adapter users don't need to call this method directly. It will be called by nlux when the adapter is expected
     * to be created.
     *
     * @returns {StandardChatAdapter}
     */
    create(): StandardChatAdapter<AiMsg>;

    /**
     * The API key to use to connect to ChatGPT API.
     * This is secret and should not be shared publicly or hosted when deploying your application.
     *
     * @optional
     * @param {string} apiKey
     * @returns {ChatAdapterBuilder}
     */
    withApiKey(apiKey: string): ChatAdapterBuilder<AiMsg>;

    /**
     * Instruct the adapter to connect to API and load data either in streaming mode or in batch mode.
     * The `stream` mode would use protocols such as websockets or server-side events, and nlux will display data as
     * it's being generated by the server. The `batch` mode would use a single request to fetch data, and the response
     * would only be displayed once the entire message is loaded.
     *
     * @optional
     * @default 'stream'
     * @returns {ChatAdapterBuilder}
     */
    withDataTransferMode(mode: DataTransferMode): ChatAdapterBuilder<AiMsg>;

    /**
     * The model or the endpoint to use for ChatGPT Inference API.
     * You should provide either a model or an endpoint, but not both.
     *
     * @param {string} model
     * @returns {ChatAdapterBuilder}
     */
    withModel(model: string): ChatAdapterBuilder<AiMsg>;

    /**
     * The initial system to send to ChatGPT API.
     *
     * @optional
     * @param {string} message
     * @returns {ChatAdapterBuilder}
     */
    withSystemMessage(message: string): ChatAdapterBuilder<AiMsg>;
}
