import React from "react";
import { graphql } from "gatsby";

const ListAirtableArticles = ({ data }) => (
  <div>
    <h1>Content from Airtable</h1>
    {data.allAirtable.nodes.map(node => {
      return (
        <div key={node.data.Title}>
          <h3>{node.data.Title}</h3>
        </div>
      );
    })}
  </div>
);

export const query = graphql`
  {
    allAirtable {
      nodes {
        data {
          Title
        }
      }
    }
  }
`;

export default ListAirtableArticles;
