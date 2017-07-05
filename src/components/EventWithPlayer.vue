<template>
<div class="event event-with-player">
  <div class="player-container">
    <div class="player embed-responsive embed-responsive-16by9" @click="play">
      <div class="content embed-responsive-item" :style="player.styles"></div>
      <div class="play"></div>
    </div>
  </div>
  <div class="container-fluid container-960">
    <div class="d-sm-flex justify-content-between">
      <div class="info">
        <h2 class="title">{{ e.title }}</h2>
        <date :dateString="e.date"></date>
        <time-period :start="e.start" :end="e.end"></time-period>
      </div>
      <div class="organizers text-sm-right" v-if="!!e.organizers && e.organizers.length > 0">
        <ul class="list list-unstyled"><label>合作夥伴</label>
          <partner v-for="p in e.organizers" :key="p.name" :p="p"></partner>
        </ul>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import mxEvent from '@/mixins/event'
import Date from '@/components/Date'
import TimePeriod from '@/components/TimePeriod'
import Partner from '@/components/Partner'

import $ from 'jquery'
global.$ = window.jQuery = window.$ = require('jquery')

export default {
  components: {
    Date,
    TimePeriod,
    Partner
  },
  mixins: [mxEvent],
  methods: {
    play(event) {
      var url, html
      if(this.e.primary === 'youtube') {
        url = 'https://www.youtube.com/embed/' + this.youtubeID + '?autoplay=1'
        html = '<iframe class="content embed-responsive-item" src="' + url + '" frameborder="0" allowfullscreen></iframe>'
      } else if(this.e.primary === 'facebook') {
        url = this.e.facebook
        html = '<div id="fb-root"></div><script>(function(d, s, id) { var js, fjs = d.getElementsByTagName(s)[0]; if (d.getElementById(id)) return; js = d.createElement(s); js.id = id; js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.6"; fjs.parentNode.insertBefore(js, fjs); }(document, "script", "facebook-jssdk"));' +
          '<' + '/' + 'script' + '>' +
          '<div class="fb-video" data-href="' + url + '" data-allowfullscreen="true" data-width="960" style="position:absolute;top:0;"></div>'
      } else if(this.e.primary === 'livehousein') {
        url = this.e.livehousein
        html = '<iframe width="960" height="350" src="' + url + '" frameborder="0" allowfullscreen></iframe>'
      }
      $('.player > .content').replaceWith(html)
      $('.player > .play').fadeOut()
    }
  }
}
</script>
