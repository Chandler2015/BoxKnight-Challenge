# BoxKnight-Challenge Building Instructions

To build and use the project, please do the following:

1.Git clone https://github.com/Chandler2015/BoxKnight-Challenge.git to your local folder.
2.Cd to BoxKnight-Challenge folder which has app.js file.
3.Use command "node app" to start the server.
4.On the browser, use "http://localhost:3000/" to run the app.

# Explanation of design decisions

I decided to use Node.js and Express.js because you recommended it and your comany uses it as a major tool.
In app.js, 
I wrote 2 callback functions, in which "findBestChoice" is to find the best rate between rate provided by the BoxKnight, CanadaPost and "createShipment" is to create the shipment. 
For app.post, I used the Boxknight API link with user's postalcode to find the rates provided, then use findBestChoice to 
find the best rate. Then use the same way to find the best rate by Canadapost, then find the best between two APIs. Return to user the best rate then create the shipment.
For UI, I wrote two pages. One is index.html,for home and search page, result.ejs, for result page. I used some inline styles and Bootstrap, fontawesome to decorate the pages because they are efficient and look nice. I chose ejs as the view engine to get the result back from backend and combine with html. 


Thank you!

