import styled from 'styled-components';
import { Container as BaseContainer } from '@salutejs/plasma-hope';

/**
 * Блок с полями по бокам для размещения контента по вертикали.
 * Блок нельзя вкладывать сам в себя или дальше по дереву.
 */
export const Container = styled(BaseContainer)`
    max-width: 125rem;
`;
