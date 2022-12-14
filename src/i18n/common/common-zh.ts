export default {
  MEETINGS_TIME: '会议时间：',
  MEETINGS_REPLAY: '回放链接',
  SEARCH_PLACE_HOLDER: '输入内容',
  COOKIE_LEGAL_TEXT: '本站点使用Cookies，继续浏览表示您同意我们使用Cookies。',
  COOKIE_LEGAL_LINK_TEXT: 'Cookies和隐私政策。',
  NAV_ROUTER: {
    DOWNLOAD: '下载',
    ISO: 'ISO',
    MIRRORLIST: '镜像仓列表',
    LEARNING: '学习',
    DOCS: '文档',
    MOOC: '慕课',
    INTERNSHIP: '实习',
    CONNECT: '互动',
    NEWS: '新闻',
    BLOG: '博客',
    LIVE: '直播',
    SALON: '沙龙',
    SUMMIT: '峰会',
    COMMUNITY: '社区',
    CONTRIBUTION: '贡献攻略',
    CONVENTION: '行为守则',
    MAILINGLIST: '邮件列表',
    CERTIFICATION: '个人认证',
    TALENT: '人才评测',
    STATISTICS: '贡献看板',
    SIG: 'SIG',
    SIGLIST: '查看SIG',
    APPLICATION: '申请流程',
    ROLES: '角色说明',
    MEETINGGUIDE: '会议指南',
    DISCOVERY: '探索',
    ATUNE: 'A-Tune',
    BISHENGJDK: 'BiSheng JDK',
    ISULA: 'iSula',
    SECGEAR: 'secGear',
    STRATOVIRT: 'StratoVirt',
    COMPASSCI: 'Compass-CI',
    COMPLIANCE: 'Compliance',
    PKGSHIP: 'Pkgship',
    SUPPORT: '支持',
    VULNERABILITY: '漏洞管理',
    SAFETY: '安全公告',
    CVE: 'CVE',
    COMPATIBILITY_EVALUATION: '兼容性技术测评',
    APPROVE: 'OSV技术测评列表',
    COMPATIBILITY: '兼容性列表',
    MIGRATION: '迁移专区',
  },
  NAV_ROUTER_CONFIG: [
    {
      PATH: '',
      NAME: '下载',
      ID: 'download',
      CHILDREN: [
        {
          NAME: 'ISO',
          ID: 'iso',
          PATH: '/download/',
        },
        {
          NAME: '镜像仓列表',
          ID: 'mirror-list',
          PATH: '/mirror/list/',
        },
      ],
      CLASS: ['download', 'mirror'],
    },
    {
      NAME: '学习',
      ID: 'learning',
      CHILDREN: [
        {
          NAME: '文档',
          PATH: '/zh/',
          ID: 'docs',
          IS_OPEN_WINDOW: 1,
        },
        {
          NAME: '慕课',
          ID: 'mooc',
          PATH: '/learn/mooc/',
        },
        {
          NAME: '实习',
          ID: 'internship',
          PATH: '/internship/',
        },
        {
          NAME: '学习培训',
          ID: 'training-assessment',
          PATH: 'https://training-assessment.osinfra.cn/',
          IS_OPEN_MINISITE_WINDOW: 1,
        },
      ],
      CLASS: ['learn', 'internship', 'learning'],
    },
    {
      PATH: '',
      NAME: '互动',
      ID: 'connect',
      CHILDREN: [
        {
          NAME: '新闻',
          ID: 'news',
          PATH: '/interaction/news-list/',
        },
        {
          NAME: '博客',
          ID: 'blog',
          PATH: '/interaction/blog-list/',
        },
        {
          NAME: '直播',
          ID: 'live',
          PATH: '/interaction/live-list/',
        },
        {
          NAME: '沙龙',
          ID: 'salon',
          PATH: '/interaction/salon-list/',
        },
        {
          NAME: '峰会',
          ID: 'summit',
          PATH: 'https://www.openeuler.org/zh/interaction/summit-list/devday2022/',
          IS_OPEN_MINISITE_WINDOW: 1,
        },
      ],
      CLASS: ['news', 'blog', 'live', 'salon'],
    },
    {
      PATH: '',
      NAME: '社区',
      ID: 'community',
      CHILDREN: [
        {
          NAME: '贡献攻略',
          ID: 'contribution',
          PATH: '/community/contribution/',
        },
        {
          NAME: '行为守则',
          ID: 'convention',
          PATH: '/community/conduct/',
        },
        {
          NAME: '邮件列表',
          ID: 'mailing-list',
          PATH: '/community/mailing-list/',
        },
        {
          NAME: '人才评定',
          ID: 'talent-assessment',
          PATH: 'https://talent-assessment.openeuler.org/',
          IS_OPEN_MINISITE_WINDOW: 1,
        },
        {
          NAME: 'HCIX认证',
          ID: 'certification-services',
          PATH: 'https://www.openeuler.org/zh/community/certification-services/',
          IS_OPEN_MINISITE_WINDOW: 1,
        },
        {
          NAME: '贡献看板',
          ID: 'statistics',
          PATH: 'https://datastat.openeuler.org/zh/overview',
          IS_OPEN_MINISITE_WINDOW: 1,
        },
      ],
      CLASS: ['contribution', 'conduct', 'mailing-list', 'certification'],
    },
    {
      PATH: '',
      NAME: 'SIG',
      ID: 'sig',
      CHILDREN: [
        {
          NAME: '查看SIG',
          ID: 'sig-list',
          PATH: '/sig/sig-list/',
        },
        {
          NAME: '申请流程',
          ID: 'application',
          PATH: '/sig/sig-guidance/',
        },
        {
          NAME: '角色说明',
          ID: 'roles',
          PATH: '/sig/role-description/',
        },
        {
          NAME: '会议指南',
          ID: 'meeting-guide',
          PATH: '/sig/meeting-guide/',
        },
      ],
      CLASS: ['sig-list', 'sig-guidance', 'role-description', 'meeting-guide'],
    },
    {
      PATH: '',
      NAME: '探索',
      ID: 'discovery',
      CHILDREN: [
        {
          NAME: 'A-Tune',
          ID: 'atune',
          PATH: '/other/projects/atune/',
        },
        {
          NAME: 'BiSheng JDK',
          ID: 'bishengjdk',
          PATH: '/other/projects/bishengjdk/',
        },
        {
          NAME: 'iSula',
          ID: 'isula',
          PATH: '/other/projects/isula/',
        },
        {
          NAME: 'secGear',
          ID: 'secgear',
          PATH: '/other/projects/secgear/',
        },
        {
          NAME: 'StratoVirt',
          ID: 'stratovirt',
          PATH: '/other/projects/stratovirt/',
        },
        {
          NAME: 'Compass-CI',
          ID: 'compass-ci',
          PATH: 'https://compass-ci.openeuler.org/',
          IS_OPEN_MINISITE_WINDOW: 1,
        },
        {
          NAME: 'Compliance',
          ID: 'compliance',
          PATH: 'https://compliance.openeuler.org/',
          IS_OPEN_MINISITE_WINDOW: 1,
        },
        {
          NAME: 'Pkgship',
          ID: 'pkgship',
          PATH: 'https://pkgmanage.openeuler.org/',
          IS_OPEN_MINISITE_WINDOW: 1,
        },
        {
          NAME: 'radiaTest',
          ID: 'radiaTest',
          PATH: 'https://radiatest.openeuler.org',
          IS_OPEN_MINISITE_WINDOW: 1,
        },
        {
          NAME: 'NestOS',
          ID: 'NestOS',
          PATH: 'https://nestos.openeuler.org/',
          IS_OPEN_MINISITE_WINDOW: 1,
        },
      ],
      CLASS: ['atune', 'bishengjdk', 'isula', 'secgear', 'stratovirt'],
    },
    {
      PATH: '',
      NAME: '支持',
      ID: 'support',
      CHILDREN: [
        {
          NAME: '漏洞管理',
          ID: 'vulnerability-reporting',
          PATH: '/security/vulnerability-reporting/',
        },
        {
          NAME: '安全公告',
          ID: 'safety-bulletin',
          PATH: '/security/safety-bulletin/',
        },
        {
          NAME: 'CVE',
          ID: 'cve',
          PATH: '/security/cve/',
        },
        {
          NAME: 'OSV技术评测',
          ID: 'approve',
          PATH: '/approve/',
        },
        {
          NAME: '兼容性技术测评',
          ID: 'compatibility-test',
          PATH: 'https://certification.openeuler.org/',
          IS_OPEN_MINISITE_WINDOW: 1,
        },
        {
          NAME: '兼容性列表',
          ID: 'compatibility',
          PATH: '/compatibility/',
        },
        {
          NAME: '迁移专区',
          ID: 'migration',
          PATH: '/migration/download/',
        },
      ],
      CLASS: [
        'security',
        'vulnerability-reporting',
        'safety-bulletin',
        'approve',
        'cve',
        'compatibility',
        'migration',
      ],
    },
    {
      PATH: '',
      NAME: '代码',
      ID: 'code',
      CHILDREN: [
        {
          NAME: '代码仓',
          PATH: 'https://gitee.com/openeuler',
          IS_OPEN_MINISITE_WINDOW: 1,
        },
        {
          NAME: '软件包仓',
          PATH: 'https://gitee.com/src-openeuler',
          IS_OPEN_MINISITE_WINDOW: 1,
        },
        {
          NAME: 'GitHub镜像仓',
          PATH: 'https://github.com/openeuler-mirror',
          IS_OPEN_MINISITE_WINDOW: 1,
        },
      ],
      CLASS: ['code'],
    },
  ],
  LANG: '中文',
  LANG_LIST: ['中文', 'English', 'Русский'],
  GITTE: '源码',
  CODE: '代码',
  FOOTER: {
    ATOM_TEXT:
      'openEuler 是由开放原子开源基金会（OpenAtom Foundation）孵化及运营的开源项目',
    ATOM_PC: '/atom-pc.png',
    ATOM_MO: '/atom-mo.png',
    MAIL: 'contact@openeuler.io',
    COPY_RIGHT: '版权所有 © 2022 openEuler 保留一切权利',
    RIGHT_LIST: [
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
      {
        NAME: '服务状态',
        URL: 'https://status.openeuler.org/',
      },
    ],
    LINKS: [],
    QR_CODE: 'openEuler公众号',
    QR_ASSISTANT: 'openEuler小助手',
  },
  BUILDING: {
    BUILDING: '建设中',
    BUILDINGMES: '敬请期待...',
  },
  SEARCH: {
    BROWSEHISTORY: '历史记录',
    CLEAN: '清除',
    TOPSEARCH: '热门搜索',
    CHANGE: '换一批',
    PLEACHOLDER: '请输入内容',
  },
  PREV: '上一页',
  NEXT: '下一页',
};
