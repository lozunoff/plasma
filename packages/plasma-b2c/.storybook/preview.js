import React from 'react';
import { createGlobalStyle } from 'styled-components';
import { addDecorator, addParameters } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { b2c } from '@salutejs/plasma-tokens-b2c/typo';
import { link, linkHover, linkActive, surfaceSolid01 } from '@salutejs/plasma-tokens-web';
import { light, dark } from '@salutejs/plasma-tokens-b2c/themes';
import { standard as standardTypo, compatible as compatibleTypo } from '@salutejs/plasma-typo';

import { ToastProvider } from '../src/components/Toast';

// Workaround: to make VoiceOver read russian text properly
if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('lang', 'ru');
}

/* stylelint-disable */
const DocumentStyle = createGlobalStyle`
    html:root {
        min-height: 100vh;
        background-color: ${surfaceSolid01};
    }
    a {
        color: ${link};
        text-decoration: underline;

        &:hover {
            color: ${linkHover};
        }
        &:active {
            color: ${linkActive};
        }
    }
`;
/* stylelint-enable */

const OldTypo = createGlobalStyle(b2c);
const TypoStyle = createGlobalStyle(standardTypo);
const CompatibleTypoStyle = createGlobalStyle(compatibleTypo);

const themes = {
    light: createGlobalStyle(light),
    dark: createGlobalStyle(dark),
};

const withTheme = (Story, context) => {
    const Theme = themes[context.globals.theme];

    return (
        <>
            {context.globals.typoVersion === 'standard' ? (
                <>
                    <TypoStyle breakWord={context.globals.breakWord === 'yes'} />
                    <CompatibleTypoStyle />
                </>
            ) : (
                <OldTypo />
            )}
            <Theme />
            <DocumentStyle />
            <Story {...context} />
        </>
    );
};

const withToast = (Story) => (
    <ToastProvider>
        <Story />
    </ToastProvider>
);

addDecorator(withKnobs);
addDecorator(withTheme);
addDecorator(withToast);

addParameters({
    viewport: {
        viewports: {
            '375': {
                name: '375x812',
                styles: {
                    width: '375px',
                    height: '812px',
                },
            },
            '768': {
                name: '768x576',
                styles: {
                    width: '768px',
                    height: '576px',
                },
            },
            '1024': {
                name: '1024x768',
                styles: {
                    width: '1024px',
                    height: '768px',
                },
            },
            '1920': {
                name: '1920x1080',
                styles: {
                    width: '1920px',
                    height: '1080px',
                },
            },
        },
    },
});

export const globalTypes = {
    theme: {
        description: 'Global theme for components',
        defaultValue: 'dark',
        toolbar: {
            title: 'Theme',
            items: ['light', 'dark'],
        },
    },
    typoVersion: {
        description: 'Global typography version for components',
        defaultValue: 'standard',
        toolbar: {
            title: 'Typography version',
            items: ['standard', 'old'],
        },
    },
    breakWord: {
        description: 'Break word for typography',
        defaultValue: 'yes',
        toolbar: {
            title: 'Break word',
            items: ['yes', 'no'],
        },
    },
};

export const parameters = {
    options: {
        storySort: {
            method: 'alphabetical',
            order: ['About', 'Intro', 'Colors', 'Typography', 'Controls'],
        },
    },
    docs: {
        source: { type: 'code' },
    },
};
