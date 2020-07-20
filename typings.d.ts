declare module "*.css";
declare module "*.less";
declare module "*.png";
declare module "*.svg" {
  export function ReactComponent(
    props: React.SVGProps<SVGSVGElement>
  ): React.ReactElement;
  const url: string;
  export default url;
}

declare module "@matejmazur/react-katex";

interface Window {
  MathLive: any;
  render: any;
}
