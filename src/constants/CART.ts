// Shopify query for basic product data
export const PRODUCTS_QUERY = `
  query {
    products(first: 10) {
      edges {
        node {
          id
          title
          handle
          description
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                price {
                  amount
                }
                compareAtPrice {
                  amount
                }
              }
            }
          }
        }
      }
    }
  }
`;

// Shopify query for a single product by ID
export const PRODUCT_QUERY_BY_ID = `
  query ProductById($id: ID!) {
    product(id: $id) {
      id
      title
      descriptionHtml
      images(first: 5) {
        edges {
          node {
            url
            altText
          }
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 5) {
        edges {
          node {
            id
            title
            availableForSale
          }
        }
      }
    }
  }
`;
