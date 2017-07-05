<template>
<time class="date" :datetime="dateString">
  <span>{{ dateArray.y }}</span><span class="date-separator">/</span><span>{{ dateArray.m }}</span><span class="date-separator">/</span><span>{{ dateArray.d }}</span>
</time>
</template>

<script>
export default {
  props: {
    dateString: String
  },
  computed: {
    dateArray() {
      var digit = this.dateString.split('-').map(d => parseInt(d))
      return {
        y: digit[0],
        m: digit[1],
        d: digit[2]
      }
    }
  }
}
</script>
