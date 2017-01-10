app.directive('pil', function(){
  return {
    link: function(scope, element){


      var pic;
      var loading = '<span class="loadingPic">loading</span>';




      setTimeout(function () {
        element.parent().addClass('loadingPicture');
        pic = element.attr('src');
        element.css('opacity', 0);

      }, 10);






      element.bind('load', function(){
        setTimeout(function () {
          element.addClass('animated fadeIn');
          element.parent().removeClass('loadingPicture');
        }, 300);

      });

    }
  };
});
