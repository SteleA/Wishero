app.directive('clickToSelect', function(){
  return {
    link: function(scope, element, attr){
      element.on('click', function(){
        setTimeout(function () {
          element[0].setSelectionRange(0, element[0].value.length);
        }, 10);
      });
    }
  };
});
