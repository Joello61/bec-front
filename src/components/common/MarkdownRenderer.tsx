import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  content, 
  className = '' 
}) => {
  const components: Components = {
    // Headings
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold text-gray-900 mb-6 mt-8 first:mt-0 border-b-2 border-blue-600 pb-3">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-semibold text-gray-900 mb-5 mt-8 border-b border-gray-200 pb-2">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold text-gray-800 mb-4 mt-6">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl font-semibold text-gray-800 mb-3 mt-5">
        {children}
      </h4>
    ),
    h5: ({ children }) => (
      <h5 className="text-lg font-semibold text-gray-700 mb-2 mt-4">
        {children}
      </h5>
    ),
    h6: ({ children }) => (
      <h6 className="text-base font-semibold text-gray-700 mb-2 mt-3">
        {children}
      </h6>
    ),

    // Paragraphs
    p: ({ children }) => (
      <p className="text-base text-gray-700 leading-relaxed mb-4">
        {children}
      </p>
    ),

    // Links
    a: ({ href, children }) => (
      <a 
        href={href} 
        className="text-blue-600 hover:text-blue-800 underline underline-offset-2 transition-colors duration-150 font-medium"
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),

    // Lists
    ul: ({ children }) => (
      <ul className="list-disc list-inside mb-4 ml-4 space-y-2 text-gray-700">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside mb-4 ml-4 space-y-2 text-gray-700">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="leading-relaxed ml-2">
        {children}
      </li>
    ),

    // Blockquote
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-600 bg-gray-50 pl-4 pr-4 py-3 mb-4 italic text-gray-700 rounded-r-lg">
        {children}
      </blockquote>
    ),

    // Code
    code: ({ className, children }) => {
      const isInline = !className;
      
      if (isInline) {
        return (
          <code className="bg-gray-100 text-red-600 px-2 py-0.5 rounded text-sm font-mono">
            {children}
          </code>
        );
      }
      
      return (
        <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg mb-4 overflow-x-auto text-sm font-mono leading-relaxed">
          {children}
        </code>
      );
    },
    pre: ({ children }) => (
      <pre className="mb-4 overflow-hidden rounded-lg">
        {children}
      </pre>
    ),

    // Table
    table: ({ children }) => (
      <div className="overflow-x-auto mb-6 shadow-sm">
        <table className="min-w-full divide-y divide-gray-300 border border-gray-300 rounded-lg">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-gray-100">
        {children}
      </thead>
    ),
    tbody: ({ children }) => (
      <tbody className="bg-white divide-y divide-gray-200">
        {children}
      </tbody>
    ),
    tr: ({ children }) => (
      <tr className="hover:bg-gray-50 transition-colors">
        {children}
      </tr>
    ),
    th: ({ children }) => (
      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-3 text-sm text-gray-700 border-t border-gray-200">
        {children}
      </td>
    ),

    // Horizontal Rule
    hr: () => (
      <hr className="my-8 border-t-2 border-gray-200" />
    ),

    // Strong & Em
    strong: ({ children }) => (
      <strong className="font-bold text-gray-900">
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em className="italic text-gray-800">
        {children}
      </em>
    ),
  };

  return (
    <div className={`markdown-content prose prose-lg max-w-none ${className}`}>
      <ReactMarkdown 
        components={components}
        remarkPlugins={[remarkGfm]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};


export default MarkdownRenderer;