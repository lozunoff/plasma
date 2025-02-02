import React from 'react';
import { Story, Meta } from '@storybook/react';
import { InSpacingDecorator, disableProps } from '@salutejs/plasma-sb-utils';

import { Image, ImageProps, Ratio } from '.';

const bases = ['div', 'img'];
const ratios = ['1/1', '3/4', '4/3', '9/16', '16/9', '1/2', '2/1'];

const propsToDisable = ['height', 'customRatio'];

export default {
    title: 'Content/Image',
    component: Image,
    decorators: [InSpacingDecorator],
    argTypes: {
        base: {
            options: bases,
            control: {
                type: 'inline-radio',
            },
        },
        ratio: {
            options: ratios,
            control: {
                type: 'select',
            },
        },
        ...disableProps(propsToDisable),
    },
} as Meta;

export const Default: Story<ImageProps & { ratio: Ratio }> = ({ base, ratio }) => (
    <div style={{ maxWidth: '10rem' }}>
        <Image
            src="./images/320_320_9.jpg"
            ratio={ratio}
            base={base as 'div'}
            alt="картинка для примера фоном"
            style={{ position: 'relative' }}
        />
    </div>
);

Default.args = {
    base: 'div',
    ratio: '1/1',
};
