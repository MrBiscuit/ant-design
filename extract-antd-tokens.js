const { theme } = require('antd');
const fs = require('fs');
const path = require('path');

console.log('🎨 Starting Ant Design Token Extraction...\n');

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
  
  // Get component-specific tokens
  console.log('🧩 Extracting component-specific tokens...');
  const componentTokens = {};
  
  // Create a theme config that includes all components
  const themeConfig = {
    components: {}
  };
  
  components.forEach(component => {
    themeConfig.components[component] = {};
  });
  
  // Get tokens with all components configured
  const allComponentTokens = theme.getDesignToken(themeConfig);
  
  // Extract component-specific tokens
  components.forEach(component => {
    if (allComponentTokens[component.toLowerCase()]) {
      componentTokens[component] = allComponentTokens[component.toLowerCase()];
    }
  });
  
  // Get seed tokens (primitive tokens)
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
    }
  });
  
  // Organize all tokens
  const allTokens = {
    metadata: {
      extractedAt: new Date().toISOString(),
      antdVersion: require('antd/package.json').version,
      description: 'Complete Ant Design token extraction using official getDesignToken API',
      totalComponents: components.length,
      extractedComponents: Object.keys(componentTokens).length
    },
    global: globalTokens,
    themes: {
      light: lightTokens,
      dark: darkTokens,
      compact: compactTokens
    },
    seed: seedTokens,
    components: componentTokens,
    componentsList: components
  };
  
  // Save the tokens to a JSON file
  const outputFile = 'antd-tokens-programmatic.json';
  fs.writeFileSync(outputFile, JSON.stringify(allTokens, null, 2));
  
  // Generate summary
  const tokenCount = Object.keys(globalTokens).length;
  const componentCount = Object.keys(componentTokens).length;
  
  console.log('\n✨ Successfully exported Ant Design tokens!');
  console.log(`📄 File: ${outputFile}`);
  console.log(`🎯 Global tokens: ${tokenCount}`);
  console.log(`🧩 Component tokens: ${componentCount} components`);
  console.log(`📊 Total file size: ${(fs.statSync(outputFile).size / 1024).toFixed(2)} KB`);
  console.log(`🔢 Ant Design version: ${require('antd/package.json').version}`);
  
  // Also create a simplified version for quick reference
  const simplifiedTokens = {
    metadata: allTokens.metadata,
    globalTokensSample: Object.fromEntries(
      Object.entries(globalTokens).slice(0, 50)
    ),
    componentsSample: Object.fromEntries(
      Object.entries(componentTokens).slice(0, 5)
    ),
    totalGlobalTokens: Object.keys(globalTokens).length,
    totalComponents: Object.keys(componentTokens).length
  };
  
  fs.writeFileSync('antd-tokens-summary.json', JSON.stringify(simplifiedTokens, null, 2));
  console.log('📋 Summary file: antd-tokens-summary.json');
  
} catch (error) {
  console.error('❌ Error extracting tokens:', error);
  process.exit(1);
}