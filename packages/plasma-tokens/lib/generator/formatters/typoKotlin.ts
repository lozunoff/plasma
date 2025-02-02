import type { Dictionary, TransformedToken } from 'style-dictionary';

import { upperFirstLetter } from '../../themeBuilder/utils';

const BASE_FONT_NAME = 'FontBase';
const ADDITIONAL_FONT_NAME = 'FontAdditional';

const fontWeightMap: Record<string, string> = {
    '100': 'Thin',
    '200': 'ExtraLight',
    '300': 'Light',
    '400': 'Normal',
    '500': 'Medium',
    '600': 'SemiBold',
    '700': 'Bold',
    '800': 'ExtraBold',
    '900': 'Black',
};

const getKotlinTemplate = (
    typoDataClassContent: string,
    typoStylesContent: string,
    typoObjectContent: string,
    baseFontFamily: string,
    additionalFontFamily: string,
) => {
    const baseFontFamilyName = baseFontFamily.replace(/ /g, '');
    const additionalFontFamilyName = additionalFontFamily.replace(/ /g, '');

    const isSameFont = baseFontFamilyName === additionalFontFamilyName;

    const header = `package ru.sbermarket.sm_theme.theme.typo

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import androidx.compose.ui.unit.em
import ru.sbermarket.sm_theme.R

private const val DEPRECATION_NOTICE = "Use font from 'relevant' section"
`;

    const dataClass = `// Spacings should be equal to superpixel or multiple thereof
data class SMTypography(
    @Deprecated(DEPRECATION_NOTICE, ReplaceWith("h3Bold"))
    val Title1: TextStyle,
    @Deprecated(DEPRECATION_NOTICE, ReplaceWith("h4Bold"))
    val Title2: TextStyle,
    @Deprecated(DEPRECATION_NOTICE, ReplaceWith("bodyM"))
    val Body: TextStyle,
    @Deprecated(DEPRECATION_NOTICE, ReplaceWith("bodyS"))
    val Footnote: TextStyle,
    @Deprecated(DEPRECATION_NOTICE, ReplaceWith("bodyXs"))
    val Caption: TextStyle,

    // ExtendedFonts
    @Deprecated(DEPRECATION_NOTICE, ReplaceWith("bodyLBold"))
    val HeadlineSemiBold: TextStyle,
    @Deprecated(DEPRECATION_NOTICE, ReplaceWith("bodyMBold"))
    val BodySemiBold: TextStyle,
    @Deprecated(DEPRECATION_NOTICE, ReplaceWith("bodySBold"))
    val FootnoteSemiBold: TextStyle,
    @Deprecated(DEPRECATION_NOTICE, ReplaceWith("bodyXsBold"))
    val CaptionSemiBold: TextStyle,

    /**
     *  new (relevant) fonts
     */
    val family: FontFamily,
    
${typoDataClassContent}
)
`;

    const baseFontVal = `// Font family SBSansDisplay
private val ${baseFontFamilyName} = FontFamily(
    Font(R.font.${baseFontFamilyName.toLocaleLowerCase()}_regular, FontWeight.Normal),
    Font(R.font.${baseFontFamilyName.toLocaleLowerCase()}_semibold, FontWeight.SemiBold),
    Font(R.font.${baseFontFamilyName.toLocaleLowerCase()}_bold, FontWeight.Bold)
)

private val ${BASE_FONT_NAME} = TextStyle(
    fontWeight = FontWeight.Normal,
    fontFamily = ${baseFontFamilyName},
    // lightColors.textPrimary
    color = Color(0xff24282b)
)${
        isSameFont
            ? `

/**
 *  new (relevant) fonts
 */`
            : `
private val ${additionalFontFamilyName} = FontFamily(
    Font(R.font.${additionalFontFamilyName.toLocaleLowerCase()}_regular, FontWeight.Normal),
    Font(R.font.${additionalFontFamilyName.toLocaleLowerCase()}_semibold, FontWeight.SemiBold),
    Font(R.font.${additionalFontFamilyName.toLocaleLowerCase()}_bold, FontWeight.Bold)
)

private val ${ADDITIONAL_FONT_NAME} = TextStyle(
    fontWeight = FontWeight.Normal,
    fontFamily = ${additionalFontFamilyName},
    color = lightPalette.textPrimary,
)

/**
 *  new (relevant) fonts
 */`
    }`;

    const deprecatedTypo = `// Main Fonts
    Title1 = h3Bold,
    Title2 = h4Bold,
    Body = bodyM,
    Footnote = bodyS,
    Caption = bodyXs,

    // Extended fonts
    HeadlineSemiBold = bodyLBold,
    BodySemiBold = bodyMBold,
    FootnoteSemiBold = bodySBold,
    CaptionSemiBold = bodyXsBold,`;

    const familyHeader = `family = ${baseFontFamilyName},

    ${deprecatedTypo}

    /**
     *  new (relevant) fonts
     */`;

    const typoObject = `internal val defaultTypo = SMTypography(\n    ${familyHeader}\n${typoObjectContent}\n)
    
/*
* To create subsequent Typos and Colored Typos use .copy
* E.g. val BodyCrossed = Body.copy(textDecoration = TextDecoration.LineThrough)
*
* */`;

    return [header, dataClass, baseFontVal, typoStylesContent, typoObject].join('\n');
};

const getFontFamilies = (tokenItems: TransformedToken[]): readonly [string, string] => {
    const [baseFontFamily, additionalFontFamily] = tokenItems.filter(
        ({ name }) => name === 'dsplL' || name === 'bodyL',
    );

    return [
        baseFontFamily?.value['font-family'] || 'SB Sans Display',
        additionalFontFamily?.value['font-family'] || 'SB Sans Text',
    ];
};

const getTokenValue = (token: TransformedToken, baseFontFamily: string, additionalFontFamily: string) => {
    const { name, value } = token;
    const defaultFontSize = 16;
    const isSameFont = baseFontFamily === additionalFontFamily;

    const typoMap: Record<string, string> = {
        [baseFontFamily]: BASE_FONT_NAME,
        [additionalFontFamily]: ADDITIONAL_FONT_NAME,
    };

    const fontFamily = isSameFont ? BASE_FONT_NAME : typoMap[value['font-family']];

    const fontSize = Number(value['font-size'].replace(/r?em/gi, '')) * defaultFontSize + '.sp';
    const lineHeight = Number(value['line-height'].replace(/r?em/gi, '')) * defaultFontSize + '.sp';
    const fontWeight = `FontWeight.${fontWeightMap[value['font-weight']]}`;
    const fontStyle = `FontStyle.${upperFirstLetter(value['font-style'])}`;
    const letterSpacing =
        value['letter-spacing'] === 'normal' ? 'normal' : Number(value['letter-spacing'].replace(/r?em/gi, '')) + '.em';

    return `private val ${name} = ${fontFamily}.copy(
    fontSize = ${fontSize},
    lineHeight = ${lineHeight},
    fontWeight = ${fontWeight},
    fontStyle = ${fontStyle},
${
    letterSpacing === 'normal'
        ? ')\n'
        : `    letterSpacing = ${letterSpacing},
)\n`
}`;
};

const getTypoDataClass = (tokenItems: TransformedToken[]) =>
    tokenItems.map((token) => `    val ${token.name}: TextStyle,`).join(`\n`);

const getTypoStyles = (tokenItems: TransformedToken[], baseFontFamily: string, additionalFontFamily: string) =>
    tokenItems.map((item) => getTokenValue(item, baseFontFamily, additionalFontFamily)).join(`\n`);

const getTypoObject = (tokenItems: TransformedToken[]) =>
    tokenItems.map((token) => `    ${token.name} = ${token.name},`).join(`\n`);

export const typoKotlinCustomFormatter = ({ dictionary }: { dictionary: Dictionary }) => {
    const [baseFontFamily, additionalFontFamily] = getFontFamilies(dictionary.allTokens);

    const typoDataClass = getTypoDataClass(dictionary.allTokens);
    const typoStyles = getTypoStyles(dictionary.allTokens, baseFontFamily, additionalFontFamily);
    const typoObject = getTypoObject(dictionary.allTokens);

    return getKotlinTemplate(typoDataClass, typoStyles, typoObject, baseFontFamily, additionalFontFamily);
};
