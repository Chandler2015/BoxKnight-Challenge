var express = require('express')
var cors = require('cors')
var request = require('request')
var bodyParser = require('body-parser')
var app = express()
var path = require("path");


app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');



 //find the best rate object from given objects
findBestChoice = (addresses, callback) =>{
    const minRateAddress = addresses.reduce((a, b) => {
        if (a.price > b.price) {
            return b
        } if (a.price == b.price) {
            if (a.estimate_days>b.estimate_days) {
                return b
            } else {
                return a
            }
        } else {
            return a
        }
    })
    callback(minRateAddress)
}

createShipment = (a,b, callback) => {
    // a box b canada
    if (a.price > b.price) {
      
        callback("https://lo2frq9f4l.execute-api.us-east-1.amazonaws.com/prod/shipments",b.id)
    } if (a.price == b.price) {
        if (a.estimate_days>b.estimate_days) {
           
            callback("https://lo2frq9f4l.execute-api.us-east-1.amazonaws.com/prod/shipments",b.id)
        } else {
          

            callback("https://7ywg61mqp6.execute-api.us-east-1.amazonaws.com/prod/shipments",a.id)
        }
    } else {
      
        callback("https://7ywg61mqp6.execute-api.us-east-1.amazonaws.com/prod/shipments",a.id)
    }
}

//Routes
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname + '/index.html'));
});



app.post('/getBestShipmentRate',(req,res)=>{
    // find postcode by req.body's postalcode
    // request xxx call api 
    // callback request call boxknight 
    // boxknight callbck compare

    console.log(req.body);
    let postcode = req.body.postcode;
    console.log(postcode);

    request('https://lo2frq9f4l.execute-api.us-east-1.amazonaws.com/prod/rates/'+postcode,  function (error, response1, body) {
      if (response1.statusCode == 200) {
        // if success

        //find the best rate object from BoxKnight
        findBestChoice(JSON.parse(body), (boxKnightChoice)=>{
            request('https://7ywg61mqp6.execute-api.us-east-1.amazonaws.com/prod/rates/'+postcode,  function (error, response2, body) { 
            if (response2.statusCode == 200) {
                // if success

                //find the best rate object from CanadaPost
                findBestChoice(JSON.parse(body), (canadaPostChoice)=>{
                   
                    //find best rate object from BoxKnight and CanadaPost 
                    var choices = [boxKnightChoice,canadaPostChoice];
                    findBestChoice(choices,(choice)=>{
                        //return the best rate to customer
                       // var choice = JSON.stringify(choice);
                       res.render('result',{choice:choice});
                       // res.send("The shipping rate with the lowest cost is: " + choice);
                    })
                    
                   
                    //create the shipment
                    createShipment(boxKnightChoice, canadaPostChoice, (url,id)=> {
                        console.log(url, id, postcode)

                        request({
                            method: 'POST',
                            url: url,
                            headers: {
                            'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                "rate_id": id,
                                "destination": {
                                  "postalCode": postcode,
                                }
                            })
                        }, function (error, response3, body) {
                            res.status(response3.statusCode).send(res.body)
                            

                        });
                        })
                    })
                    
            } else {
                  // if not success 
                  res.status(response2.statusCode).send(body)
              }
            });
        });
        
      } else {
          // if not success 
          res.status(response1.statusCode).send(body)
      }

    });
    
});


//listen to the server
app.listen(3000);
