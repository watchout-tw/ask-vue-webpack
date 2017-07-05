<template>
<time class="time" :datetime="timeString">{{ humanFriendlyString }}</time>
</template>

<script>
export default {
  props: {
    start: String,
    end: String
  },
  computed: {
    timeString: function() {
      return this.start + '-' + this.end
    },
    humanFriendlyString: function() {
      var start = this.start.split(':').map(d => parseInt(d))
      var end = this.end.split(':').map(d => parseInt(d))
      start = { h: start[0] - (start[0] > 12 ? 12 : 0), m: start[1], pm: start[0] >= 12 }
      end = { h: end[0] - (end[0] > 12 ? 12 : 0), m: end[1], pm: end[0] >= 12 }
      return (
        start.h + (start.m > 0 ? ':' + (start.m < 10 ? '0' : '') + start.m : '') + (start.pm !== end.pm ? (start.pm ? 'pm' : 'am') : '') + '-' +
        end.h + (end.m > 0 ? ':' + (end.m < 10 ? '0' : '') + end.m : '') + (end.pm ? 'pm' : 'am')
      )
    }
  }
}
</script>
