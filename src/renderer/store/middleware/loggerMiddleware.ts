import { Middleware, AnyAction } from '@reduxjs/toolkit';
import { RootState } from '../index';

export const loggerMiddleware: Middleware<{}, RootState> = store => next => (action: unknown) => {
  const typedAction = action as AnyAction;
  if (process.env.NODE_ENV === 'development') {
    const startTime = performance.now();
    const prevState = store.getState();

    console.group(`Action: ${typedAction.type}`);
    console.log('Payload:', typedAction.payload);
    console.log('Previous State:', prevState);

    const result = next(action);

    const nextState = store.getState();
    const duration = performance.now() - startTime;

    console.log('Next State:', nextState);
    console.log(`Duration: ${duration.toFixed(2)}ms`);
    console.groupEnd();

    return result;
  }

  return next(action);
};
