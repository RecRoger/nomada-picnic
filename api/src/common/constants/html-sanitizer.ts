import sanitize from 'sanitize-html';

export const sanitizeContent = (dirtyHtml: string): string => {
  return sanitize(dirtyHtml, {
    allowedTags: [
      'address', 'article', 'aside', 'footer', 'header', 'h1', 'h2', 'h3', 'h4',
      'h5', 'h6', 'hgroup', 'main', 'nav', 'section', 'blockquote', 'dd', 'div',
      'dl', 'dt', 'figcaption', 'figure', 'hr', 'li', 'main', 'ol', 'p', 'pre',
      'ul', 'a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'code', 'data', 'dfn',
      'em', 'i', 'kbd', 'mark', 'q', 'rb', 'rp', 'rt', 'rtc', 'ruby', 's', 'samp',
      'small', 'span', 'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr', 'caption',
      'col', 'colgroup', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr'
    ],
    allowedAttributes: {
      'a': ['href', 'name', 'target'],
      'span': ['style'], // Permitimos style para los colores y tamaños de TinyMCE
      'p': ['style'],
      '*': ['class'] // Si usas clases de CSS específicas
    },
    allowedStyles: {
      '*': {
        // Solo permitimos estilos que no rompan el layout ni ejecuten código
        'color': [/^#(000000|[0-9a-fA-F]{3,6})$/i, /^rgb\(/],
        'background-color': [/^#(000000|[0-9a-fA-F]{3,6})$/i, /^rgb\(/],
        'text-align': [/^left$/, /^right$/, /^center$/, /^justify$/],
        'font-size': [/^\d+(?:px|em|pt|%)$/]
      }
    }
  });
};