var state = {
  currentsearch: 'structures',
  wikidata: {},
  youtubedata : {},
  bookdata : {},
};

function setCurrentSearch(state, search) {
  state.currentsearch = search;
}

function setWikiData(state, wikidata) {
  state.wikidata = wikidata;
}

function setYouTubeData(state, youtubedata) {
  state.youtubedata = youtubedata;
}

function setBookData(state, bookdata) {
  state.bookdata = bookdata;
}

function handleSearch() {
  //TODO: handle Submits
}

function getWikipediaData(state, callback) {
  var query = {
    action: 'opensearch',
    search: state.currentsearch,
    limit: 1,
    namespace: 0,
    format: 'json',
    origin: '*',
  };
  $.getJSON('https://en.wikipedia.org/w/api.php', query, function (name) {
    getWikipediaArticle(name[1][0], callback);
  });
}

function getWikipediaArticle(name, callback) {
  var query = {
    action: 'query',
    format: 'json',
    prop: 'extracts',
    explaintext: '',
    exintro: '',
    titles: name,
    origin: '*',
  };
  $.getJSON('https://en.wikipedia.org/w/api.php', query, callback);
}

function getYouTubeData(state, callback) {
  var query ={
    maxResults: '5',
    type: 'video',
    part: 'snippet',
    key: 'AIzaSyBGtZopHFhQfQLm_Jt2KNWV-g7EHqXtODg',
    q: state.currentsearch,
  };
  $.getJSON('https://www.googleapis.com/youtube/v3/search', query, callback);
}

function getGoogleBooksData(state, callback) {
  var query = {
    maxResults: '5',
    printType: 'books',
    orderBy: 'relevance',
    key: 'AIzaSyBxK5RGw1Q9lc-ShfPNRSTphxgwjx_m21I',
    q: state.currentsearch,
  };
  $.getJSON('https://www.googleapis.com/books/v1/volumes', query, callback);
}

function renderWikipedia(state) {
  var key = Object.keys(state.wikidata.query.pages)[0];
  var text = state.wikidata.query.pages[key].extract;
  var title = state.wikidata.query.pages[key].title;
  var link = ''; //TODO: insert link here
  element.html('<h2>'+title+'</h2>'+'<p>'+text+'</p><a href="'+link+
                '">read more</a>');
}

function renderYouTube(state) {
  var html= [];
  var items = json.items;
  items.forEach(function (item) {
    var title = item.snippet.title;
    var thumbnailsrc = item.snippet.thumbnails.medium.url;
    var description = item.snippet.description;
    var channel = item.snippet.ChannelTitle;
    html.push('<div class="video"><img src="'+thumbnailsrc+'" alt="'+title+
                '"><h5>'+title+'</h5><span>'+
                channel+'</span><p>'+description+'</p></div>');
  });
  return html;
}

function renderBooks(state, element) {
  var html= [];
  var items = state.bookdata.items;
  items.forEach(function (item) {
    var title = item.title;
    var subtitle = item.subtitle;
    var thumbnailsrc = item.volumeInfo.imageLinks.thumbnail;
    var description = item.snippet.description;
    html.push('<div class="video"><img src="'+thumbnailsrc+'" alt="'+title+
                '"><h5>'+title+'</h5><h6>'+
                subtitle+'</h6><p>'+description+'</p></div>');
  });
  element.html(html);
}

$(function() {
  //TODO: Call the necesarry functions
});
