const express = require('express');
const app = express();

const path = require('path');

const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride = require('method-override');


mongoose.connect('mongodb://localhost:27017/Crud', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Crud Database connected");
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.set('views', path.join(__dirname, 'views'));

app.get('/campgrounds', async (req, res) => {
    // const camp = new Campground({ title: "queens place", price: 10, location: "west bihar,UP,india" });
    // await camp.save();
    const campgrounds = await Campground.find({});
    res.render('home', { campgrounds });
});

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

app.post('/campgrounds',async (req, res)=>{
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
});


app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
});

//editing

app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
});

app.put('/campgrounds/:id',async (req, res) => {
    const {id} = req.params;
    // finding by id and updating && spreading in object 
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    // redirecting to specific campground details page
    res.redirect(`/campgrounds/${campground._id}`);
});

app.delete('/campgrounds/:id', async (req, res) =>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
});

app.listen(3000, (req, res) => {
    console.log('listening on port 3000');
});