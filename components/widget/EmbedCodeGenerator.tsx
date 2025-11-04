'use client';

import { useState } from 'react';

interface EmbedCodeGeneratorProps {
  slug: string;
}

export default function EmbedCodeGenerator({ slug }: EmbedCodeGeneratorProps) {
  const [embedType, setEmbedType] = useState<'iframe' | 'script'>('iframe');
  const [copied, setCopied] = useState(false);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yourapp.com';

  const iframeCode = `<iframe
  src="${appUrl}/widget/${slug}"
  width="100%"
  height="700"
  frameborder="0"
  style="border: none; border-radius: 8px;"
></iframe>`;

  const scriptCode = `<div id="reservation-widget"></div>
<script>
  (function() {
    var iframe = document.createElement('iframe');
    iframe.src = '${appUrl}/widget/${slug}';
    iframe.width = '100%';
    iframe.height = '700';
    iframe.frameBorder = '0';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '8px';
    document.getElementById('reservation-widget').appendChild(iframe);
  })();
</script>`;

  const code = embedType === 'iframe' ? iframeCode : scriptCode;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setEmbedType('iframe')}
          className={`px-4 py-2 rounded-lg transition ${
            embedType === 'iframe'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Iframe Embed
        </button>
        <button
          onClick={() => setEmbedType('script')}
          className={`px-4 py-2 rounded-lg transition ${
            embedType === 'script'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          JavaScript Embed
        </button>
      </div>

      <div className="relative">
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
          <code>{code}</code>
        </pre>
        <button
          onClick={copyToClipboard}
          className="absolute top-4 right-4 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition"
        >
          {copied ? 'Copied!' : 'Copy Code'}
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">How to use:</h4>
        <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
          <li>Copy the embed code above</li>
          <li>Paste it into your website's HTML where you want the booking form to appear</li>
          <li>The widget will automatically match your brand colors</li>
          <li>Customers can book directly from your website!</li>
        </ol>
      </div>

      <div className="flex gap-2">
        <a
          href={`/widget/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:text-indigo-800 text-sm"
        >
          Preview Widget →
        </a>
      </div>
    </div>
  );
}
