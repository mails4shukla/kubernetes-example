const express = require('express')
const app = express()

const fs = require('fs');
const port = 3000
const gcpMetadata = require('gcp-metadata');
var mysql = require('mysql2');



async function getDatabaseIp() {
  const isAvailable = await gcpMetadata.isAvailable();
  console.log(`Is available: ${isAvailable}`);

  if (isAvailable) {
          const projectMetadata = await gcpMetadata.project('attributes/database_ip');
    return (projectMetadata)
  }

}


async function getZone() {
  const isAvailable = await gcpMetadata.isAvailable();
  console.log(`Is available: ${isAvailable}`);

  if (isAvailable) {

          const getZone = await gcpMetadata.instance('zone');
    return (getZone)
  }

}


app.get('/',  async(req, res) => {

        // var getdatabase= await getDatabaseIp();
        const ip = fs.readFileSync('/etc/foo/cluster-ip' ,{encoding:'utf8', flag:'r'});
        var getzone = await getZone();
        var con = mysql.createConnection({
        host: ip ,
        user: "root",
        password: "password",
        database: "simpleapi"
        });

        con.connect(function(err) {
           if (err) throw err;
           console.log("Connected!");
           con.query("select * from users", function (err, result) {
           if (err) throw err;
              var total_result = "Result: " + JSON.stringify(result) + "serverd from  Zone : " + getzone;
              res.send(total_result);
           });
         });
//      res.send('Hello World!'+ projectMetadata);
})


app.get('/test',  async(req, res) => {
        res.send('Hello World! this path works ');
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
