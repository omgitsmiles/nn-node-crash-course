const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const Blog = require('./models/blog')

const app = express()

// connect to mongodb & listen for requests
const dbURI = 'mongodb+srv://omgitsmiles:fullStack21@nodetutorial.hnnptwx.mongodb.net/nodetuts?retryWrites=true&w=majority'
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true }) //useNewUrlParser: true, useUnifiedTopology: true prevent deprecation warnings
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err))


// register view engine
app.set('view engine', 'ejs') // ejs is the view engine

// app.set('views', 'myviews') for custom views folder

// mongoose & mongo sandbox routes

//add blog
// app.get('/add-blog', (req, res) => {
//     const blog = new Blog({
//         title: 'new blog 3',
//         snippet: 'about my new blog',
//         body: 'more about my new blog'
//     })

//     blog.save()
//         .then((result) => {
//             res.send(result)
//         })
//         .catch((err) => {
//             console.log(err)
//         })

// })

// // get all blogs    
// app.get('/all-blogs', (req, res) => {
//     Blog.find()
//         .then((result) => {
//             res.send(result)
//         })
//         .catch((err) => {
//             console.log(err)
//         })
// })

// // get a single blog
// app.get('/single-blog', (req, res) => {
//     Blog.findById('650106a8a4c9e183cac59a77')
//         .then((result) => {
//             res.send(result)
//         })
//         .catch((err) => {
//             console.log(err)
//         })
// })


// listen for requests
// app.listen(3000)

// middleware & static files
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true })) //allows us to use req.body in post requests
app.use(morgan('dev'))

// app.get('/', (req, res) => {
//     res.sendFile('./views/index.html', { root: __dirname })
// })

// routes
app.get('/', (req, res) => {
    // const blogs = [
    //     { title: 'Yoshi finds eggs', snippet: 'Lorem ipsum dolor sit amet consectetur' },
    //     { title: 'Mario finds stars', snippet: 'Lorem ipsum dolor sit amet consectetur' },
    //     { title: 'How to defeat bowser', snippet: 'Lorem ipsum dolor sit amet consectetur' },
    // ]
    res.redirect('/blogs')
})

// app.get('/about', (req, res) => {
//     res.sendFile('./views/about.html', { root: __dirname })
// })

app.get('/about', (req, res) => {
    res.render('about', { title: 'About' })
})

// blog routes
app.get('/blogs/create', (req, res) => {
    res.render('create', { title: 'Create a new blog' })
})

app.get('/blogs', (req, res) => {
    Blog.find().sort({ createdAt: -1 })
        .then((result) => {
            res.render('index', { title: 'All Blogs', blogs: result })
        })
        .catch((err) => {
            console.log(err)
        })
})

app.post('/blogs', (req, res) => {
    const blog = new Blog(req.body)
    blog.save()
        .then((result) => {
            res.redirect('/blogs')
        })
        .catch((err) => {
            console.log(err)
        })
})

app.get('/blogs/:id', (req, res) => {
    const id = req.params.id
    Blog.findById(id)
        .then((result) => {
            res.render('details', { blog: result, title: 'Blog Details' })
        })
        .catch((err) => {
            console.log(err)
        })
})

app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id
    Blog.findByIdAndDelete(id)
        .then((result) => {
            res.json({ redirect: '/blogs' })
        })
        .catch((err) => {
            console.log(err)
        })
})



// redirects
app.get('/about-us', (req, res) => {
    res.redirect('/about')
})

// 404 page
// must always be at the bottom of the file

// app.use((req, res) => {
//     res.status(404).sendFile('./views/404.html', { root: __dirname })
// })

app.use((req, res) => {
    res.status(404).render('404', { title: '404' })
})