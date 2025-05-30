import { useEffect, useState } from "react";
export const DISABLED_PROVIDERS = [
    "azure",
    "native",
    "textgenwebui",
    "generic-openai",
    "bedrock",
];
const PROVIDER_DEFAULT_MODELS = {
    openai: [],
    gemini: [
        "gemini-pro",
        "gemini-1.0-pro",
        "gemini-1.5-pro-latest",
        "gemini-1.5-flash-latest",
        "gemini-1.5-pro-exp-0801",
        "gemini-1.5-pro-exp-0827",
        "gemini-1.5-flash-exp-0827",
        "gemini-1.5-flash-8b-exp-0827",
        "gemini-exp-1114",
        "gemini-exp-1121",
        "learnlm-1.5-pro-experimental",
    ],
    anthropic: [
        "claude-instant-1.2",
        "claude-2.0",
        "claude-2.1",
        "claude-3-haiku-20240307",
        "claude-3-sonnet-20240229",
        "claude-3-opus-latest",
        "claude-3-5-haiku-latest",
        "claude-3-5-haiku-20241022",
        "claude-3-5-sonnet-latest",
        "claude-3-5-sonnet-20241022",
        "claude-3-5-sonnet-20240620",
    ],
    azure: [],
    lmstudio: [],
    localai: [],
    ollama: [],
    togetherai: [],
    fireworksai: [],
    groq: [],
    native: [],
    cohere: [
        "command-r",
        "command-r-plus",
        "command",
        "command-light",
        "command-nightly",
        "command-light-nightly",
    ],
    textgenwebui: [],
    "generic-openai": [],
    bedrock: [],
    xai: ["grok-beta"],
};
function groupModels(models): any {
    return models.reduce((acc, model) => {
        acc[model.organization] = acc[model.organization] || [];
        acc[model.organization].push(model);
        return acc;
    }, {});
}
const groupedProviders = [
    "togetherai",
    "fireworksai",
    "openai",
    "novita",
    "openrouter",
];
export default function useGetProviderModels(provider = null): any {
    const [defaultModels, setDefaultModels] = useState([]);
    const [customModels, setCustomModels] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function fetchProviderModels(): any {
            if (!provider)
                return;
            const { models = [] } = await System.customModels(provider);
            if (PROVIDER_DEFAULT_MODELS.hasOwnProperty(provider) &&
                !groupedProviders.includes(provider)) {
                setDefaultModels(PROVIDER_DEFAULT_MODELS[provider]);
            }
            else {
                setDefaultModels([]);
            }
            groupedProviders.includes(provider)
                ? setCustomModels(groupModels(models))
                : setCustomModels(models);
            setLoading(false);
        }
        fetchProviderModels();
    }, [provider]);
    return { defaultModels, customModels, loading };
}
//# sourceMappingURL=useGetProvidersModels.js.map