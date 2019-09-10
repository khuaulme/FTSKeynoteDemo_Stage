exports = function(payload){
  
  // THIS FUNCTION WILL FUZZY MATCH FOR ALL ARGUMENT TERMS IN THE TITLE, FULLPLOT, AND PLOT FIELDS
  // BECAUSE THIS IS SOMETHING CURRENTLY NOT SUPPORTED, I BROKE UP THE ARG INTO AN ARRAY OR TERMS ("MOT"). --- LINE 56
  // THEN CREATED A  "NEWTERM" OBJECT WITH THE "MOT" --- LINE 58
  // FINALLY I PUSHED THE "NEWTERM" OBJECT ONTO THE "$searchBeta.compound.should" ARRAY IN THE ORIGINAL (FOR 1 TERM) AGGREGATION PIPELINE 'calledAggregation' --- LINE 63
  
  let arg = payload.query.arg;

  
  const collection = context.services.get("mongodb-atlas").db("mflix").collection("movies");
  
  let argArray = arg.split(' ');
  const valuesToRemove = ['the', 'The', 'A','and', 'those', 'a', 'an', 'in','these', 'to', 'of', 'for'];
  
 // These loops remove the STOP WORDS listed in valuesToRemove from the argument array 'argArray' 
  for( var j = 0; j < valuesToRemove.length; j++){
    for( var i = 0; i < argArray.length; i++){ 
        if ( argArray[i] === valuesToRemove[j]) 
          argArray.splice(i, 1); 
    }
  }
  
  console.log(argArray);
  arg = argArray.join(' ');
  console.log("Argument is " + arg);
  console.log("argArray is " + argArray);
  //argArray is array of the valid words in the searchText box
  let mot = "";
  
  //aggregation array
  let calledAggregation = [
    {
      $searchBeta: {
        compound: {
          should: [
          	 { search: { 
                  path: ['fullplot','title', 'plot'], 
                  query: arg
                }}   
  	      ]
  	   },        
        highlight: {  path: 'fullplot' }
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
    ];
  
  for ( let j = 0; j < argArray.length; j++) {
    mot = argArray[j];
    
    let newTerm = { term: {  
          	        path: ['fullplot','title'], 
          	        query:mot, 
          	        fuzzy: {maxEdits: 2.0}           
          	        }};
    calledAggregation[0].$searchBeta.compound.should.push(newTerm);
    console.log("PUSHED: "+ mot);
  }
  
  console.log("This should be the # of terms in argument - stop words + 1: " + calledAggregation[0].$searchBeta.compound.should.length);  
  
  return collection.aggregate(calledAggregation).toArray();
  

};