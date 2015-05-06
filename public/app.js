console.log("app linked")
//swtich underscore delimiter to mustache style
_.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g
};
//extend backbone to create a post 'class' 
var Post = Backbone.Model.extend({});
//create a posts collection class as well
var Posts = Backbone.Collection.extend({
    //create an association between the class and a given model
    model: Post,
    //create a pointer to a RESTful set of routes on the server (can get and post to this, for example)
    url: "/posts"
});


//create view class for each post as a list item (not as a show!)
var PostListView = Backbone.View.extend({
    tagName: "li",
    template: _.template("<a href='/posts/{{id}}'>{{title}}</a>"),
    render: function(){
        //every view instance has a property called el, a div by default
        //change the innerHTML to be the result of calling the template function
        //and passing in the model associated with the view as JSON
        this.el.innerHTML = this.template(this.model.toJSON());
        return this
    },
    events: {
        'click a': 'handleClick'
    },

    handleClick: function(event){
        event.preventDefault();
        postRouter.navigate($(event.currentTarget).attr("href"), 
            {trigger: true})
    }
})

//create a view class for the 'wrapper' of all the posts
var PostsListView = Backbone.View.extend({
    //template that doesn't need any dynamic input
    template: _.template("<h2> hahaha </h2><a href='/posts/new'> hey </a><h1> MY KILLER BLOG</h1><ul></ul>"),
    events: {
        'click a': 'handleClick'
    },

    handleClick: function(event){
        event.preventDefault();
        postRouter.navigate($(event.currentTarget).attr("href"),
            {trigger: true})
    },

    render: function(){
        this.el.innerHTML = this.template();
        //use jquery to find the ul from the template after it's rendered
        var ul = this.$el.find("ul");
        //iterate through the collection
        this.collection.forEach(function(post){
            //create a new view for each post, render it, and append the el to the ul from above
            ul.append(new PostListView({
                model: post
            }).render().el);
        });
        return this;
    }
})

//view for single posts in a show route!

var PostView = Backbone.View.extend({
    template: _.template($("#postView").html()),
    events: {
        'click a': 'handleClick'
    },
    render: function(){
        var model = this.model.toJSON();
        model.pubDate = new Date(Date.parse(model.pubDate)).toDateString();
        this.el.innerHTML = this.template(model);
        return this;
    },
    handleClick: function(event){
        event.preventDefault();
        postRouter.navigate($(event.currentTarget).attr("href"), {trigger: true});
        return false
    }
});

//view for the form for posting new posts (!)

var PostFormView = Backbone.View.extend({
    tagname: 'form',
    template: _.template($("#postFormView").html()),
    //form view 'ingests' a posts collection and assigns it as a property
    initialize: function(options){
        this.posts = options.posts
    },
    events: {
        'click button': 'createPost',
        'click a': 'handleClick'
    },
    handleClick: function(event){
        event.preventDefault();
        postRouter.navigate($(event.currentTarget).attr("href"),
            {trigger: true})
    },
    render: function(){
        this.el.innerHTML = this.template();
        return this;
    },
    createPost: function(event){
        var postAttrs = {
            content: $("#postText").val(),
            title: $("#postTitle").val(),
            pubDate: new Date()
        };
        //create method creates a new model, saves it to the server, and adds it to the collection
        //analogous to
        //var post = new Post(postAttrs)
        //this.posts.add(post)
        //post.save
        this.posts.create(postAttrs);
        postRouter.navigate("/", {trigger: true});
        return false;
    }
})


//router (so we can bookmark,etc)

var PostRouter = Backbone.Router.extend({
    initialize: function(options){
        this.posts = options.posts;
        this.main = options.main;
    },
    routes: {
        '': 'index',
        'posts/new': 'newPost',   
        'posts/:id': 'singlePost',
         },
    index: function(){
      var pv = new PostsListView({collection: this.posts});
      this.main.html(pv.render().el);
    },

    singlePost: function(id){
      var post = this.posts.get(id);
      var pv = new PostView({model: post});
      this.main.html(pv.render().el);
    },

    newPost: function(){
        var pfv = new PostFormView({posts: this.posts});
        this.main.html(pfv.render().el);
    }
});