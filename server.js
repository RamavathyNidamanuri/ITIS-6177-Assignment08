const express = require('express');
const app = express();
const port = 3000;

const swaggerJsdoc= require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

const { body, validationResult } = require('express-validator');

const options = {
    swaggerDefinition: {
        Info: {
            title: 'Database API',
            version: '1.0.0',
            description: 'Database API autogenerated by swagger docs ',

        },
        host: 'localhost:3000',
        basepath: '/'
    },
    apis: ['./server.js'],
};

const specs= swaggerJsdoc(options);

app.use('/docs', swaggerUi.serve,swaggerUi.setup(specs));
app.use(cors());

const mariadb = require('mariadb');
const pool = mariadb.createPool({
      host: 'localhost',
      user:'root',
      password: 'root',
      database: 'sample',
      port: 3306,
      connectionLimit: 5
});


/**
 * @swagger
 * /:
 *    get:
 *      description: Return Hello
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Display Hello
 */

app.get('/', (req,res)=> {
res.send('Hello');

});

/**
 * @swagger
 * /api/v1/agents/0.15:
 *    get:
 *      description: Return Agent_code, Agent_name, country of the agent where commission is 0.15
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: object agents details from the database are displayed
 */

 app.get('/api/v1/agents/0.15', async(req,res) => {
    try{
        var result = await pool.query("select AGENT_CODE, AGENT_NAME, COUNTRY from agents where COMMISSION=0.15")
         res.setHeader('Content-Type','Application/json');
         res.statusCode=200;
         res.json(result);
         }
     catch(err){
         throw err;
         }
 });
 
 /**
  * @swagger
  * /api/v1/customers:
  *    get:
  *      description: Return customers code, Name, Grade of the customers where grade is 1
  *      produces:
  *          - application/json
  *      responses:
  *          200:
  *              description: object Customer details from the database are displayed
  */
 
 
 app.get('/api/v1/customers', async(req,res) => {
  try{
       var result = await pool.query('select CUST_CODE ,CUST_NAME ,GRADE from customer where GRADE= 1')
       res.statusCode = 200;
       res.setHeader('Content-Type','Application/json');
       res.json(result);
       //res.send(result);
 }
    catch(err){
        throw err;
        }
 
 });

 
/**
 * @swagger
 * /api/v1/company/19:
 *    get:
 *      description: Return all company details where company id is 19
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: object company containing all details are displayed
 */

app.get('/api/v1/company/19', async(req,res) =>{
    try{
      var result = await pool.query('select * from company where COMPANY_ID = 19')
      //res.send(result);
      res.statusCode = 200;
      res.setHeader('Content-Type','Application/json');
      res.json(result);
     }
    catch(err){
        throw err;
        }
});

/**
 * @swagger
 * /company/{company_id}:
 *    get:
 *      description: Return  all company details of company_id=18
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: comapny_id
 *            in: path
 *            type: integer
 *            format: int64
 *            required: true
 *            example: 18
 *      responses:
 *          200:
 *              description: company object containing company details like id, name and city
 */


 app.get('/company/:company_id', function(req,res) {
    pool.query(`SELECT * FROM company WHERE COMPANY_ID = '${req.params.company_id}'`)
    .then(result => {
            res.statusCode = 200;
            res.setHeader('Content-Type','Application/json');
            res.json(result);
        })
        .catch(err);
});
/**
 * @swagger
 * /insertcompany:
 *    post:
 *      description: Add new company
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: insertCompany
 *            in: body
 *            required: true
 *            schema:
 *                $ref: "#/definitions/Company"
 *      responses:
 *          200:
 *              description: Company object containing all companies
 */

 app.post('/insertcompany', function(req,res) {

    const err = validationResult(req)
    if (!err.isEmpty()) {
            res.statusCode = 400
            res.json({err:err.array()})
            return;
    }

    const {COMPANY_ID,COMPANY_NAME,COMPANY_CITY}=req.body

    pool.query(`INSERT INTO company VALUES ('${COMPANY_ID}', '${COMPANY_NAME}', '${COMPANY_CITY}')`)
    .then(result => {
            res.statusCode = 200;
            res.set('Content-Type','Application/json');
            res.send(result)
            return
            })
    .catch(err);
});


/**
 * @swagger
 * /updatefoods:
 *    put:
 *      description: Update foods
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: updateFoods
 *            in: body
 *            required: true
 *      responses:
 *          200:
 *              description: Foods object containing all foods
 */

 app.put('/updatefoods', function(req,res) {

    const err = validationResult(req)
    if (!err.isEmpty()) {
            res.statusCode = 400
            res.json({err:err.array()})
            return;
    }

    const {ITEM_ID,ITEM_NAME,ITEM_UNIT,COMPANY_ID}=req.body
    pool.query(`UPDATE foods SET ITEM_NAME = '${ITEM_NAME}', ITEM_UNIT = '${ITEM_UNIT}', COMPANY_ID = '${COMPANY_ID}' WHERE ITEM_ID = '${ITEM_ID}'`)
            .then(result => {
                    res.statusCode = 200;
                    res.set('Content-Type','Application/json');
                    res.send(result)
                    return
            })
            .catch();
 });

/**
 * @swagger
 * /newfooditem:
 *    patch:
 *      description: Update the food items
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: newfooditem
 *            in: body
 *            required: true
 *      responses:
 *          200:
 *              description: Foods object containing all foods are updated
 */

 app.patch('/newfooditem',function(req,res) {
        const err = validationResult(req)
        if (!err.isEmpty()) {
                res.statusCode = 400
                res.json({err:err.array()})
                return;
        }
const {ITEM_ID, ITEM_NAME}=req.body

pool.query(`update foods set ITEM_NAME='${ITEM_NAME}' where ITEM_ID = '${ITEM_ID}'`)
.then(result => {
        res.statusCode = 200;
        res.set('Content-Type','Application/json');
        res.send(result)
        return
        })
.catch(err => console.error('Query error', err.stack));
    });


/**
* @swagger
* /company/{comp_id}:
*    delete:
*      description: Delete the specified company
*      produces:
*          - application/json
*      parameters:
*          - name: comp_id
*            in: path
*            required: true
*            type: integer
*            format: int64
*            example: 18
*      responses:
*          200:
*            description: object company details with specific id were deleted
*/
app.delete('/company/:comp_id', function(req,res) {

        pool.query(`DELETE FROM company WHERE COMPANY_ID = '${req.params.comp_id}'`)
        .then(result=> {
                if (result.affectedRows == 0) {
                        res.statusCode = 400;
                        res.set('Content-Type','Application/json');
                        res.send({err:'Invalid COMPANY_ID'})
                        return
                }
                else {
                        res.statusCode = 200;
                        res.set('Content-Type','Application/json');
                        res.send(result)
                        return
                }
        })
        .catch(err => console.error('Query error', err.stack));
});

app.listen(port, () => {
console.log('API listening on port',port);
});
 