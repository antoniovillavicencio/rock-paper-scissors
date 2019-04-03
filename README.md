# Rock, Paper, Scissors

To run the example, you need to have Node installed. First, in the root folder

```bash
npm install
```

Before you execute the example, you need to modify `client/multiplayer.js` on line 9 to include your own IP or localhost. Example:

```js
var socket = io("http://localhost:3000");
```

Then, just run 

```bash
nodemon index.js
```

and open `index.html` on your web browser. 
