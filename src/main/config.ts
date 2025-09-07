export interface AppConfig {
  window: {
    width: number;
    height: number;
    minWidth: number;
    minHeight: number;
  };
  devTools: boolean;
  debug: boolean;
}

export const getAppConfig = (): AppConfig => ({
  window: {
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
  },
  devTools: process.env.NODE_ENV === 'development',
  debug: process.env.NODE_ENV === 'development',
});
