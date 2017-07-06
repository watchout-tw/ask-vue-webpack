<template>
<li class="guest">
  <div class="photo" :style="styles.photo"></div>
  <label class="name">{{ g.name }}</label>
  <label class="job">{{ g.job }}</label>
</li>
</template>

<script>
export default {
  props: {
    g: {
      type: Object,
      validator(data) {
        return true
      }
    }
  },
  computed: {
    styles() {
      var photoURL = null
      if(this.g.photo) {
        if(this.g.photo.indexOf('http') >= 0) {
          photoURL = this.g.photo + this.g.name + '.jpg'
        } else {
          photoURL = require('_/guests/' + this.g.photo)
        }
      }
      return {
        photo: photoURL ? { backgroundImage: `url(${photoURL})` } : {}
      }
    }
  }
}
</script>
