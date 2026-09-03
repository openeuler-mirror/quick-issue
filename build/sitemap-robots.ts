import fs from 'fs';
import path from 'path';
import { loadEnv, type Plugin } from 'vite';

/**
 * SEO 路由列表：sitemap.xml 中需要暴露的规范 URL。
 *
 * 注意：此列表需与 src/routers/index.ts 中的实际路由保持一致。
 * 当路由发生增删改时，请同步更新此处，否则 sitemap 会与线上可访问页面脱节。
 * 仅收录有实际内容的页面路由（zh / en 各一份），不含仅作重定向的入口路径
 * （如 `/`、`/zh/`、`/en/`），重定向路径不应进入 sitemap。
 */
export const SEO_ROUTE_PATHS = [
  '/zh/issues',
  '/en/issues',
  '/zh/pulls',
  '/en/pulls',
  '/zh/new-issues',
  '/en/new-issues',
];

/**
 * 生成 sitemap.xml 与 robots.txt 的 Vite 插件。
 *
 * 在 `vite build` 的 closeBundle 阶段执行——此时 public/ 已复制、dist/ 已落盘，
 * 因此写入的文件会覆盖 public/robots.txt 的静态副本，并新增 sitemap.xml。
 *
 * 生产域名取自 .env.production 中的 VITE_COOKIE_DOMAIN：
 * 去掉前导点后拼为 `https://quickissue.${domain}`，例如
 *   .openeuler.org          -> https://quickissue.openeuler.org
 *   .openeuler.openatom.cn  -> https://quickissue.openeuler.openatom.cn
 * 两个生产域名各自对应一次构建（粘贴不同的 .env.production），
 * 每次只生成本域名对应的 SEO 文件。若 VITE_COOKIE_DOMAIN 缺失则打印告警并跳过，
 * 保留 public/robots.txt 作为兜底。
 */
export function sitemapRobotsPlugin(): Plugin {
  let root = process.cwd();
  let outDir = 'dist';
  return {
    name: 'sitemap-robots',
    apply: 'build',
    configResolved(config) {
      root = config.root;
      outDir = config.build.outDir;
    },
    closeBundle() {
      const env = loadEnv('production', root);
      const rawDomain = env.VITE_COOKIE_DOMAIN || '';
      if (!rawDomain) {
        console.warn(
          '[sitemap-robots] VITE_COOKIE_DOMAIN not found in .env.production, skipping sitemap & robots generation.'
        );
        return;
      }
      const domain = rawDomain.replace(/^\./, '');
      const siteUrl = `https://quickissue.${domain}`;
      const urls = SEO_ROUTE_PATHS.map(
        (p) => `  <url>\n    <loc>${siteUrl}${p}</loc>\n  </url>`
      ).join('\n');
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
      const robots = `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
      const outPath = path.resolve(root, outDir);
      fs.writeFileSync(path.join(outPath, 'sitemap.xml'), sitemap, 'utf8');
      fs.writeFileSync(path.join(outPath, 'robots.txt'), robots, 'utf8');
      console.log(`[sitemap-robots] Generated sitemap.xml and robots.txt for ${siteUrl}`);
    },
  };
}
