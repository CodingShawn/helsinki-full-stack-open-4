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

module.exports = { dummy, totalLikes };
