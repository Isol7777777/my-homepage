declare module "react-resizable-panels" {
  import * as React from "react";

  export interface PanelGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    direction?: "horizontal" | "vertical";
  }

  export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {}

  export interface PanelResizeHandleProps
    extends React.HTMLAttributes<HTMLDivElement> {}

  export const PanelGroup: React.FC<PanelGroupProps>;
  export const Panel: React.FC<PanelProps>;
  export const PanelResizeHandle: React.FC<PanelResizeHandleProps>;
}
