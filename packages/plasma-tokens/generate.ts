import fs from 'fs';
import path from 'path';
import {
    ROBO_COMMENT,
    HTML_FONT_SIZE,
    writeGeneratedToFS,
    extractTokenData,
    generateColorThemes,
    generateColorThemeValues,
    generateTokens,
    generateTypography,
    generateTypographyValues,
    generateTypoSystem,
    generateThemeJSON,
    generateThemeFromData,
    FullColorsList,
} from '@salutejs/plasma-tokens-utils';
import type { TypoSystem } from '@salutejs/plasma-tokens-utils';

import { baseColors, colorThemes, typoSystem, typo, sizes } from './data';
import type { ThemeTokens, TypographyTypes } from './data';
import * as tokenGroups from './tokenGroups';
import { generateColorThemesTokenDataGroups, typoArchetypes, shadows } from './lib/themeBuilder/generateTokens';
import { mapDeprecatedColorTokens } from './lib/themeBuilder/mapDeprecatedTokens';
import { upperFirstLetter } from './lib/themeBuilder/utils';

const OUT_DIR = 'src';
const COLORS_DIR = path.join(OUT_DIR, 'colors');
const BRANDS_DIR = path.join(OUT_DIR, 'brands');
const THEMES_DIR = path.join(OUT_DIR, 'themes');
const THEMES_VALUES_DIR = path.join(OUT_DIR, 'themesValues');
const TYPOGRAPHY_DIR = path.join(OUT_DIR, 'typography');
const TYPOGRAPHY_VALUES_DIR = path.join(OUT_DIR, 'typographyValues');
const TYPO_DIR = path.join(OUT_DIR, 'typo');
const ROOT_INDEX_TS = path.join(OUT_DIR, 'index.ts');

fs.existsSync(OUT_DIR) || fs.mkdirSync(OUT_DIR);

fs.existsSync(BRANDS_DIR) || fs.mkdirSync(BRANDS_DIR);

/** ========================================== **/
/** ========= Генерация цветов и тем ========= **/
/** ========================================== **/

// Генерация цветов
writeGeneratedToFS(COLORS_DIR, [
    // Файл с токенами CSS-Variables (с дефолтными значениями)
    { file: 'index.ts', content: generateTokens(colorThemes.darkSber, 'css', 'colors') },
    // Файл с токенами (JS-переменными) для инъекции значения напрямую
    { file: 'values.ts', content: generateTokens(colorThemes.darkSber) },
]);

// Генерация токенов для кастомных тем из data/themes
const themesColorTokenGroups = generateColorThemesTokenDataGroups();
// Добавляем старые токены для обратной совместимости
const themesColorTokenGroupsFallback = mapDeprecatedColorTokens(themesColorTokenGroups);

// Генерация и запись файлов тем для создания глобальных стилей
writeGeneratedToFS(THEMES_DIR, generateColorThemes({ ...themesColorTokenGroupsFallback, ...colorThemes }));

// Отдельные файлы для импорта в компонентах
writeGeneratedToFS(THEMES_VALUES_DIR, generateColorThemeValues({ ...themesColorTokenGroupsFallback, ...colorThemes }));

const brands = Object.keys(themesColorTokenGroups);

brands.forEach((brand) => {
    const brandDir = path.join(BRANDS_DIR, brand);
    const themeName = `dark${upperFirstLetter(brand)}`;
    const theme = themesColorTokenGroups[brand][themeName];

    writeGeneratedToFS(brandDir, [
        {
            file: 'index.ts',
            content: generateTokens(theme, 'css', 'colors'),
        },
        { file: 'values.ts', content: generateTokens(theme) },
    ]);
});

/** ========================================== **/
/** ===== Генерация размеров компонентов ===== **/
/** ========================================== **/

writeGeneratedToFS(OUT_DIR, [generateThemeFromData(sizes, 'sizes')]);

/** =================================================== **/
/** ========= Генерация типографической сетки ========= **/
/** =================================================== **/

// Типографика, разложенная по типам компонентов
writeGeneratedToFS(TYPOGRAPHY_DIR, generateTypography(typoSystem.typoStyles));

// Параметрическая система (к примеру, все размеры шрифтов / высоты строк)
writeGeneratedToFS(TYPOGRAPHY_VALUES_DIR, generateTypographyValues(typoSystem));

// Типографика по типам устройств для создания глобального стиля
writeGeneratedToFS(TYPO_DIR, generateTypoSystem(typo, sizes));

/** ====================================== **/
/** ========= Генерация index.ts ========= **/
/** ====================================== **/

const indexTsContent = `${ROBO_COMMENT}import * as colors from './colors';
import * as colorValues from './colors/values';
import * as typography from './typography';
import * as typographyValues from './typographyValues';

export { colors };
export { colorValues };
export { typography };
export { typographyValues };

export const sberPortalScale = ${typo.sberPortal.scale};
export const sberBoxScale = ${typo.sberBox.scale};
export const mobileScale = ${typo.mobile.scale};
export const scalingPixelBasis = ${HTML_FONT_SIZE};

export * from './colors';
export * from './sizes';
export * from './typography';
export * from './typographyValues';
export * from './typo';
export * from './themes';
`;

fs.writeFileSync(ROOT_INDEX_TS, indexTsContent);

/** ======================================== **/
/** =       GENERATION OF AMZN DICT        = **/
/** ======================================== **/

// Properties
const amznDictPropsDir = path.join('properties');
fs.existsSync(amznDictPropsDir) || fs.mkdirSync(amznDictPropsDir);

// Colors
const amznDictPropsColorsDir = path.join(amznDictPropsDir, 'color');
fs.existsSync(amznDictPropsColorsDir) || fs.mkdirSync(amznDictPropsColorsDir);

// Typo
const amznDictPropsTyposDir = path.join(amznDictPropsDir, 'typo');
fs.existsSync(amznDictPropsTyposDir) || fs.mkdirSync(amznDictPropsTyposDir);

// Brands
const amznDictPropsBrandsDir = path.join(amznDictPropsColorsDir, 'brands');
fs.existsSync(amznDictPropsBrandsDir) || fs.mkdirSync(amznDictPropsBrandsDir);

// Shadows
const amznDictPropsShadowsDir = path.join(amznDictPropsDir, 'shadow');
fs.existsSync(amznDictPropsShadowsDir) || fs.mkdirSync(amznDictPropsShadowsDir);

// BASE Colors
fs.writeFileSync(
    path.join(amznDictPropsColorsDir, 'base.json'),
    JSON.stringify(
        {
            color: {
                base: baseColors,
            },
        },
        null,
        2,
    ),
);
const convertGroupTokens = (tokenNames: Array<keyof typeof FullColorsList>, theme: ThemeTokens) => {
    const tokens = Object.entries(theme).reduce((acc, [key, token]) => {
        if (tokenNames.some((name) => name === key)) {
            acc[key as keyof typeof FullColorsList] = token;
        }
        return acc;
    }, {} as ThemeTokens);
    return tokens;
};

const convertGroupedTokenData = (theme: ThemeTokens): ThemeTokens => {
    return {
        ...convertGroupTokens(tokenGroups.textAndIcons, theme),
        ...convertGroupTokens(tokenGroups.buttons, theme),
        ...convertGroupTokens(tokenGroups.backgrounds, theme),
        ...convertGroupTokens(tokenGroups.surfaces, theme),
        ...convertGroupTokens(tokenGroups.speech, theme),
    };
};

// TODO: Это генерация устаревших цветовых токенов, необходимо удалить после перехода на новые токены
const generateColors = () => {
    const fixThemes = {} as { [key: string]: ThemeTokens };

    for (const [themeName, theme] of Object.entries(colorThemes)) {
        fixThemes[themeName] = convertGroupedTokenData(theme);
    }

    return fixThemes;
};

// Themes Colors
fs.writeFileSync(
    path.join(amznDictPropsColorsDir, 'theme.json'),
    JSON.stringify(
        {
            color: generateColors(),
        },
        null,
        2,
    ),
);

// Brands Themes
Object.entries(themesColorTokenGroups).forEach(([key, value]) => {
    fs.writeFileSync(
        path.join(amznDictPropsBrandsDir, `${key}.json`),
        JSON.stringify(
            {
                color: value,
            },
            null,
            2,
        ),
    );
});

// Themes Typo
Object.entries(typoArchetypes).forEach(([key, value]) => {
    fs.writeFileSync(
        path.join(amznDictPropsTyposDir, `${key}.json`),
        JSON.stringify(
            {
                typo: Object.entries(value.s).reduce(
                    (acc, [keys, values]) => ({
                        ...acc,
                        [keys]: {
                            value: values,
                        },
                    }),
                    {},
                ),
            },
            null,
            2,
        ),
    );
});

// Themes Shadow
Object.entries(shadows).forEach(([key, type]) => {
    fs.writeFileSync(
        path.join(amznDictPropsShadowsDir, `${key}.json`),
        JSON.stringify(
            {
                shadow: type,
            },
            null,
            2,
        ),
    );
});

/** ======================================== **/
/** =       GENERATION OF theme.json       = **/
/** ======================================== **/

// https://theme-ui.com/theme-spec/#styles
const addStylesToTypo = (t: TypoSystem<TypographyTypes>) => {
    const { typoStyles } = t;

    t.styles = {
        h1: {
            ...typoStyles.headline1,
            margin: 0,
        },
        h2: {
            ...typoStyles.headline2,
            margin: 0,
        },
        h3: {
            ...typoStyles.headline3,
            margin: 0,
        },
        h4: {
            ...typoStyles.headline4,
            margin: 0,
        },
        p: {
            ...typoStyles.paragraph1,
            margin: 0,
        },
        root: {
            ...typoStyles.body1,
            color: extractTokenData(colorThemes.darkSber).text,
            backgroundColor: extractTokenData(colorThemes.darkSber).background,
        },
    };

    return t;
};

fs.writeFileSync(
    'theme.json',
    generateThemeJSON(
        addStylesToTypo(typoSystem),
        // Dark Sber is default
        extractTokenData(colorThemes.darkSber),
        // Check https://theme-ui.com/theme-spec/#color-modes
        {
            darkSber: extractTokenData(colorThemes.darkSber),
            darkEva: extractTokenData(colorThemes.darkEva),
            darkJoy: extractTokenData(colorThemes.darkJoy),
            lightSber: extractTokenData(colorThemes.lightSber),
            lightEva: extractTokenData(colorThemes.lightEva),
            lightJoy: extractTokenData(colorThemes.lightJoy),
        },
    ),
);

// TODO: Забрать сетки из figma
// theme: {
//   breakpoints: [],
//   space: [],
//   borders: [],
//   radii: [],
//   sizes
//   width: [],
//   heights: [],
//   maxWidths: [],
//   zIndices
//   transitions
//   shadows
//   gradients: {},
// }
