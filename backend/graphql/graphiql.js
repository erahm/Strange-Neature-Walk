import express from 'express';

const graphiqlRouter = express.Router();

const HTML = (endpoint = '/graphql') => `<!doctype html>
<html>
  <head>
    <meta charset=utf-8 />
    <title>GraphiQL</title>
    <link rel="stylesheet" href="https://unpkg.com/graphiql@1.4.7/graphiql.min.css" />
  </head>
  <body style="height: 100vh; margin: 0;">
    <div id="graphiql" style="height: 100vh;"></div>
    <script crossorigin src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/graphiql@1.4.7/graphiql.min.js"></script>
    <script>
      function graphQLFetcher(graphQLParams) {
        return fetch('${endpoint}', {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(graphQLParams),
        }).then(response => response.json());
      }
      document.addEventListener('DOMContentLoaded', function () {
        ReactDOM.render(
          React.createElement(GraphiQL, { fetcher: graphQLFetcher }),
          document.getElementById('graphiql')
        );
      });
    </script>
  </body>
</html>`;

graphiqlRouter.get('/', (req, res) => {
  res.type('html').send(HTML('/graphql'));
});

export default graphiqlRouter;
