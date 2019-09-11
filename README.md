# FTSKeynoteDemo_Stage
for MongoDB team members presenting during MongoDB Events

## basic.html for the HelloWorld demo
requires fts-stitch.css file and M.svg logo file
javascript functionality is in basic.html starting at line 59:
- userAction() when a user clicks enter
- buildText() - helper function for userAction() to build out display strings
#### requires 1 Stitch HTTP Service API URL on line 67 "movies-basic-FTS" in userAction()

## advanced.html for the advanced autocomplete and fuzzy matching features

requires 2 Stitch HTTP Service API URLs in js/advanced.js file:
- line 27 if title is autocompleted - matches on path title
- line 31 will perform fuzzy matching if needed

### Requires 3 different fuzzy Stitch APIs:
-
