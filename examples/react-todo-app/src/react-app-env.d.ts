/// <reference types="react" />

declare namespace React {
  interface FunctionComponent<P = {}> {
    (props: P, context?: any): React.ReactNode;
  }
}

declare module '@stdbl/wao/react' {
  import { FC, ReactNode } from 'react';

  interface WAOProviderProps {
    autoActivate?: boolean;
    children: ReactNode;
  }

  interface WAOPageProps {
    structure: {
      title: string;
      mainContent: string;
      navigation?: string | null;
      footer?: string | null;
    };
    children: ReactNode;
  }

  interface WAOToggleProps {}

  interface WAOInspectorProps {
    autoAnalyze?: boolean;
  }

  export const WAOProvider: FC<WAOProviderProps>;
  export const WAOPage: FC<WAOPageProps>;
  export const WAOToggle: FC<WAOToggleProps>;
  export const WAOInspector: FC<WAOInspectorProps>;
  export const WAOElement: FC<any>;
  export const useWAO: () => any;
}
