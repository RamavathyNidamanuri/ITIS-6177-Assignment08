const express = require('express');
const app = express();
const port = 3000;

const mariadb = require('mariadb');
const pool = mariadb.createPool({
      host: 'localhost',
      user:'root',
      password: 'root',
      database: 'sample',
      port: 3306,
      connectionLimit: 5
});

app.get('/', (req,res)=> {
//connect to the database
//perform the request that you need(SQL)
//define the header
//res.json(rows);
res.send('Hello');

});

app.get('/api/v1/agents/0.15', async(req,res) => {
   try{
       var result = await pool.query("select AGENT_CODE, AGENT_NAME, COUNTRY from agents where COMMISSION=0.15")
        res.send(result);
        }
    catch(err){
        throw err;
        }
});app.get('/api/v1/customers', async(req,res) => {
    try{
         var result = await pool.query('select CUST_CODE ,CUST_NAME ,GRADE from customer where GRADE= 1')
         res.send(result);
       }
      catch(err){
          throw err;
          }
   
   });
   
   app.get('/api/v1/company/19', async(req,res) =>{
           try{
             var result = await pool.query('select * from company where COMPANY_ID = 19')
             res.send(result);
             }
           catch(err){
               throw err;
              }
   });
   app.listen(port,() => {
     console.log('Example app Listening at http://localhost:', port)
   
   });
   