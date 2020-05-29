const path = require("path");

module.exports = {
  siteMetadata: {
    title: "Pega Cosmos",
    author: "@marsr",
    description: "Cosmos design system",
    url: "https://design.pega.com.com",
    image: "/img/site-preview.jpg",
    owner: "Pegasystems",
    twitterUsername: "@Pegasystems",
    facebookAppID: ""
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1360,
              withWebp: true,
              showCaptions: true,
              quality: 75,
              wrapperStyle: `margin: 7vw 0;`
            }
          },
          {
            resolve: "gatsby-remark-embed-markdown",
            options: {
              directory: `${__dirname}/content`
            }
          },
          {
            resolve: `gatsby-remark-embed-snippet`,
            options: {
              directory: `${__dirname}/content`
            }
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {}
          }
        ]
      }
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [".mdx", ".md"],
        defaultLayouts: { default: path.resolve("./src/components/layoutmdx.js") },
        // Handle images inside posts
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1080,
              tracedSVG: true
            }
          }
        ],
        plugins: [`gatsby-remark-images`]
      }
    },
    {
      resolve: `gatsby-plugin-page-creator`,
      options: {
        path: `${__dirname}/content/pages`
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/content/pages`
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/static/img`
      }
    },
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: "gatsby-default-mdx-basic",
        short_name: "starter",
        start_url: "/",
        background_color: "#663399",
        theme_color: "#663399",
        display: "minimal-ui",
        icon: `${__dirname}/static/img/favicon-32x32.png`
      }
    },
    {
      resolve: "gatsby-plugin-netlify-cms",
      options: {
        modulePath: `${__dirname}/src/cms/cms.js`,
        enableIdentityWidget: false,
        publicPath: "admin",
        htmlTitle: "Admin",
        manualInit: true
      }
    }
  ]
};
