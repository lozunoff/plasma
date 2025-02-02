import styled from 'styled-components';
import { Tabs as BaseTabs } from '@salutejs/plasma-core';
import type { TabsProps as BaseTabsProps } from '@salutejs/plasma-core';

export interface TabsProps extends BaseTabsProps {}

/**
 * Контейнер вкладок, основной компонент для пользовательской сборки вкладок.
 */
export const Tabs = styled(BaseTabs)<TabsProps>`
    --tabs-margin: 1rem;
    --tab-focus-border-size: 0rem;

    gap: 0;
`;
