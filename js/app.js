var state = {
  currentsearch: '',
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
  $('.searchform').submit(function(event){
    event.preventDefault();
    setCurrentSearch(state,$(this).find('#topicsearch').val());
    getGoogleBooksData(state, function (data) {
      setBookData(state, data);
      renderBooks(state,$('.js-book-display'));

    });
    getWikipediaData(state, function(data){
      setWikiData(state, data);
      renderWikipedia(state,$('.js-wiki-display'));
    });
    getYouTubeData(state, function(data) {
      setYouTubeData(state, data);
      renderYouTube(state, $('.js-video-display'));
    });
    $('main').show();
    $('html, body').animate({
        scrollTop: $("#maincontent").offset().top
    }, 1000);
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
    key: 'AIzaSyC3GS5V_h810nLgoUDdLDqMdXl1tDjmDBA',
    q: state.currentsearch,
  };
  $.getJSON('https://www.googleapis.com/books/v1/volumes', query, callback);
}

function renderWikipedia(state, element) {
  var key = Object.keys(state.wikidata.query.pages)[0];
  // the $(...).text(...).html() escapes html chars (needed when searching for 'html')
  var text = $('<div>').text(state.wikidata.query.pages[key].extract).html();
  var title = $('<div>').text(state.wikidata.query.pages[key].title).html();
  var link = ' href="https://en.wikipedia.org/wiki/'+title+'"';
  element.html('<h3>'+title+'</h3><p>'+text+'</p><a'+link+'>read more</a>');
}

function renderYouTube(state, element) {
  var html= [];
  var items = state.youtubedata.items;
  items.forEach(function (item) {
    var title = item.snippet.title;
    var thumbnailsrc = item.snippet.thumbnails.medium.url;
    var description = item.snippet.description;
    var channel = item.snippet.channelTitle;
    var videoLink = ' href="https://www.youtube.com/watch?v='+item.id.videoId+'"';
    var channelLink = ' href="https://www.youtube.com/channel/'+item.snippet.channelId+'"';
    html.push('<div class="video"><a'+videoLink+'><img class="thumbnail" src="'+thumbnailsrc+'" alt="'+
                title+'"></a><h5 class="videotitle"><a'+videoLink+'>'+title+
                '</a></h5><h6 class="channeltitle"><a'+channelLink+'>'+ channel+
                '</a></h6><p>'+description+'</p></div>');
  });
  element.html(html);
}

function renderBooks(state, element) {
  var html= [];
  var items = state.bookdata.items;
  items.forEach(function (item) {
    var author = item.volumeInfo.authors;
    var title = item.volumeInfo.title;
    var subtitle = (item.volumeInfo.subtitle)? ('<h6>'+item.volumeInfo.subtitle+'</h6>') : '';
    var thumbnailsrc = item.volumeInfo.imageLinks.thumbnail;
    var description = '';
    if(item.volumeInfo.description) {
      description = '<p>'+item.volumeInfo.description.substring(0, 200);
      if(description.length < item.volumeInfo.description.length) {
        description += '...';
      }
      description +='</p>';
    }
    var booklink = ' href="'+item.volumeInfo.infoLink+'"';
    html.push('<div class="book"><a'+booklink+'><img class="thumbnail" src="'+thumbnailsrc+'" alt="'+title+
                '"></a><h5 class="author">'+author+'</h5><h5 class="booktitle"><a'+booklink+'>'+title+'</a></h5>'+
                subtitle+'<p>'+description+'</div>');
  });
  element.html(html);
}

$(function() {
  handleSearch();
});
