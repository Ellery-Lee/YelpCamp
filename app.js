var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var flash = require("connect-flash");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var port = process.env.PORT || 3000;

//requiring routes 
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

const mongoose = require("mongoose");
// mongoose.connect("mongodb://localhost:27017/yelp_camp", {
// 	useNewUrlParser: true,
// 	useUnifiedTopology: true
// })

//for secret security, changed username and keyword below
mongoose.connect("mongodb+srv://<username>:<password>@cluster0.uwfna.mongodb.net/<dbname>?retryWrites=true&w=majority", {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
.then(() => console.log('connected to DB!'))
.catch(error => console.log(error.message));

// seedDB();//seed the DB

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret:"Once again!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", indexRoutes);

app.listen(port, function(){
	console.log("Server Has Started!");
});
