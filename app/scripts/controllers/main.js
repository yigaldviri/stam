'use strict';

angular.module('stamApp')
  .controller('MainCtrl',['$scope', '$timeout', '$interval' , function ($scope, $timeout, $interval) {

      $scope.loading = true;
      $scope.logs = [];
      var Typer={
          text: null,
          accessCountimer:null,
          index:0, // current cursor position
          speed:0.5, // speed of the Typer
          content:function(){
              return $("#console").html();// get console content
          },

          write:function(str){// append to console content
              $("#console").append(str);
              return false;
          },

          addText:function(key){//Main function to add the code
                if(Typer.text){ // otherway if text is loaded
                  var cont=Typer.content(); // get the console content
                  if(cont.substring(cont.length-1,cont.length)=="|") // if the last char is the blinking cursor
                      $("#console").html($("#console").html().substring(0,cont.length-1)); // remove it before adding the text
                  if(key.keyCode!=8){ // if key is not backspace
                      Typer.index+=Typer.speed;	// add to the index the speed
                  }else{
                      if(Typer.index>0) // else if index is not less than 0
                          Typer.index-=Typer.speed;//	remove speed for deleting text
                  }
                  var text=Typer.text.substring(0,Typer.index)// parse the text for stripping html enities
                  var rtn= new RegExp("\n", "g"); // newline regex

                  $("#console").html(text.replace(rtn,"<br/>"));// replace newline chars with br, tabs with 4 space and blanks with an html blank
                  window.scrollBy(0,50); // scroll to make sure bottom is always visible
              }
              if ( key.preventDefault && key.keyCode != 122 ) { // prevent F11(fullscreen) from being blocked
                  key.preventDefault()
              };
              if(key.keyCode != 122){ // otherway prevent keys default behavior
                  key.returnValue = false;
              }
          },

          updLstChr:function(){ // blinking cursor
              var cont=this.content(); // get console
              if(cont.substring(cont.length-1,cont.length)=="|") // if last char is the cursor
                  $("#console").html($("#console").html().substring(0,cont.length-1)); // remove it
              else
                  this.write("|"); // else write it
          }
      };

      Typer.text=
          "Hi, My name is <b id='a'>Yigal Dviri</b> and i'm a software engineer.  </br>" +
           "Long ago, I've found that when people see you using a command line interface they immediately think you're a hacker. </br>" +
           "So I've created a page that makes you look like a hacker by a simple click. </br>" +
           "No need to do anything else. </br>" +
           "By the way - thanks a lot to Jeff Weisbein - jeff@besttechie.com ...";


      var timer = $interval(function () {
          Typer.addText({"keyCode": 123748});
          if (Typer.index > Typer.text.length) {
              $scope.loading = false;
              clearInterval(timer);
          }
      }, 30);

      function runLogs() {
          var time = 1000;
          var eof = document.getElementById( 'eof' );
          $.getJSON("texts/logs.json", function (data) {
              angular.forEach(data, function (logLine) {
                  $timeout(function () {
                      $scope.logs.push(logLine);
                      if ($scope.logs.length > 200) {
                          $scope.logs = $scope.logs.slice(0,100);
                      }
                      eof.scrollIntoView();
                  }, time += (Math.random()*450));
              })
          });
      }

      function doExceptions() {
          $.getJSON("texts/exp.json", function (data) {
              $interval(function () {
                  $scope.logs.push(data);
              },45000);
          });
      }

      $scope.$watch('loading', function () {
          if($scope.loading === false){
              runLogs();
              doExceptions();
          }
      });

  }]);
