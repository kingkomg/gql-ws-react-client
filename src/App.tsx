import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  ApolloClient,
  DefaultOptions,
  InMemoryCache,
  createHttpLink,
  gql,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  // uri: "http://0.0.0.0:15000/dev/graphql",
  uri: "https://z0rt977tya.execute-api.eu-west-1.amazonaws.com/dev/graphql",
});

const authLink = setContext(async (_, { headers }) => {
  // const session = await Auth.currentSession();
  return {
    headers: {
      ...headers,
      // Authorization: `Bearer ${session.getIdToken().getJwtToken()}`,
    },
  };
});

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: "no-cache",
    errorPolicy: "ignore",
  },
  query: {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  },
};

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions,
});

const GET_GREETING = gql`
  query Hello {
    hello
  }
`;

const callGql = (callback: Function) => {
  client
    .query({
      query: GET_GREETING,
      variables: {},
    })
    .then((response) => {
      if (response.errors) {
        callback("error");
      } else {
        callback(response.data.hello);
      }
    })
    .catch((err) => {
      callback(err);
    });
  callback("...");
};

function App() {
  const [greeting, setGreeting] = useState("...");

  useEffect(() => {
    callGql(setGreeting);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{greeting}</p>
      </header>
    </div>
  );
}

export default App;
