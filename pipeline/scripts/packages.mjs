export const PackageContent = {
    core: 'core',
    shared: 'shared',
    adapter: 'adapter',
    theme: 'theme',
    extension: 'extension',
};

export const PackagePlatform = {
    js: 'js',
    css: 'css',
    react: 'react',
};

export const packages = {
    core: {
        name: 'nlux-core',
        platform: PackagePlatform.js,
        content: PackageContent.core,
        directory: 'js/core',
        devName: '@nlux-dev/core',
        npmName: '@nlux/core',
        npmConfigDirectory: 'pipeline/npm/core',
    },
    react: {
        name: 'nlux-react',
        platform: PackagePlatform.react,
        content: PackageContent.core,
        directory: 'react/core',
        devName: '@nlux-dev/react',
        npmName: '@nlux/react',
        npmConfigDirectory: 'pipeline/npm/react',
    },
    nlbridge: {
        name: 'nlbridge',
        platform: PackagePlatform.js,
        content: PackageContent.adapter,
        directory: 'js/nlbridge',
        devName: '@nlux-dev/nlbridge',
        npmName: '@nlux/nlbridge',
        npmConfigDirectory: 'pipeline/npm/nlbridge',
    },
    nlbridgeReact: {
        name: 'nlbridge-react',
        platform: PackagePlatform.react,
        content: PackageContent.adapter,
        directory: 'react/nlbridge',
        devName: '@nlux-dev/nlbridge-react',
        npmName: '@nlux/nlbridge-react',
        npmConfigDirectory: 'pipeline/npm/nlbridge-react',
    },
    langchain: {
        name: 'langchain',
        platform: PackagePlatform.js,
        content: PackageContent.adapter,
        directory: 'js/langchain',
        devName: '@nlux-dev/langchain',
        npmName: '@nlux/langchain',
        npmConfigDirectory: 'pipeline/npm/langchain',
    },
    langchainReact: {
        name: 'langchain-react',
        platform: PackagePlatform.react,
        content: PackageContent.adapter,
        directory: 'react/langchain',
        devName: '@nlux-dev/langchain-react',
        npmName: '@nlux/langchain-react',
        npmConfigDirectory: 'pipeline/npm/langchain-react',
    },
    openai: {
        name: 'openai',
        platform: PackagePlatform.js,
        content: PackageContent.adapter,
        directory: 'js/openai',
        devName: '@nlux-dev/openai',
        npmName: '@nlux/openai',
        npmConfigDirectory: 'pipeline/npm/openai',
    },
    openaiReact: {
        name: 'openai-react',
        platform: PackagePlatform.react,
        content: PackageContent.adapter,
        directory: 'react/openai',
        devName: '@nlux-dev/openai-react',
        npmName: '@nlux/openai-react',
        npmConfigDirectory: 'pipeline/npm/openai-react',
    },
    hf: {
        name: 'hf',
        platform: PackagePlatform.js,
        content: PackageContent.adapter,
        directory: 'js/hf',
        devName: '@nlux-dev/hf',
        npmName: '@nlux/hf',
        npmConfigDirectory: 'pipeline/npm/hf',
    },
    hfReact: {
        name: 'hf-react',
        platform: PackagePlatform.react,
        content: PackageContent.adapter,
        directory: 'react/hf',
        devName: '@nlux-dev/hf-react',
        npmName: '@nlux/hf-react',
        npmConfigDirectory: 'pipeline/npm/hf-react',
    },
    highlighter: {
        name: 'highlighter',
        platform: PackagePlatform.js,
        content: PackageContent.extension,
        directory: 'extra/highlighter',
        devName: '@nlux-dev/highlighter',
        npmName: '@nlux/highlighter',
        npmConfigDirectory: 'pipeline/npm/highlighter',
    },
    markdown: {
        name: 'markdown',
        platform: PackagePlatform.js,
        content: PackageContent.extension,
        directory: 'extra/markdown',
        devName: '@nlux-dev/markdown',
        npmName: '@nlux/markdown',
        npmConfigDirectory: 'pipeline/npm/markdown',
    },
    themes: {
        name: 'themes',
        platform: PackagePlatform.css,
        content: PackageContent.theme,
        directory: 'css/themes',
        devName: '@nlux-dev/themes',
        npmName: '@nlux/themes',
        npmConfigDirectory: 'pipeline/npm/themes',
    },
};

export const packagesList = Object.values(packages);
