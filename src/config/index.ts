// 中文友情链接
import LogoBilibili from '@/assets/footer/bilibili.png';
import LogoInfoq from '@/assets/footer/infoq.png';
import LogoJuejin from '@/assets/footer/juejin.png';
import LogoOschina from '@/assets/footer/oschina.png';
import LogoCsdn from '@/assets/footer/csdn.png';
import Logo51cto from '@/assets/footer/51cto.png';

// 英文、俄文友情链接
import LogoRedditSquare from '@/assets/footer/reddit-square@2x.png';
import LogoBilibili2 from '@/assets/footer/bilibili@2x.png';
import LogoLinkedin from '@/assets/footer/linkedin@2x.png';
import LogoYoutube from '@/assets/footer/youtube@2x.png';
import LogoTwitter from '@/assets/footer/twitter@2x.png';

// 友情链接
export const linksData: any = {
  zh: [
    {
      path: 'https://my.oschina.net/openeuler',
      logo: LogoOschina,
      id: 'oschina',
    },
    {
      path: 'https://blog.csdn.net/openEuler_?spm=1000.2115.3001.5343',
      logo: LogoCsdn,
      id: 'csdn',
    },
    {
      path: 'https://juejin.cn/user/3183782863845454',
      logo: LogoJuejin,
      id: 'juejin',
    },
    {
      path: 'https://space.bilibili.com/527064077/channel/series',
      logo: LogoBilibili,
      id: 'bilibili',
    },
    {
      path: 'https://www.infoq.cn/profile/6E6CE3E2316F28/publish',
      logo: LogoInfoq,
      id: 'infoq',
    },
    {
      path: 'https://blog.51cto.com/u_14948868',
      logo: Logo51cto,
      id: '51cto',
    },
  ],
  en: [
    {
      path: 'https://www.reddit.com/r/openEuler/',
      logo: LogoRedditSquare,
      id: 'reddit-square',
    },
    {
      path: 'https://www.linkedin.com/company/openeuler',
      logo: LogoLinkedin,
      id: 'linkedin',
    },
    {
      path: 'https://twitter.com/openEuler',
      logo: LogoTwitter,
      id: 'twitter',
    },
    {
      path: 'https://space.bilibili.com/527064077/channel/series',
      logo: LogoBilibili2,
      id: 'bilibili',
    },
    {
      path: 'https://www.youtube.com/channel/UCPzSqXqCgmJmdIicbY7GAeA',
      logo: LogoYoutube,
      id: 'youtube',
    },
  ],
};
// 隐私链接
export const linksData2: any = {
  zh: [
    {
      NAME: '品牌',
      URL: 'https://www.openeuler.org/zh/other/brand/',
    },
    {
      NAME: '隐私政策',
      URL: 'https://www.openeuler.org/zh/other/privacy/',
    },
    {
      NAME: '法律声明',
      URL: 'https://www.openeuler.org/zh/other/legal/',
    },
  ],
  en: [
    {
      NAME: 'Trademark',
      URL: 'https://www.openeuler.org/en/other/brand/',
    },
    {
      NAME: 'Privacy Policy',
      URL: 'https://www.openeuler.org/en/other/privacy/',
    },
    {
      NAME: 'Legal Notice',
      URL: 'https://www.openeuler.org/en/other/legal/',
    },
  ],
};
