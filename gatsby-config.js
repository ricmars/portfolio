const path = require("path");

module.exports = {
  siteMetadata: {
    title: "Pega Cosmos",
    titleTemplate: "%s · template",
    author: "@marsr",
    description: "Cosmos design system",
    url: "https://design.pega.com.com",
    image: "/images/site-preview.jpg",
    owner: "Pegasystems",
    twitterUsername: "@Pegasystems",
    facebookAppID: "",
    nav: [
      { path: "https://medium.com/@pegasystems", name: "Blog", hidden: true },
      { path: "/#about", name: "About" },
      { path: "/#process", name: "Process" },
      { path: "/#speaking", name: "Speaking" },
      { path: "/#contact", name: "Contact" }
    ],
    categories: [
      { slug: "uxdesign", name: "UX Design" },
      { slug: "cosmos", name: "Cosmos Design System" }
    ]
  },
  plugins: [
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [".mdx", ".md"],
        defaultLayouts: { default: path.resolve("./src/components/layoutmdx.js") }
      }
    },
    {
      resolve: `gatsby-source-drupal`,
      options: {
        baseUrl: `https://gatsbytestogxxj8zcbs.devcloud.acquia-sites.com/`,
        apiBase: `jsonapi`
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
    },
    "gatsby-plugin-react-helmet",
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/pages`
      }
    },
    `gatsby-transformer-remark`,
    {
      resolve: `gatsby-source-airtable`,
      options: {
        apiKey: `keyzkTIXGeU5wOPvw`,
        tables: [
          {
            baseId: `appv74xPKsXt7Nt1x`,
            tableName: `Sections`,
            tableView: `All`,
            mapping: { Body: "text/markdown" },
            tableLinks: [`Pages`]
          },
          {
            baseId: `appv74xPKsXt7Nt1x`,
            tableName: `Pages`,
            tableView: `All`,
            mapping: { Body: "text/markdown" },
            tableLinks: [`Section`]
          }
        ]
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
        icon: "src/images/gatsby-icon.png" // This path is relative to the root of the site.
      }
    }
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.app/offline
    // 'gatsby-plugin-offline',
  ]
};
