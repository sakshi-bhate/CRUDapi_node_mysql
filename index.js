const bodyParser = require('body-parser');
const express=require('express')
const app=express()
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const mysql=require('mysql')
const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'password',
    database:'nodedata'
})
connection.connect((err)=>{
    if(err){
        return console.log("ERROR:",err.message)
    }
    else{
        console.log("connected to mysql successfully!")
    }
})
app.get('/',(req,res)=>{
    console.log("succesfully responded")
    res.send("hello world")
})
app.get('/view',(req,res)=>{
    console.log('showing all data')
    connection.query("select*from professor",(err,result)=>{
        if(err){
            console.log("ERROR:",err.message)
        }else{
            res.send(result);
        }
    })
})
app.get('/view/:id',(req,res)=>{
    console.log("viewing single data")
    connection.query(`select*from professor where p_id=${parseInt(req.params.id)}`,(err,result)=>{
        if(err){
            console.log("ERROR",err.message)
        }else{
            res.send(result)
        }
    })
})
app.put('/update/:id',(req,res)=>{
    connection.query('update professor set subject=? where p_id=?',[req.body.subject,parseInt(req.params.id)],(err,result)=>{
        if(err){
                        console.log("could not update ERROR:",err.message)
                    }else{
                        res.send(result)
                    }
    })
})

app.post('/addnew', function (req, res) {
    var postData  = req.body;
    connection.query('insert into professor SET ?', postData,  (error, results)=> {
    if (error) throw error;
    res.end(JSON.stringify(results));
    });
})


app.delete('/delete/:id',(req,res)=>{
    console.log("deletion")
    connection.query(`delete from professor where p_id=${parseInt(req.params.id)}`,(err,result)=>{
        if(err){
            console.log("ERROR",err.message)
        }else{
            res.send(`successfully deleted the record with p_id:${req.params.id}`)
        }
    })

})

const port=process.env.PORT||3000;
app.listen(port,()=>{console.log(`listening on port:${port}`)});
