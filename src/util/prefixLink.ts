export function prefixLink(src: string, shopDomain: string) {
    if (!src || src === '') return '';
  
    if (!src.startsWith('https://')) {
      return 'https://www.' + shopDomain + src;
    }
    return src;
  }