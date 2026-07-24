#!/usr/bin/env node
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import vm from 'vm';

const rootRequire = createRequire(import.meta.url);
const ts = rootRequire('typescript');
const moduleCache = new Map();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

typeCheckPrerequisites();

function loadTsModule(relativePath) {
  const filePath = relativePath.startsWith('/') ? relativePath : resolve(projectRoot, relativePath);

  if (moduleCache.has(filePath)) {
    return moduleCache.get(filePath);
  }

  const source = readFileSync(filePath, 'utf8');
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2019,
      esModuleInterop: true
    }
  });

  const module = { exports: {} };
  const localRequire = createTsAwareRequire(filePath);
  const sandbox = {
    module,
    exports: module.exports,
    require: localRequire,
    __dirname: dirname(filePath),
    __filename: filePath,
    process,
    console
  };
  vm.runInNewContext(transpiled.outputText, sandbox, { filename: filePath });
  moduleCache.set(filePath, module.exports);
  return module.exports;
}

function createTsAwareRequire(parentPath) {
  const parentDir = dirname(parentPath);
  return function tsAwareRequire(request) {
    if (request.startsWith('.')) {
      const withoutExt = resolve(parentDir, request);
      const tsPath = resolveModulePath(withoutExt, '.ts');
      if (tsPath) {
        return loadTsModule(tsPath);
      }
      const jsPath = resolveModulePath(withoutExt, '.js');
      if (jsPath) {
        return rootRequire(jsPath);
      }
    }
    return rootRequire(request);
  };
}

function resolveModulePath(basePath, ext) {
  const directPath = basePath.endsWith(ext) ? basePath : `${basePath}${ext}`;
  if (existsSync(directPath) && statSync(directPath).isFile()) {
    return directPath;
  }
  return null;
}

const siteModule = loadTsModule('src/config/site.ts');
const seoModule = loadTsModule('src/config/seo.ts');
const calculatorConstants = loadTsModule('src/features/calculators/core/constants.ts');

const siteConfig = siteModule.siteConfig;
const globalSeoConfig = seoModule.getGlobalSeoConfig();

const warnings = [];
const errors = [];

if (!siteConfig) {
  errors.push('Failed to load siteConfig. Check src/config/site.ts.');
}

if (siteConfig) {
  if (siteConfig.domain === 'cpmcalculation.com') {
    warnings.push('Update domain in src/config/site.ts instead of using the template default.');
  }
  if (siteConfig.contactEmail === 'hello@cpmcalculation.com') {
    warnings.push('Update contactEmail in src/config/site.ts.');
  }
  const ogImagePath = resolve(projectRoot, 'public', siteConfig.defaultOgImage.replace(/^\//, ''));
  if (!existsSync(ogImagePath)) {
    errors.push(`Default OG image is missing: ${ogImagePath}`);
  }
  const logoImagePath = resolve(projectRoot, 'public', siteConfig.logoImage.replace(/^\//, ''));
  if (!existsSync(logoImagePath)) {
    errors.push(`Organization logo is missing: ${logoImagePath}`);
  }
  if (siteConfig.logoImage === siteConfig.defaultOgImage) {
    errors.push('Organization logo and default social-preview image must be separate assets.');
  }
  if (!siteConfig.editorialUrl?.startsWith('/about')) {
    errors.push('Editorial identity must link to the About page.');
  }
}

if (globalSeoConfig) {
  const missingDescriptions = Object.entries(globalSeoConfig.pages).filter(([, value]) => !value.description?.trim());
  if (missingDescriptions.length) {
    errors.push(`Missing descriptions for pages: ${missingDescriptions.map(([key]) => key).join(', ')}`);
  }
  if (globalSeoConfig.robots.defaultDisallow.includes('/_next')) {
    errors.push('robots.txt must not block public /_next assets.');
  }
}

if (calculatorConstants?.FEDERAL_RATES) {
  const { dataYear, dataSourceUrl } = calculatorConstants.FEDERAL_RATES;
  if (dataYear !== calculatorConstants.CURRENT_TAX_YEAR) {
    errors.push(`Federal rate year ${dataYear} does not match supported tax year ${calculatorConstants.CURRENT_TAX_YEAR}.`);
  }
  if (!dataSourceUrl?.startsWith('https://www.irs.gov/')) {
    errors.push('Federal capital gains data must link to an official IRS source.');
  }
} else {
  errors.push('Federal capital gains rate configuration is missing.');
}

if (!calculatorConstants?.STATE_CAPITAL_GAINS_DATA_SOURCE) {
  errors.push('State capital gains data source is missing. Document it in the active state rate configuration.');
}

const requiredFooterPaths = ['/blog', '/contact', '/privacy', '/terms'];
const footerPaths = new Set([
  ...(siteConfig?.footer?.links ?? []).map((item) => item.href),
  ...(siteConfig?.footer?.resources ?? []).map((item) => item.href)
]);
const missingFooterPaths = requiredFooterPaths.filter((path) => !footerPaths.has(path));
if (missingFooterPaths.length) {
  errors.push(`Footer is missing required trust links: ${missingFooterPaths.join(', ')}`);
}

const layoutSource = readFileSync(resolve(projectRoot, 'app/layout.tsx'), 'utf8');
if (!layoutSource.includes('<ConsentManager />')) {
  errors.push('Root layout must load analytics through ConsentManager.');
}

const sitemapSource = readFileSync(resolve(projectRoot, 'app/sitemap.ts'), 'utf8');
if (/lastModified:\s*(today|new Date\(\))/.test(sitemapSource)) {
  errors.push('Sitemap lastModified must use a stable content date, not deployment time.');
}

const nextConfigSource = readFileSync(resolve(projectRoot, 'next.config.mjs'), 'utf8');
if (
  /source:\s*['"]\/blog['"][\s\S]{0,160}type:\s*['"]query['"][\s\S]{0,80}key:\s*['"]tag['"]/.test(
    nextConfigSource
  )
) {
  errors.push('Blog tag query redirect can preserve its query string and loop; remove it.');
}

const sourceText = collectSourceText([
  resolve(projectRoot, 'app'),
  resolve(projectRoot, 'src'),
  resolve(projectRoot, 'content')
]);
for (const forbiddenClaim of [
  'capitalgainsnavigator.com',
  'CPA-reviewed formulas',
  'Net Investment Income Tax and the additional Medicare surtax automatically apply',
  'expert commentary',
  'expert-written resources',
  'Expert insights on capital gains taxes'
]) {
  if (sourceText.includes(forbiddenClaim)) {
    errors.push(`Forbidden stale or unsupported claim remains: ${forbiddenClaim}`);
  }
}

if (/"reviewer"\s*:\s*""/.test(sourceText)) {
  errors.push('Editorial metadata must omit empty reviewer values.');
}

if (/isLongTerm:\s*holdingPeriodDays\s*>\s*365/.test(sourceText)) {
  errors.push('Holding-period classification must use a calendar-year anniversary, not a fixed day count.');
}

if (/pagead2\.googlesyndication\.com|adsbygoogle/.test(sourceText)) {
  errors.push('Advertising code is present before the external AdSense/CMP compliance gate is complete.');
}

const postsDir = resolve(projectRoot, 'content/posts');
if (!existsSync(postsDir)) {
  warnings.push('content/posts directory is missing, so the blog will not render any articles.');
} else {
  const posts = readdirSync(postsDir).filter((file) => file.endsWith('.md') || file.endsWith('.mdx'));
  if (posts.length === 0) {
    warnings.push('No Markdown/MDX files found in content/posts.');
  }
  const thinPosts = posts.filter((file) => {
    const source = readFileSync(resolve(postsDir, file), 'utf8');
    const body = source.replace(/^---[\s\S]*?---\s*/, '');
    return body.trim().split(/\s+/).filter(Boolean).length < 500;
  });
  if (thinPosts.length) {
    errors.push(`Indexable blog posts must contain at least 500 body words: ${thinPosts.join(', ')}`);
  }
}

const todoMatches = collectTodoMarkers(resolve(projectRoot, 'src'))
  .concat(collectTodoMarkers(resolve(projectRoot, 'content')));
if (todoMatches.length) {
  warnings.push(`Resolve the following TODO/FIXME markers:\n${todoMatches.join('\n')}`);
}

report();

function collectSourceText(rootDirs) {
  const chunks = [];
  const stack = [...rootDirs];
  while (stack.length) {
    const current = stack.pop();
    if (!current || !existsSync(current)) {
      continue;
    }
    const currentStat = statSync(current);
    if (currentStat.isDirectory()) {
      for (const entry of readdirSync(current)) {
        stack.push(resolve(current, entry));
      }
      continue;
    }
    if (/\.(ts|tsx|js|mjs|json|md|mdx)$/.test(current)) {
      chunks.push(readFileSync(current, 'utf8'));
    }
  }
  return chunks.join('\n');
}

function collectTodoMarkers(rootDir) {
  const matches = [];
  if (!existsSync(rootDir)) {
    return matches;
  }

  const stack = [rootDir];
  while (stack.length) {
    const current = stack.pop();
    const stats = statSync(current);
    if (stats.isDirectory()) {
      const entries = readdirSync(current);
      for (const entry of entries) {
        if (entry.startsWith('.')) continue;
        if (['node_modules', '.next', 'public'].includes(entry)) continue;
        stack.push(resolve(current, entry));
      }
    } else if (stats.isFile()) {
      const content = readFileSync(current, 'utf8');
      if (/TODO|FIXME/.test(content)) {
        matches.push(`- ${current.replace(projectRoot + '/', '')}`);
      }
    }
  }
  return matches;
}

function report() {
  const status = errors.length ? '❌ Preflight failed' : '✅ Preflight complete';
  console.log(status);

  if (errors.length) {
    console.log('\nIssues that need immediate attention:');
    errors.forEach((error) => console.log(`  • ${error}`));
  }

  if (warnings.length) {
    console.log('\nSuggested follow-ups:');
    warnings.forEach((warning) => console.log(`  • ${warning}`));
  }

  if (!errors.length && !warnings.length) {
    console.log('\nNo concerns detected. You can continue with deployment.');
  }

  process.exit(errors.length ? 1 : 0);
}

function typeCheckPrerequisites() {
  if (!ts || !ts.transpileModule) {
    console.error('TypeScript dependency is missing; preflight cannot run.');
    process.exit(1);
  }
}
