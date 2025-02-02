import { humanizeColor } from '@salutejs/plasma-tokens-utils';

import { ThemeConfig, TokensByType } from '../../types';

export const accentTokenCreator = (comment: Record<keyof TokensByType, string>) => {
    return (config: ThemeConfig) => {
        const accentColorDark = humanizeColor(config.accentColor.dark);
        const accentColorLight = humanizeColor(config.accentColor.light);

        return {
            dark: {
                default: {
                    value: accentColorDark,
                    comment: comment.default,
                },
                onDark: {
                    value: accentColorDark,
                    comment: comment.onDark,
                },
                onLight: {
                    value: accentColorLight,
                    comment: comment.onLight,
                },
                inverse: {
                    value: accentColorLight,
                    comment: comment.inverse,
                },
            },
            light: {
                default: {
                    value: accentColorLight,
                    comment: comment.default,
                },
                onDark: {
                    value: accentColorDark,
                    comment: comment.onDark,
                },
                onLight: {
                    value: accentColorLight,
                    comment: comment.onLight,
                },
                inverse: {
                    value: accentColorDark,
                    comment: comment.inverse,
                },
            },
        };
    };
};

const comment: Record<keyof TokensByType, string> = {
    default: 'Акцентный цвет',
    onDark: 'Акцентный цвет на темном фоне',
    onLight: 'Акцентный цвет на светлом фоне',
    inverse: 'Инвертированный акцентный цвет',
};

export const getTextAccentTokens = accentTokenCreator(comment);
