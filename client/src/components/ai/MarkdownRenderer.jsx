import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useNavigate } from 'react-router-dom';
import { Map, Navigation, Ticket, ClipboardList, Info } from 'lucide-react';

const ActionButton = ({ type }) => {
  const navigate = useNavigate();

  const getActionConfig = (actionType) => {
    switch (actionType.toLowerCase()) {
      case 'open map':
        return { icon: <Map className="w-4 h-4" />, label: 'Open Map', route: '/map' };
      case 'navigate':
        return { icon: <Navigation className="w-4 h-4" />, label: 'Navigate', route: '/map' };
      case 'view ticket':
        return { icon: <Ticket className="w-4 h-4" />, label: 'View Ticket', route: '/tickets' };
      case 'view tasks':
        return { icon: <ClipboardList className="w-4 h-4" />, label: 'View Tasks', route: '/volunteer/tasks' };
      default:
        return { icon: <Info className="w-4 h-4" />, label: actionType, route: '#' };
    }
  };

  const config = getActionConfig(type);

  return (
    <button 
      onClick={() => config.route !== '#' && navigate(config.route)}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 mt-2 mb-1 mr-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors shadow-sm"
    >
      {config.icon}
      {config.label}
    </button>
  );
};

const MarkdownRenderer = ({ content }) => {
  // Regex to match [Action Name] but not normal markdown links
  const actionRegex = /\[(Open Map|Navigate|View Ticket|View Tasks)\]/gi;

  // Split content by the action regex so we can render buttons inline or block
  const parts = content.split(actionRegex);

  return (
    <div className="prose dark:prose-invert max-w-none prose-sm sm:prose-base">
      {parts.map((part, index) => {
        const isAction = ['Open Map', 'Navigate', 'View Ticket', 'View Tasks'].includes(part);
        
        if (isAction) {
          return <ActionButton key={index} type={part} />;
        }

        return (
          <ReactMarkdown
            key={index}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={dracula}
                    language={match[1]}
                    PreTag="div"
                    className="rounded-md"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={`${className} bg-muted px-1.5 py-0.5 rounded-md text-sm`} {...props}>
                    {children}
                  </code>
                );
              },
              table({ children }) {
                return (
                  <div className="overflow-x-auto my-4 rounded-lg border border-border">
                    <table className="min-w-full divide-y divide-border text-sm">
                      {children}
                    </table>
                  </div>
                );
              },
              th({ children }) {
                return <th className="bg-muted/50 px-4 py-3 text-left font-semibold">{children}</th>;
              },
              td({ children }) {
                return <td className="px-4 py-3 border-t border-border">{children}</td>;
              }
            }}
          >
            {part}
          </ReactMarkdown>
        );
      })}
    </div>
  );
};

export default MarkdownRenderer;
