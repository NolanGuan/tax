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
  if (!siteConfig.announcement?.message) {
    warnings.push('Announcement banner is empty. Configure announcement in src/config/site.ts.');
  }
  const ogImagePath = resolve(projectRoot, 'public', siteConfig.defaultOgImage.replace(/^\//, ''));
  if (!existsSync(ogImagePath)) {
    errors.push(`Default OG image is missing: ${ogImagePath}`);
  }
}

if (globalSeoConfig) {
  const missingDescriptions = Object.entries(globalSeoConfig.pages).filter(([, value]) => !value.description?.trim());
  if (missingDescriptions.length) {
    errors.push(`Missing descriptions for pages: ${missingDescriptions.map(([key]) => key).join(', ')}`);
  }
}

if (calculatorConstants?.FEDERAL_RATES_2025) {
  const { dataYear } = calculatorConstants.FEDERAL_RATES_2025;
  const currentYear = new Date().getFullYear();
  if (dataYear < currentYear) {
    warnings.push(`Federal capital gains data still references ${dataYear}. Confirm whether it should be updated to ${currentYear}.`);
  }
}

if (!calculatorConstants?.STATE_CAPITAL_GAINS_DATA_SOURCE) {
  warnings.push('State capital gains data source is missing. Document it in src/config/tax-rates/state-2025.ts.');
}

const postsDir = resolve(projectRoot, 'content/posts');
if (!existsSync(postsDir)) {
  warnings.push('content/posts directory is missing, so the blog will not render any articles.');
} else {
  const posts = readdirSync(postsDir).filter((file) => file.endsWith('.md') || file.endsWith('.mdx'));
  if (posts.length === 0) {
    warnings.push('No Markdown/MDX files found in content/posts.');
  }
}

const todoMatches = collectTodoMarkers(resolve(projectRoot, 'src'))
  .concat(collectTodoMarkers(resolve(projectRoot, 'content')));
if (todoMatches.length) {
  warnings.push(`Resolve the following TODO/FIXME markers:\n${todoMatches.join('\n')}`);
}

report();

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
