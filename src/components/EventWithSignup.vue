<template>
<div class="event event-with-signup">
  <div class="container">
    <div class="row d-sm-flex flex-row">
      <div class="event-text">
        <div class="info">
          <h2 class="title">{{ e.title }}</h2>
          <date :dateString="e.date" class="date-large"></date>
          <time-period :start="e.start" :end="e.end" class="time-large"></time-period>
        </div>
        <div class="description pgroup">
          <p v-for="paragraph in e.description.split(this.newline)">{{ paragraph }}</p>
        </div>
        <div v-if="!!e.organizers && e.organizers.length > 0" class="organizers">
          <ul class="list list-unstyled"><label>合作夥伴</label>
            <partner v-for="p in e.organizers" :key="p.name" :p="p"></partner>
          </ul>
        </div>
      </div>
      <div class="event-images">
        <div v-if="!!e.guests && e.guests.length > 0" class="guests">
          <ul class="list list-unstyled d-flex flex-row flex-wrap justify-content-center justify-content-md-start">
            <guest v-for="g in e.guests" :key="g.name" :g="g"></guest><a class="guest signup" :class="signupType" :href="e.signup" target="signup"><div class="photo"></div></a>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import mxEvent from '@/mixins/event'
import Date from '@/components/Date'
import TimePeriod from '@/components/TimePeriod'
import Guest from '@/components/Guest'
import Partner from '@/components/Partner'

export default {
  components: {
    Date,
    TimePeriod,
    Guest,
    Partner
  },
  mixins: [mxEvent],
  computed: {
    newline: function() {
      return '\n'
    },
    signupType: function() {
      return !!this.e.type && this.e.type.includes('online') ? 'online' : ''
    }
  }
}
</script>
