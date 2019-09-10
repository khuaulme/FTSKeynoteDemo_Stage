exports = function(arg){

  const collection = context.services.get("mongodb-atlas").db("sample_mflix").collection("movies");
  
  return collection.aggregate([
    {
      $searchBeta: {
    	  search: { 
            path: 'title', 
            query: arg
    	 },   
        highlight: {  path: 'title' }
      }},
    {
      $project: {
        title: 1, 
        _id: 0, 
        year: 1, 
        fullplot: 1, 
        poster:1,
        score: {  $meta: 'searchScore'}, 
        highlight: {  $meta: 'searchHighlights'}
      }},
    { $limit: 9  }
    ]).toArray();
};