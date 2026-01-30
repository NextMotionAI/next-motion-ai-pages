import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Next Motion AI',
  tagline: 'Reinforcement Learning for Computational Biology',
  favicon: 'img/logo_96.png',

  // Set the production url of your site here
  url: 'https://www.nextmotionai.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'nextmotionai', // Usually your GitHub org/user name.
  projectName: 'next-motion-ai-pages', // Usually your repo name.
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        gtag: {
          trackingID: 'G-YLHJEZJCWG',
          anonymizeIP: true,
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/logo_512.png',
    navbar: {
      title: 'Next Motion AI',
      // style: 'light',
      logo: {
        alt: 'Next Motion AI Logo',
        src: 'img/logo_512.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Product',
        },
        { to: '/blog', label: 'Blog', position: 'left' },
        { to: '/about', label: 'About', position: 'left' },
        // { to: '/app', label: 'App', position: 'right' },
        // {
        //   href: 'https://github.com/facebook/docusaurus',
        //   label: 'App',
        //   position: 'right',
        // },
      ],
    },
    metadata: [
      { name: 'keywords', content: 'Reinforcement Learning, Computational Biology, Drug Discovery, Vaccine Design, Protein Engineering, AI for Science' },
      { name: 'description', content: 'Next Motion AI is a reinforcement learning platform for computational biology. We help researchers and clinicians design better drugs, vaccines, and proteins.' }
    ],
    footer: {
      // style: 'light',
      links: [
        {
          title: 'Product',
          items: [
            {
              label: 'Product',
              to: '/docs/who_we_are',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'WeChat',
              href: '/about',
            },
            {
              label: 'Discord',
              href: '/about',
            }
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            }
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Next Motion, Inc.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
  } satisfies Preset.ThemeConfig,

};


export default config;
