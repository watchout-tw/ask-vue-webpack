<template>
<div class="event event-in-list" :class="classes.event">
  <div class="info">
    <date :dateString="e.date"></date>
    <h3 class="title">{{ e.title }}</h3>
  </div>
  <div v-if="!!e.guests && e.guests.length > 0" class="guests">
    <ul class="list list-unstyled d-flex flex-row flex-wrap justify-content-end">
      <guest v-for="g in e.guests" :key="g.name" :g="g" :class="classes.guest"></guest>
    </ul>
  </div>
  <div class="links d-flex" :class="classes.links">
    <a class="link a-block" v-if="this.video" :href="this.video" target="video"><div class="logo logo-small woo"></div><div class="label"><span class="a-target">影片</span></div></a>
    <a class="link a-block" v-if="e.report" :href="e.report" target="report"><div class="logo logo-small musou"></div><div class="label"><span class="a-target">報導</span></div></a>
    <a class="link a-block" v-if="e.transcript" :href="e.transcript" target="transcript"><div class="icon icon-small transcript"></div><div class="label"><span class="a-target">逐字稿</span></div></a>
  </div>
</div>
</template>

<script>
import mxEvent from '@/mixins/event'
import Date from '@/components/Date'
import Guest from '@/components/Guest'

export default {
  components: {
    Date,
    Guest
  },
  mixins: [mxEvent],
  computed: {
    classes() {
      var flag = this.e.guests.length % 3
      return {
        event: {
          'guest-one': (this.e.guests.length === 1)
        },
        guest: {
          'photo-large': (this.e.guests.length === 1),
          'photo-small': (this.e.guests.length > 2)
        },
        links: {
          'flex-row': !flag,
          'flex-column': flag,
          'contained': flag
        }
      }
    }
  }
}
</script>
