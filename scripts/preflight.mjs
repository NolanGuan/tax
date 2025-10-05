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

const siteConfig = siteModule.siteConfig;
const globalSeoConfig = seoModule.getGlobalSeoConfig();

const warnings = [];
const errors = [];

if (!siteConfig) {
  errors.push('未能加载 siteConfig，请检查 src/config/site.ts');
}

if (siteConfig) {
  if (siteConfig.domain === 'umamusume-guide.com') {
    warnings.push('请在 src/config/site.ts 中更新 domain，避免使用模板默认值。');
  }
  if (siteConfig.contactEmail === 'hello@umamusume-guide.com') {
    warnings.push('请在 src/config/site.ts 中更新 contactEmail。');
  }
  if (!siteConfig.announcement?.message) {
    warnings.push('公告栏内容为空，可在 src/config/site.ts 中设置 announcement。');
  }
  const ogImagePath = resolve(projectRoot, 'public', siteConfig.defaultOgImage.replace(/^\//, ''));
  if (!existsSync(ogImagePath)) {
    errors.push(`未找到默认 OG 图片：${ogImagePath}`);
  }
}

if (globalSeoConfig) {
  const missingDescriptions = Object.entries(globalSeoConfig.pages).filter(([, value]) => !value.description?.trim());
  if (missingDescriptions.length) {
    errors.push(`以下页面缺少描述：${missingDescriptions.map(([key]) => key).join(', ')}`);
  }
}

const postsDir = resolve(projectRoot, 'content/posts');
if (!existsSync(postsDir)) {
  warnings.push('content/posts 目录不存在，博客将不会展示文章。');
} else {
  const posts = readdirSync(postsDir).filter((file) => file.endsWith('.md') || file.endsWith('.mdx'));
  if (posts.length === 0) {
    warnings.push('content/posts 目录中没有 Markdown/MDX 文件。');
  }
}

const todoMatches = collectTodoMarkers(resolve(projectRoot, 'src'))
  .concat(collectTodoMarkers(resolve(projectRoot, 'content')));
if (todoMatches.length) {
  warnings.push(`请处理以下 TODO/FIXME：\n${todoMatches.join('\n')}`);
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
  const status = errors.length ? '❌ 预检查未通过' : '✅ 预检查完成';
  console.log(status);

  if (errors.length) {
    console.log('\n需要立即处理的项:');
    errors.forEach((error) => console.log(`  • ${error}`));
  }

  if (warnings.length) {
    console.log('\n建议处理的项:');
    warnings.forEach((warning) => console.log(`  • ${warning}`));
  }

  if (!errors.length && !warnings.length) {
    console.log('\n没有发现可疑项，可以继续部署流程。');
  }

  process.exit(errors.length ? 1 : 0);
}

function typeCheckPrerequisites() {
  if (!ts || !ts.transpileModule) {
    console.error('缺少 TypeScript 依赖，无法运行预检查。');
    process.exit(1);
  }
}
