exports = function(payload) {
  const collection = context.services.get("mongodb-atlas").db("mflix").collection("movies");
  
  let arg = payload.query.arg;
  
  let argArray = arg.split(' ');
  	const valuesToRemove = ['the', 'The', 'A','and', 'those', 'a', 'an', 'these', 'to', 'of', 'in', 'for'];
  
  	for( var j = 0; j < valuesToRemove.length; j++){
    		for( var i = 0; i < argArray.length; i++){ 
        		if ( argArray[i] === valuesToRemove[j]) 
          			argArray.splice(i, 1); 
   		 }
  	}
  	 
  arg = argArray.join(' ');


  return collection.aggregate([
  	  { $searchBeta: {
          search: {
            path:'fullplot',
            query: arg
          },
          highlight: {
            path:'fullplot'
          }
        }}, 
      { $project: {
          title: 1,
          _id:0,
          year:1,
          fullplot:1,
          score: { $meta: 'searchScore'},
          highlight: {$meta: 'searchHighlights'}
        }}, 
      { $limit: 10}
      ]).toArray();
};



