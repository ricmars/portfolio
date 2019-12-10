import React from "react";
import { StaticQuery, graphql, Link } from "gatsby";

const SideBar = () => (
  <StaticQuery
    query={graphql`
      {
        allSitePage {
          nodes {
            path
            id
            context {
              frontmatter {
                title
              }
            }
          }
        }
      }
    `}
    render={data => {
      return (
        <aside>
          <h2>Categories</h2>
          <ul>
            {data.allSitePage.nodes.map(node => {
              if (node.path !== "" && node.context && node.context.frontmatter && node.context.frontmatter.title !== "") {
                return (
                  <ul key={node.id}>
                    <Link to={node.path}>{node.context.frontmatter.title}</Link>
                  </ul>
                );
              } else return null;
            })}
          </ul>
        </aside>
      );
    }}
  />
);

export default SideBar;
