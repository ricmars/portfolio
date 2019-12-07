import React from "react";
import { graphql } from "gatsby";

const ListDrupalArticles = ({ data }) => (
  <div>
    <h1>Content from Drupal headless</h1>
    {data.allNodeArticle.nodes.map(node => (
      <div key={node.id}>
        <h3>{node.title}</h3>
        <div dangerouslySetInnerHTML={{ __html: node.body.value }} />
      </div>
    ))}
  </div>
);

export const query = graphql`
  {
    allNodeArticle {
      nodes {
        id
        title
        body {
          value
        }
      }
    }
  }
`;

export default ListDrupalArticles;
