function Ajax() {

}

Ajax.prototype.basicXhrRequest = function(callback) {
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {
    if (this.readyState == this.DONE) {
      callback(this.responseText);
    }
  };

  xhr.open('GET', '/content.json');
  xhr.send();
}

Ajax.prototype.jQueryRequest = function(callback) {
  jQuery.ajax({
    type: 'GET',
    url: '/song.json',
    success: function(data) {
      callback(data)
    }
  });
}
