declare module '@lobehub/icons' {
  import { FC, SVGProps } from 'react';

  interface IconProps extends SVGProps<SVGSVGElement> {
    size?: number;
  }

  export const Claude: FC<IconProps>;
  export const Cursor: FC<IconProps>;
  export const Gemini: FC<IconProps>;
  export const Github: FC<IconProps>;
  export const Google: FC<IconProps>;
  export const Grok: FC<IconProps>;
  export const OpenAI: FC<IconProps>;
  export const Replicate: FC<IconProps>;
  export const Resend: FC<IconProps>;
  export const PerplexityAI: FC<IconProps>;
  export const YouTube: FC<IconProps>;
  export const Suno: FC<IconProps>;
}
