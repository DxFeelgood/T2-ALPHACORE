import React, { useMemo } from 'react';
import katex from 'katex';

interface MathViewProps {
  math?: string;
  block?: boolean;
  className?: string;
  textWithMath?: string;
}

export const MathView: React.FC<MathViewProps> = ({
  math,
  block = false,
  className = '',
  textWithMath,
}) => {
  const renderedContent = useMemo(() => {
    // If explicit math prop is provided
    if (math !== undefined) {
      try {
        const html = katex.renderToString(math, {
          displayMode: block,
          throwOnError: false,
          output: 'html',
        });
        return { __html: html };
      } catch (e) {
        return { __html: `<span class="font-mono text-amber-700">${math}</span>` };
      }
    }

    // If textWithMath is provided (mix of text and $...$ or $$...$$ formulas)
    if (textWithMath) {
      try {
        // Simple parser for $...$ (inline) and $$...$$ (block)
        let processed = textWithMath;
        
        // Match $$...$$
        processed = processed.replace(/\$\$(.*?)\$\$/gs, (_, formula) => {
          try {
            return katex.renderToString(formula, { displayMode: true, throwOnError: false });
          } catch {
            return formula;
          }
        });

        // Match $...$
        processed = processed.replace(/\$(.*?)\$/g, (_, formula) => {
          try {
            return katex.renderToString(formula, { displayMode: false, throwOnError: false });
          } catch {
            return formula;
          }
        });

        return { __html: processed };
      } catch (e) {
        return { __html: textWithMath };
      }
    }

    return { __html: '' };
  }, [math, block, textWithMath]);

  if (block) {
    return (
      <div
        className={`my-2 py-2 px-3 bg-slate-900/5 dark:bg-slate-800/40 rounded-lg overflow-x-auto text-center ${className}`}
        dangerouslySetInnerHTML={renderedContent}
      />
    );
  }

  return (
    <span
      className={`inline-block mx-0.5 align-middle ${className}`}
      dangerouslySetInnerHTML={renderedContent}
    />
  );
};
