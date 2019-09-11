exports = function(payload){
  
  // THIS FUNCTION WILL MATCH FOR ALL TERMS IN THE TITLE - NO FUZZY MATCHING -
  
  let arg = payload.query.arg;

  
  const collection = context.services.get("mongodb-atlas").db("mflix").collection("movies");
  
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
        plot:1,
        poster:1,
        score: {  $meta: 'searchScore'}, 
        highlight: {  $meta: 'searchHighlights'}
      }},
    { $limit: 9  }
    ]).toArray();
  

};