import { AssistantInsetsCommand } from '@salutejs/client';
import React from 'react';

import { AppStateContext } from '../components/PlasmaApp/AppStateContext';

export function useInsets(): AssistantInsetsCommand['insets'] {
    const {
        state: {
            ui: { insets },
        },
    } = React.useContext(AppStateContext);

    return insets;
}
