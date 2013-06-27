        var videoLength;

        var counter = 0;


         //MAP STUFF     
        map = new OpenLayers.Map("map");
        var mapnik = new OpenLayers.Layer.OSM();
        var fromProjection = new OpenLayers.Projection("EPSG:4326"); // Transform from WGS 1984
        var toProjection = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
        var position = new OpenLayers.LonLat(jsonData.points[420].long, jsonData.points[680].lat).transform(fromProjection, toProjection);
        var zoom = 14;
        map.addLayer(mapnik);

        var lineLayer = new OpenLayers.Layer.Vector("Line Layer");

        map.addLayer(lineLayer);
        map.addControl(new OpenLayers.Control.DrawFeature(lineLayer, OpenLayers.Handler.Path));
        var points = new Array;
        for (var i = 0; i < jsonData.points.length; i++) {
            points[i] = new OpenLayers.Geometry.Point(jsonData.points[i].long, jsonData.points[i].lat).transform(fromProjection, toProjection);
        }

        var line = new OpenLayers.Geometry.LineString(points);

        var style = {
            strokeColor: '#0000ff',
            strokeOpacity: 0.5,
            strokeWidth: 5
        };

        var lineFeature = new OpenLayers.Feature.Vector(line, null, style);
        lineLayer.addFeatures([lineFeature]);


        var markerPosition = new OpenLayers.LonLat(-1.397026, 50.934578).transform(fromProjection, toProjection);

        var markers = new OpenLayers.Layer.Markers("Markers");
        map.addLayer(markers);
        myMarker = new OpenLayers.Marker(markerPosition);
        markers.addMarker(myMarker);


        map.setCenter(position, zoom);

         //END OF MAP STUFF              




         //SLIDER BAR            
        $(function () {


            $("#slider").slider({
                range: false,
                change: function (event, ui) {
                    var sliderPos = $('#slider').slider('value');
                    ///slider length is 100
                    var posChecker = Math.round((videoLength / 100) * sliderPos);
                    //                              $('#sliderPosition').text(posChecker);
                    seekTo(posChecker);
                    counter = posChecker;
                }
            });

        });

         //END OF SLIDER BAR     




         //YOUTUBE STUFF

         // 2. This code loads the IFrame Player API code asynchronously.
        var tag = document.createElement('script');

        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

         // 3. This function creates an <iframe> (and YouTube player)
         //    after the API code downloads.
        var player;

        function onYouTubeIframeAPIReady() {
            player = new YT.Player('player', {
                height: '390',
                width: '640',
                videoId: jsonData.video_id,
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        }

         // 4. The API will call this function when the video player is ready.

        function onPlayerReady(event) {
            event.target.playVideo();
        }

         // 5. The API calls this function when the player's state changes.
         //    The function indicates that when playing a video (state=1),
         //    the player should play for six seconds and then stop.

        function onPlayerStateChange(event) {
            videoLength = player.getDuration(); //in minutes
            setInterval(updateMapInfo, 1000);
            updateMapInfo();
        }

        function updateMapInfo() {
            counter++;
            //          var position       = new OpenLayers.LonLat(jsonData.points[counter].long,jsonData.points[counter].lat).transform( fromProjection, toProjection);
            //        var zoom           = 15; 

            //        map.addLayer(mapnik);
            //        map.setCenter(position, zoom );

			var arrayPos=Math.round(player.getCurrentTime());
			if ((arrayPos+7)<jsonData.points.length){
				arrayPos+=7;
				//hardcoded offset
			}
            if (jsonData.points[counter] != undefined) {
                myMarker.destroy();

                var markerPosition = new OpenLayers.LonLat(jsonData.points[arrayPos].long, jsonData.points[arrayPos].lat).transform(fromProjection, toProjection);

                var markers = new OpenLayers.Layer.Markers("Markers");
                map.addLayer(markers);
                myMarker = new OpenLayers.Marker(markerPosition);
                markers.addMarker(myMarker);
            }



        }

        function stopVideo() {
            player.stopVideo();
        }

        function seekTo(time) {
            player.seekTo(time);
        }

         // Display information about the current state of the player

        function updatePlayerInfo() {
            // Also check that at least one function exists since when IE unloads the
            // page, it will destroy the SWF before clearing the interval.
            if (player && player.getDuration) {
                $("#slider").slider('value', Math.round(player.getCurrentTime() / player.getDuration() * 100));
            }
        }
         //END OF YOUTUBE