# @minieggs40/http-create-server

A simple, functional wrapper over NodeJS builtin, `http.createServer`.

#### Why

I've made this 20 times at least for putting together quick hacky projects. Might as well reduce my time remaking this by publishing to NPM.

#### Install

`$ npm i -S @minieggs40/http-create-server`

#### Usage

```javascript
import { createServer } from "@minieggs40/http-create-server";

const routes = [
  {
    test: /test/,
    method: "POST",
    handle: (req, res) => {
      res.json({ msg: `Post body received: ${JSON.stringify(req.body)}` });
    }
  }
];

const port = process.env.PORT || 8080;

const defaultHandle = (req, res) => {
  res.end("Error.");
};

const onListen = () => {
  console.log(`Server has been started on port ${port}.`);
};

const start = createServer({ routes, port, defaultHandle, onListen });
start();
```

Or even more simply.

```javascript
import { createServer } from "@minieggs40/http-create-server";

const routes = [
  {
    test: /test/,
    method: "POST",
    handle: (req, res) => {
      res.json({ msg: `Post body received: ${JSON.stringify(req.body)}` });
    }
  }
];

const start = createServer({ routes });
start();
```
