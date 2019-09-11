exports = function(payload) {
  const moviesCollection = context.services.get("mongodb-atlas").db("sample_mflix").collection("movies");
  
  /* Create an array of movie titles. Since not all of the titles are strings (ex. 10.5), use toString() method to convert. */
  let movieTitles = moviesCollection.find({}, {title:1}).toArray()
  .then(results => results.map(r => r.title.toString()));
  
  return movieTitles;
  
};