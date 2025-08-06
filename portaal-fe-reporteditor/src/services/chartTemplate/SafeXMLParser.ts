/**
 * Safe XML/JSX parser using browser's DOMParser
 * This parser is designed to safely parse chart templates without eval()
 */

export interface ParsedNode {
  type: string;
  props: Record<string, any>;
  children?: (ParsedNode | string)[];
}

export class SafeXMLParser {
  private parser: DOMParser;

  constructor() {
    this.parser = new DOMParser();
  }

  /**
   * Pre-process JSX-style attributes to make them XML-compliant
   */
  private preprocessJSXAttributes(xml: string): string {
    let result = xml;
    
    // Function to find matching closing braces, accounting for nested braces
    const findClosingBrace = (str: string, startIndex: number): number => {
      let depth = 1;
      let inString = false;
      let stringChar = '';
      
      for (let i = startIndex; i < str.length; i++) {
        const char = str[i];
        const prevChar = i > 0 ? str[i - 1] : '';
        
        // Handle string boundaries
        if ((char === '"' || char === "'") && prevChar !== '\\') {
          if (!inString) {
            inString = true;
            stringChar = char;
          } else if (char === stringChar) {
            inString = false;
          }
        }
        
        // Count braces only outside of strings
        if (!inString) {
          if (char === '{') depth++;
          if (char === '}') {
            depth--;
            if (depth === 0) return i;
          }
        }
      }
      
      return -1;
    };
    
    // Process the string character by character to handle nested structures
    let processed = '';
    let i = 0;
    
    while (i < result.length) {
      // Look for attribute={
      const attrMatch = result.slice(i).match(/^(\w+)=\{/);
      
      if (attrMatch) {
        const attrName = attrMatch[1];
        const attrStart = i + attrMatch[0].length;
        
        // Check if it's a double brace {{
        if (result[attrStart] === '{') {
          // Find the matching closing }}
          const innerStart = attrStart + 1;
          const closingIndex = findClosingBrace(result, innerStart);
          
          if (closingIndex !== -1 && result[closingIndex + 1] === '}') {
            // Extract the inner content
            const innerContent = result.slice(innerStart, closingIndex);
            // Escape quotes for XML
            const escaped = innerContent.replace(/"/g, '&quot;');
            // Add the processed attribute
            processed += `${attrName}="{${escaped}}"`;
            // Skip past the closing }}
            i = closingIndex + 2;
            continue;
          }
        } else {
          // Single brace expression like {$data$}
          const closingIndex = findClosingBrace(result, attrStart);
          
          if (closingIndex !== -1) {
            // Extract the content
            const content = result.slice(attrStart, closingIndex);
            // Escape quotes for XML
            const escaped = content.replace(/"/g, '&quot;');
            // Add the processed attribute
            processed += `${attrName}="{${escaped}}"`;
            // Skip past the closing }
            i = closingIndex + 1;
            continue;
          }
        }
      }
      
      // No match, copy character as-is
      processed += result[i];
      i++;
    }
    
    return processed;
  }

  /**
   * Parse XML string to ParsedNode structure
   */
  parse(xmlString: string): ParsedNode {
    // Pre-process the string to fix JSX-style attributes
    const preprocessedXml = this.preprocessJSXAttributes(xmlString);
    
    // Wrap in a root element if needed
    const wrappedXml = preprocessedXml.trim().startsWith('<?xml') 
      ? preprocessedXml 
      : `<?xml version="1.0" encoding="UTF-8"?><root>${preprocessedXml}</root>`;

    const doc = this.parser.parseFromString(wrappedXml, 'text/xml');
    
    // Check for parse errors
    const parseError = doc.querySelector('parsererror');
    if (parseError) {
      throw new Error(`XML Parse Error: ${parseError.textContent}`);
    }

    // Get the actual root element (skip the wrapper if we added it)
    const root = doc.documentElement.tagName === 'root' && doc.documentElement.children.length === 1
      ? doc.documentElement.children[0]
      : doc.documentElement;

    return this.parseElement(root);
  }

  /**
   * Parse a DOM element to ParsedNode
   */
  private parseElement(element: Element): ParsedNode {
    const node: ParsedNode = {
      type: element.tagName,
      props: this.parseAttributes(element)
    };

    const children: (ParsedNode | string)[] = [];

    // Parse child nodes
    for (let i = 0; i < element.childNodes.length; i++) {
      const child = element.childNodes[i];

      if (child.nodeType === Node.ELEMENT_NODE) {
        children.push(this.parseElement(child as Element));
      } else if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent?.trim();
        if (text) {
          children.push(text);
        }
      }
    }

    if (children.length > 0) {
      node.children = children;
    }

    return node;
  }

  /**
   * Parse element attributes
   */
  private parseAttributes(element: Element): Record<string, any> {
    const props: Record<string, any> = {};

    for (let i = 0; i < element.attributes.length; i++) {
      const attr = element.attributes[i];
      props[attr.name] = this.parseAttributeValue(attr.value);
    }

    return props;
  }

  /**
   * Parse attribute values, handling special cases
   */
  private parseAttributeValue(value: string): any {
    // Handle special placeholders
    if (value === '{$data$}') {
      return { __placeholder: 'data' };
    }
    if (value === '{$minDate$}') {
      return { __placeholder: 'minDate' };
    }
    if (value === '{$maxDate$}') {
      return { __placeholder: 'maxDate' };
    }

    // Handle boolean values
    if (value === 'true') return true;
    if (value === 'false') return false;

    // Handle numbers
    if (/^-?\d+(\.\d+)?$/.test(value)) {
      return parseFloat(value);
    }

    // Handle objects/arrays in attributes (simplified)
    if (value.startsWith('{') && value.endsWith('}')) {
      try {
        // Parse simple object notation
        // This is a simplified parser - enhance for production
        const innerValue = value.slice(1, -1).trim();
        
        // Handle simple key-value pairs
        if (innerValue.includes(':')) {
          const obj: Record<string, any> = {};
          
          // Special handling for format strings like "format: '{0:MMM yyyy}'"
          if (innerValue.includes('format') && innerValue.includes('{0')) {
            // Extract format string carefully
            const formatMatch = innerValue.match(/format\s*:\s*["']([^"']+)["']/);
            if (formatMatch) {
              obj.format = formatMatch[1];
              // Remove the format part and parse the rest
              const remainingValue = innerValue.replace(formatMatch[0], '').trim();
              if (remainingValue && remainingValue !== ',') {
                const pairs = this.parseObjectPairs(remainingValue);
                pairs.forEach(pair => {
                  const [key, val] = pair.split(':').map(s => s.trim());
                  if (key) {
                    obj[key.replace(/['"]/g, '')] = this.parseValue(val);
                  }
                });
              }
            } else {
              // Fallback to regular parsing
              const pairs = this.parseObjectPairs(innerValue);
              pairs.forEach(pair => {
                const [key, val] = pair.split(':').map(s => s.trim());
                obj[key.replace(/['"]/g, '')] = this.parseValue(val);
              });
            }
          } else {
            const pairs = this.parseObjectPairs(innerValue);
            pairs.forEach(pair => {
              const [key, val] = pair.split(':').map(s => s.trim());
              obj[key.replace(/['"]/g, '')] = this.parseValue(val);
            });
          }
          
          return obj;
        }
        
        // Handle placeholders
        if (innerValue === '$data$') {
          return { __placeholder: 'data' };
        }
        if (innerValue === '$minDate$') {
          return { __placeholder: 'minDate' };
        }
        if (innerValue === '$maxDate$') {
          return { __placeholder: 'maxDate' };
        }
      } catch (e) {
        // If parsing fails, return as string
        return value;
      }
    }

    // Default to string
    return value;
  }

  /**
   * Parse object pairs, handling nested structures
   */
  private parseObjectPairs(str: string): string[] {
    const pairs: string[] = [];
    let currentPair = '';
    let depth = 0;
    let inQuotes = false;
    let quoteChar = '';

    for (let i = 0; i < str.length; i++) {
      const char = str[i];

      // Handle quotes
      if ((char === '"' || char === "'") && (i === 0 || str[i - 1] !== '\\')) {
        if (!inQuotes) {
          inQuotes = true;
          quoteChar = char;
        } else if (char === quoteChar) {
          inQuotes = false;
        }
      }

      // Handle nested objects
      if (!inQuotes) {
        if (char === '{' || char === '[') depth++;
        if (char === '}' || char === ']') depth--;
        
        // Split on comma only at depth 0
        if (char === ',' && depth === 0) {
          pairs.push(currentPair.trim());
          currentPair = '';
          continue;
        }
      }

      currentPair += char;
    }

    if (currentPair.trim()) {
      pairs.push(currentPair.trim());
    }

    return pairs;
  }

  /**
   * Parse a value string
   */
  private parseValue(val: string): any {
    val = val.trim();

    // Remove quotes
    if ((val.startsWith('"') && val.endsWith('"')) || 
        (val.startsWith("'") && val.endsWith("'"))) {
      return val.slice(1, -1);
    }

    // Boolean
    if (val === 'true') return true;
    if (val === 'false') return false;

    // Number
    if (/^-?\d+(\.\d+)?$/.test(val)) {
      return parseFloat(val);
    }

    // Object or array
    if (val.startsWith('{') || val.startsWith('[')) {
      try {
        // Attempt to parse as JSON
        return JSON.parse(val.replace(/'/g, '"'));
      } catch {
        return val;
      }
    }

    return val;
  }
}