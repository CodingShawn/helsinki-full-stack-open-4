const _ = require('lodash');

const dummy = (blogs) => {
  return 1;
};

function totalLikes(blogs) {
  let likes = blogs.reduce((total, blog) => {
    total += blog.likes;
    return total;
  }, 0);

  return likes;
}

function favoriteBlog(blogs) {
  let favoriteBlog = blogs.reduce((favorite, blog) => {
    if (favorite == undefined) return blog;
    return favorite.likes < blog.likes ? blog : favorite;
  });
  return favoriteBlog;
}

function mostBlogsHelper(blog) {
  return blog.author;
}

function mostBlogs(blogs) {
  let authorsBlogCount = _.countBy(blogs, mostBlogsHelper)
  let authorsBlogCountList = _.reduce(authorsBlogCount, function(result, value, key) {
    let author = {
      author: key,
      blogs: value,
    }
    result.push(author);
    return result;
  }, [])

  return _.maxBy(authorsBlogCountList, function(author) {
    return author.blogs;
  })
}

function mostLikes(blogs) {
  let authorsBlogList = _.groupBy(blogs, function(blog){
    return blog.author
  })
  let authorsLikesCountList = _.reduce(authorsBlogList, function(result, value, key) {
    let author = {
      author: key,
      likes: authorsBlogList[key].reduce( (accLikes, blog) => {
        return accLikes + blog.likes
      }, 0)
    }
    result.push(author);
    return result;
  }, [])

  return _.maxBy(authorsLikesCountList, function(author) {
    return author.likes
  })
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
