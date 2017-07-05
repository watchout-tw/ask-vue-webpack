export default {
  props: {
    e: {
      type: Object,
      validator: function(data) {
        return true
      }
    }
  },
  computed: {
    video: function() {
      return {
        youtube: this.e.youtube,
        facebook: this.e.facebook,
        livehousein: this.e.livehousein
      }[this.e.primary]
    },
    youtubeID: function() {
      return this.e.youtube.split('/').pop()
    },
    player: function() {
      var backgroundImageURL = (this.e.keyVisual
        ? 'asset/events/' + this.e.keyVisual
        : 'https://img.youtube.com/vi/' + this.youtubeID + '/maxresdefault.jpg'
      )
      return {
        styles: {
          backgroundImage: 'url(' + backgroundImageURL + ')'
        }
      }
    }
  }
}
