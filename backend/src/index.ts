const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
console.log(port);


app.get('/', (req: any, res: any) => {
  res.send('Hello World!')
})


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});