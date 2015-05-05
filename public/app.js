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


//create view class for each post
var PostListView = Backbone.View.extend({
    tagName: "li",
    template: _.template("<a href='/posts/{{id}}'>{{title}}</a>"),
    render: function(){
        //every view instance has a property called el, a div by default
        //change the innerHTML to be the result of calling the template function
        //and passing in the model associated with the view as JSON
        this.el.innerHTML = this.template(this.model.toJSON());
        return this
    }
})

//create a view class for the 'wrapper' of all the posts
var PostsListView = Backbone.View.extend({
    //template that doesn't need any dynamic input
    template: _.template("<h1> MY KILLER BLOG </h1><ul></ul>"),
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



//router (so we can bookmark,etc)

var PostRouter = Backbone.Router.extend({
    initialize: function(options){
        this.posts = options.posts;
        this.main = options.main;
    },
    routes: {
        '': 'index',
        'posts/:id': 'singlePost'   
         },
    index: function(){
      var pv = new PostsListView({collection: this.posts});
      this.main.html(pv.render().el);
    },

    singlePost: function(id){
      console.log("view post " + id);
    }
});