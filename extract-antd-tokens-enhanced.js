const { theme } = require('antd');
const fs = require('fs');
const path = require('path');

console.log('🎨 Starting Enhanced Ant Design Token Extraction...\n');

// List of all Ant Design components to extract tokens for
const components = [
  'Affix', 'Alert', 'Anchor', 'AutoComplete', 'Avatar', 'BackTop', 'Badge',
  'Breadcrumb', 'Button', 'Calendar', 'Card', 'Carousel', 'Cascader',
  'Checkbox', 'Collapse', 'ColorPicker', 'DatePicker', 'Descriptions',
  'Divider', 'Drawer', 'Dropdown', 'Empty', 'FloatButton', 'Form',
  'Image', 'Input', 'InputNumber', 'Layout', 'List', 'Mentions', 'Menu',
  'Message', 'Modal', 'Notification', 'Pagination', 'Popconfirm', 'Popover',
  'Progress', 'Radio', 'Rate', 'Result', 'Segmented', 'Select', 'Skeleton',
  'Slider', 'Space', 'Spin', 'Statistic', 'Steps', 'Switch', 'Table',
  'Tabs', 'Tag', 'Timeline', 'TimePicker', 'Tooltip', 'Tour', 'Transfer',
  'Tree', 'TreeSelect', 'Typography', 'Upload', 'Watermark'
];

try {
  // Get the default global tokens
  console.log('📋 Extracting global tokens...');
  const globalTokens = theme.getDesignToken();
  
  // Get tokens for light theme
  console.log('🌞 Extracting light theme tokens...');
  const lightTokens = theme.getDesignToken({
    algorithm: theme.defaultAlgorithm,
  });
  
  // Get tokens for dark theme
  console.log('🌙 Extracting dark theme tokens...');
  const darkTokens = theme.getDesignToken({
    algorithm: theme.darkAlgorithm,
  });
  
  // Get tokens for compact theme
  console.log('📦 Extracting compact theme tokens...');
  const compactTokens = theme.getDesignToken({
    algorithm: theme.compactAlgorithm,
  });
  
  // Get compact + dark theme
  console.log('🌙📦 Extracting compact dark theme tokens...');
  const compactDarkTokens = theme.getDesignToken({
    algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
  });
  
  // Extract component-specific tokens with various configurations
  console.log('🧩 Extracting component-specific tokens...');
  const componentTokens = {};
  
  // Try different approaches to get component tokens
  components.forEach(component => {
    try {
      // Method 1: Try with component configuration
      const componentConfig = {
        components: {
          [component]: {
            // Add some common token overrides to trigger component token generation
            colorPrimary: '#1677ff',
            borderRadius: 6,
          }
        }
      };
      
      const tokensWithComponent = theme.getDesignToken(componentConfig);
      
      // Look for component-specific tokens in the result
      const componentKey = component.toLowerCase();
      if (tokensWithComponent[componentKey]) {
        componentTokens[component] = tokensWithComponent[componentKey];
      }
      
      // Also check for tokens that start with the component name
      const componentSpecificTokens = {};
      Object.keys(tokensWithComponent).forEach(key => {
        if (key.toLowerCase().startsWith(componentKey)) {
          componentSpecificTokens[key] = tokensWithComponent[key];
        }
      });
      
      if (Object.keys(componentSpecificTokens).length > 0) {
        componentTokens[component] = {
          ...componentTokens[component],
          ...componentSpecificTokens
        };
      }
      
    } catch (error) {
      console.log(`⚠️  Could not extract tokens for ${component}: ${error.message}`);
    }
  });
  
  // Get seed tokens with comprehensive configuration
  console.log('🌱 Extracting seed tokens...');
  const seedTokens = theme.getDesignToken({
    token: {
      colorPrimary: '#1677ff',
      colorSuccess: '#52c41a',
      colorWarning: '#faad14',
      colorError: '#ff4d4f',
      colorInfo: '#1677ff',
      colorTextBase: '#000',
      colorBgBase: '#fff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
      fontSize: 14,
      lineHeight: 1.5714285714285714,
      borderRadius: 6,
      sizeUnit: 4,
      sizeStep: 4,
      wireframe: false,
      motion: true,
    }
  });
  
  // Extract algorithm-specific tokens
  console.log('🔬 Extracting algorithm-specific differences...');
  const algorithmComparison = {
    default: theme.getDesignToken({ algorithm: theme.defaultAlgorithm }),
    dark: theme.getDesignToken({ algorithm: theme.darkAlgorithm }),
    compact: theme.getDesignToken({ algorithm: theme.compactAlgorithm }),
    compactDark: theme.getDesignToken({ algorithm: [theme.darkAlgorithm, theme.compactAlgorithm] })
  };
  
  // Extract tokens by categories
  console.log('📊 Categorizing tokens...');
  const categorizedTokens = {
    colors: {},
    typography: {},
    spacing: {},
    motion: {},
    borders: {},
    shadows: {},
    zIndex: {},
    opacity: {},
    breakpoints: {},
    other: {}
  };
  
  Object.entries(globalTokens).forEach(([key, value]) => {
    if (key.includes('color') || key.includes('Color') || key.match(/^(blue|red|green|yellow|purple|cyan|magenta|pink|orange|volcano|geekblue|gold|lime)\d*$/)) {
      categorizedTokens.colors[key] = value;
    } else if (key.includes('font') || key.includes('Font') || key.includes('lineHeight') || key.includes('LineHeight')) {
      categorizedTokens.typography[key] = value;
    } else if (key.includes('size') || key.includes('Size') || key.includes('padding') || key.includes('Padding') || key.includes('margin') || key.includes('Margin')) {
      categorizedTokens.spacing[key] = value;
    } else if (key.includes('motion') || key.includes('Motion') || key.includes('duration') || key.includes('Duration') || key.includes('ease') || key.includes('Ease')) {
      categorizedTokens.motion[key] = value;
    } else if (key.includes('border') || key.includes('Border') || key.includes('radius') || key.includes('Radius') || key.includes('lineWidth') || key.includes('LineWidth')) {
      categorizedTokens.borders[key] = value;
    } else if (key.includes('shadow') || key.includes('Shadow') || key.includes('boxShadow') || key.includes('BoxShadow')) {
      categorizedTokens.shadows[key] = value;
    } else if (key.includes('zIndex') || key.includes('ZIndex')) {
      categorizedTokens.zIndex[key] = value;
    } else if (key.includes('opacity') || key.includes('Opacity')) {
      categorizedTokens.opacity[key] = value;
    } else if (key.includes('screen') || key.includes('Screen')) {
      categorizedTokens.breakpoints[key] = value;
    } else {
      categorizedTokens.other[key] = value;
    }
  });
  
  // Organize all tokens
  const allTokens = {
    metadata: {
      extractedAt: new Date().toISOString(),
      antdVersion: require('antd/package.json').version,
      description: 'Enhanced Ant Design token extraction using official getDesignToken API',
      totalComponents: components.length,
      extractedComponents: Object.keys(componentTokens).length,
      totalGlobalTokens: Object.keys(globalTokens).length,
      categories: Object.keys(categorizedTokens).map(cat => ({
        name: cat,
        count: Object.keys(categorizedTokens[cat]).length
      }))
    },
    global: globalTokens,
    categorized: categorizedTokens,
    themes: {
      light: lightTokens,
      dark: darkTokens,
      compact: compactTokens,
      compactDark: compactDarkTokens
    },
    algorithmComparison: algorithmComparison,
    seed: seedTokens,
    components: componentTokens,
    componentsList: components
  };
  
  // Save the tokens to a JSON file
  const outputFile = 'antd-tokens-enhanced.json';
  fs.writeFileSync(outputFile, JSON.stringify(allTokens, null, 2));
  
  // Generate comprehensive statistics
  const stats = {
    totalTokens: Object.keys(globalTokens).length,
    componentTokens: Object.keys(componentTokens).length,
    colorTokens: Object.keys(categorizedTokens.colors).length,
    typographyTokens: Object.keys(categorizedTokens.typography).length,
    spacingTokens: Object.keys(categorizedTokens.spacing).length,
    motionTokens: Object.keys(categorizedTokens.motion).length,
    borderTokens: Object.keys(categorizedTokens.borders).length,
    shadowTokens: Object.keys(categorizedTokens.shadows).length,
    fileSize: `${(fs.statSync(outputFile).size / 1024).toFixed(2)} KB`,
    antdVersion: require('antd/package.json').version
  };
  
  console.log('\n✨ Successfully exported Enhanced Ant Design tokens!');
  console.log(`📄 File: ${outputFile}`);
  console.log(`🎯 Global tokens: ${stats.totalTokens}`);
  console.log(`🎨 Color tokens: ${stats.colorTokens}`);
  console.log(`📝 Typography tokens: ${stats.typographyTokens}`);
  console.log(`📏 Spacing tokens: ${stats.spacingTokens}`);
  console.log(`🎬 Motion tokens: ${stats.motionTokens}`);
  console.log(`🔲 Border tokens: ${stats.borderTokens}`);
  console.log(`🌫️  Shadow tokens: ${stats.shadowTokens}`);
  console.log(`🧩 Component tokens: ${stats.componentTokens} components`);
  console.log(`📊 Total file size: ${stats.fileSize}`);
  console.log(`🔢 Ant Design version: ${stats.antdVersion}`);
  
  // Create a comprehensive summary
  const enhancedSummary = {
    metadata: allTokens.metadata,
    statistics: stats,
    sampleTokens: {
      colors: Object.fromEntries(Object.entries(categorizedTokens.colors).slice(0, 20)),
      typography: Object.fromEntries(Object.entries(categorizedTokens.typography).slice(0, 10)),
      spacing: Object.fromEntries(Object.entries(categorizedTokens.spacing).slice(0, 10)),
      motion: Object.fromEntries(Object.entries(categorizedTokens.motion).slice(0, 10))
    },
    themeComparison: {
      lightVsDark: {
        different: Object.keys(lightTokens).filter(key => 
          JSON.stringify(lightTokens[key]) !== JSON.stringify(darkTokens[key])
        ).length,
        total: Object.keys(lightTokens).length
      },
      defaultVsCompact: {
        different: Object.keys(lightTokens).filter(key => 
          JSON.stringify(lightTokens[key]) !== JSON.stringify(compactTokens[key])
        ).length,
        total: Object.keys(lightTokens).length
      }
    }
  };
  
  fs.writeFileSync('antd-tokens-enhanced-summary.json', JSON.stringify(enhancedSummary, null, 2));
  console.log('📋 Enhanced summary: antd-tokens-enhanced-summary.json');
  
  // Create a Figma-ready token structure
  console.log('🎨 Creating Figma-ready token structure...');
  const figmaTokens = {
    version: "1.0.0",
    collections: {
      "antd-primitives": {
        name: "Ant Design Primitives",
        modes: {
          light: "Light",
          dark: "Dark"
        },
        tokens: {}
      },
      "antd-semantic": {
        name: "Ant Design Semantic",
        modes: {
          light: "Light",
          dark: "Dark"
        },
        tokens: {}
      },
      "antd-components": {
        name: "Ant Design Components",
        modes: {
          default: "Default",
          compact: "Compact"
        },
        tokens: {}
      }
    }
  };
  
  // Populate Figma tokens structure
  Object.entries(categorizedTokens.colors).forEach(([key, value]) => {
    if (typeof value === 'string' && value.startsWith('#')) {
      figmaTokens.collections["antd-primitives"].tokens[key] = {
        type: "color",
        value: {
          light: value,
          dark: darkTokens[key] || value
        }
      };
    }
  });
  
  fs.writeFileSync('antd-tokens-figma-ready.json', JSON.stringify(figmaTokens, null, 2));
  console.log('🎨 Figma-ready tokens: antd-tokens-figma-ready.json');
  
} catch (error) {
  console.error('❌ Error extracting tokens:', error);
  process.exit(1);
}