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

module.exports = { dummy, totalLikes, favoriteBlog };
