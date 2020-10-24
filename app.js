const express = require('express'),
        app = express(),
        mongoose = require('mongoose'),
        bodyParser = require('body-parser'),
        methodOverride = require('method-override'),
        expressSanitizer = require('express-sanitizer');

// App Setup 
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride('_method'));
app.set('view engine','ejs');

// DB Setup
mongoose.connect('mongodb://localhost:27017/newBlogApp',{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(()=> console.log('connected to the DB'))
.catch(err => console.log(err))

const blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    author:String,
    created:{type:Date,default:Date.now}
})

const Blogpost = mongoose.model('Blogpost',blogSchema);


// Blogpost.create({
//     title: 'My Fourth Blog Post',
//     image: 'https://images.pexels.com/photos/267389/pexels-photo-267389.jpeg?auto=compress&cs=tinysrgb&h=350',
//     body:'You know the vibes and dem things init',
//     author:'Saihou Sillah'
// },function(err,blog){
//     if(err){
//         console.log('something went wrong')
//         console.log(err);
//     } else {
//         console.log('You added a new Blog post')
//         console.log('==========================')
//         console.log(blog)
//     }
// })


// RESTful Routes

app.get('/',function(req,res){
    res.redirect('/blogs');
})

// Index Route
app.get('/blogs',function(req, res){
    Blogpost.find({},function(err,allBlogs){
        if (err){
            console.log('something went wrong')
            console.log(err)
        }else{
            res.render('index',{blogs:allBlogs});
        }
    })
    
})

// New Route

app.get('/blogs/new',function(req,res){
    res.render('new');
})

// Create Route

app.post('/blogs',function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blogpost.create(req.body.blog,function(err,blog){
        if(err){
            console.log(err)
            res.redirect('/blogs')
        }else{
            res.redirect('/blogs');
        }
    })
    
})

// ALL Route

app.get('/blogs/all',function(req,res){
    Blogpost.find({},function(err,allBlogs){
        if (err){
            console.log('something went wrong')
            console.log(err)
        }else{
            res.render('all',{blogs:allBlogs});
        }
    })
    
})

// Contact Route
app.get('/blogs/contact',function(req,res){
    res.render('contact');
})

// Show Route

app.get('/blogs/:id',function(req,res){
    Blogpost.findById(req.params.id,function(err,foundBlog){
        if(err){
            console.log(err)
            res.redirect('/blogs')
        }else{
            res.render('show',{blog:foundBlog});
        }
    })
    
})



// Edit Route
app.get('/blogs/:id/edit', function(req,res){
    Blogpost.findById(req.params.id,function(err,foundBlog){
        if(err){
            console.log(err)
            res.redirect('/blogs')
        }else{
            res.render('edit',{blog:foundBlog});
        }
    })
})



// Update Route

app.put('/blogs/:id',function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blogpost.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){
            console.log(err)
            res.redirect('/blogs')
        }else{
            res.redirect('/blogs/'+req.params.id);
        }
    })
    
})

// Delete Route
app.delete('/blogs/:id',function(req,res){
    Blogpost.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err)
            res.redirect('/blogs')
        }else{
            res.redirect('/blogs');
        }
    })
    
})









app.listen(3000,function(){
    console.log('Serving BlogApp 2.0 on port 3000');
})
