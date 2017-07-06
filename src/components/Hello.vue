<template>
<div id="hello">
  <section id="cover" :title="cover.title"></section>
  <section id="now" v-if="now.event">
    <div class="label bg-musou-light" :status="now.status">
      <div class="lightbulb d-inline-block align-top animate-flicker"><div class="bulb"></div></div><label class="d-inline-block align-top">{{ now.status }}</label>
    </div>
    <event-with-player :e="now.event" :title="now.event.title"></event-with-player>
  </section>
  <section id="next" class="bg-ask-light" v-if="next.event" :e="next.event">
    <div class="label bg-ask-light">
      <label>{{ next.title }}</label>
    </div>
    <event-with-signup :e="next.event" :title="next.event.title"></event-with-signup>
  </section>
  <section id="intro">
    <h2 class="header-block-tall header-center bg-ask-gradient-to-transparent">{{ intro.title }}</h2>
    <div class="pgroup pgroup-center">
      <p v-for="p in intro.content" :key="p">{{ p }}</p>
    </div>
  </section>
  <section id="history">
    <h2 class="header-block header-center bg-ask-light">{{ history.title }}</h2>
    <div class="container events">
      <ul class="row list list-unstyled">
        <li v-for="e in history.events" :key="e.title" class="item col-md-6 col-lg-4">
          <event-in-list :e="e" :title="e.title"></event-in-list>
        </li>
      </ul>
    </div>
  </section>
</div>
</template>

<script>
import dataStore from 'common/src/lib/dataStore'
import tables from '@/config/tables'
import EventWithPlayer from '@/components/EventWithPlayer'
import EventWithSignup from '@/components/EventWithSignup'
import EventInList from '@/components/EventInList'

export default {
  created() {
    // get db ready
    tables.forEach((table, i) => {
      this.db[table.name] = require('../data/' + table.name + '.json').records.filter(table.validator).map(r => {
        return Object.assign(r.fields, {id: r.id}) // add id to fields
      })
    })

    // Sort events by start time
    this.db.events.sort((a, b) => {
      return this.getEventStartTime(b) - this.getEventStartTime(a) // sort date DESC
    })

    // Join tables & sort events into groups
    var twoDays = 2 * 24 * 60 * 60
    var now = Math.round(new Date().getTime() / 1000)
    var eventGroups = { // event groups
      live: -1,
      soon: -1,
      next: -1,
      nextCandidates: [],
      history: []
    }

    this.db.events.forEach((e, i) => {
      // map guests
      if(!!e.guests && e.guests.length > 0) {
        e.guests = e.guests.map(guestID => {
          return this.db.guests.filter(guest => guest.id === guestID).pop()
        })
      }

      // map organizers
      if(!!e.organizers && e.organizers.length > 0) {
        e.organizers = e.organizers.map(organizerID => {
          return this.db.partners.filter(partner => partner.id === organizerID).pop()
        })
      }

      // sort into event groups
      e.time = {}
      e.time.start = this.getEventStartTime(e)
      e.time.end = this.getEventEndTime(e)

      if(e.time.end < now) { // event has ended
        eventGroups.history.push(i)
      } else { // event has not ended
        if(e.time.start <= now) { // event has started
          eventGroups.live = i
        } else { // event has not started
          eventGroups.nextCandidates.push(i)
          if(e.time.start <= now + twoDays) {
            eventGroups.soon = i
          }
        }
      }
    })

    eventGroups.next = eventGroups.nextCandidates.pop()
    if(eventGroups.next === eventGroups.soon && eventGroups.live === -1) {
      eventGroups.next = eventGroups.next - 1
    }

    this.now.status = eventGroups.live > -1 ? 'LIVE' : 'SOON'
    this.now.event = eventGroups.live > -1 ? this.db.events[eventGroups.live] : eventGroups.soon > -1 ? this.db.events[eventGroups.soon] : null
    this.next.event = eventGroups.next > -1 > 0 ? this.db.events[eventGroups.next] : null
    this.history.events = eventGroups.history.map(k => {
      return this.db.events[k]
    })
  },
  data() {
    return {
      dataStore,
      db: {
        guests: [],
        partners: [],
        events: []
      },
      cover: {
        title: '沃草給問擂台'
      },
      intro: {
        title: '什麼是給問？',
        content: ['給問擂台是沃草2017年系列活動，以「直接、公開、對話」等原則，嘗試建構出政治人物與公民直接溝通的平台。另外，透過分組討論的互動方式，也能讓公民理解代議政治的內涵。', '這是一場模擬代議政治的社會實驗，期待實驗成果成為公民社會茁壯的養分。']
      },
      now: {
        title: 'NOW',
        status: undefined,
        event: undefined
      },
      next: {
        title: '給問預告',
        event: undefined
      },
      history: {
        title: '給問歷史',
        events: []
      }
    }
  },
  components: {
    EventWithPlayer,
    EventWithSignup,
    EventInList
  },
  methods: {
    // do not use arrow function here
    getEventStartTime(e) {
      return Math.round(new Date(e.date + 'T' + (e.start.length < 5 ? '0' : '') + e.start + '+08:00').getTime() / 1000)
    },
    getEventEndTime(e) {
      return Math.round(new Date(e.date + 'T' + (e.end.length < 5 ? '0' : '') + e.end + '+08:00').getTime() / 1000)
    }
  }
}
</script>

<style lang="scss">
@import '~common/src/styles/resources';
@import '~common/src/styles/main';
@import '../styles/animate';

$font-size-small: 0.875rem;
$section-label-size: 3rem;
$sqrt-3: 1.732051;

section {
  > .label {
    @include font-monospace-serif;
    position: relative;
    height: 3rem;
    margin: 0 auto;
    padding: 0;
    font-weight: bold;
    font-size: 1.5rem;
    line-height: 3rem;
    display: block;
    text-align: center;

    > .lightbulb {
      position: relative;
      width: 1.5rem;
      height: 3rem;
      margin-right: 0.25rem;

      > .bulb {
        position: absolute;
        width: 1.5rem;
        height: 1.5rem;
        top: 50%;
        transform: translateY(-50%);
        left: 0;
        border-radius: 50%;
        border: 2px $color-musou solid;
      }
    }

    &[status="LIVE"] {
      > .lightbulb > .bulb {
        background: $color-musou;
      }
    }
    &[status="SOON"] {
      > .lightbulb > .bulb {
        border: 4px $color-musou solid;
      }
    }
  }
  &#cover {
    height: 0;
    padding-bottom: 88.8888889%;
    @include placeholder;
    background-image: url(~assets/opening-compact.jpg);

    @include bp-sm-up {
      padding-bottom: 50%;
      background-image: url(~assets/opening-regular.jpg);
    }
    @include bp-lg-up {
      padding-bottom: 33.333333%;
      background-image: url(~assets/opening-wide.jpg);
    }
  }
  &#now {
    @include bp-sm-up {
      padding-top: 2rem;
      > .label {
        width: 6rem;

        &:before, &:after {
          position: absolute;
          content: '';
          display: inline-block;
          width: 0;
          height: 0;
        }
        &:before {
          border-bottom: $section-label-size rgba($color-musou, 0.25) solid;
	        border-left: $section-label-size/$sqrt-3 transparent solid;
          right: 100%;
        }
        &:after {
          border-top: $section-label-size rgba($color-musou, 0.25) solid;
          border-right: $section-label-size/$sqrt-3 transparent solid;
          left: 100%;
        }
      }
    }
  }
}
.player-container {
  width: 100%;
  > .player {
    position: relative;
    max-width: 60rem;
    margin: 0 auto;
    @include placeholder;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.25);
    > .embed-responsive-item {
      background-size: contain;
    }
    > .play {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 96px;
      height: 96px;
      background-image: url(../assets/play.png);
      background-size: contain;
      cursor: pointer;
      @include bp-sm-up {
        width: 192px;
        height: 192px;
      }
    }
  }
}

.organizers > ul {
  > label {
    font-size: $font-size-small;
    font-weight: 500;
  }
}
.date, .time {
  display: block;
}
.date {
  @include font-monospace;
  > .date-separator {
    color: $color-ask;
  }

  &.date-large {
    font-size: 1.5rem;
    line-height: 1.875rem;
    > .date-separator {
      font-size: 1rem;
      line-height: 1.875rem;
    }
  }
}
.time {
  @include font-monospace;

  &.time-large {
    font-size: 1.5rem;
    line-height: 1.875rem;
  }
}
.event {
  position: relative;
  .info {
    margin: 0.5rem 0;
  }
  .guests {
    margin: 0 -0.5rem; // compensating the left+right margin of .guest
  }
  .organizers {
    margin: 0.5rem 0;
  }
}
.guest {
  position: relative;
  margin: 0.5rem;
  > .photo {
    width: 8rem;
    height: 0;
    padding-bottom: 100%;
    border-radius: 50%;
    background-color: $color-placeholder;
    background-size: cover;
  }
  > .name, > .job {
    display: block;
  }
  > .job {
    font-size: $font-size-small;
    font-weight: 500;
  }

  &.photo-small > .photo {
    width: 6rem;
  }
  &.photo-large > .photo {
    width: 12rem;
  }
  &.signup {
    > .photo {
      background-color: $color-ask;
      background-image: url(../assets/+1.png);
      background-size: contain;
      background-position: center center;
      box-shadow: 0px 2px 6px $color-shadow;
    }
    &.online > .photo {
      background-image: url(../assets/+1-online.png);
    }
  }
}
.event-with-player, .event-with-signup {
  h2 {
    margin: 1rem 0;
  }
}
.event-with-signup {
  .event-text {
    margin: 0 1rem;
    max-width: 18rem;
  }
  .event-images {
    margin: 1rem;
    max-width: 36rem;
  }
}
.event-in-list {
  border-top: 4px rgba($color-ask, 0.85) solid;
  margin-bottom: 2rem;
  .title {
    margin: 0;
  }
  .guest {
    margin: 0.25rem 0.25rem;
  }
  .name {
    position: absolute;
    right: 0;
    bottom: 0;
    font-size: $font-size-small;
    text-align: right;
    background: white;
    padding: 0 0.25rem;
  }
  .job {
    display: none;
  }
  .links {
    > .link {
      margin-right: 0.5rem;
      > .logo-small, > .icon-small, > .label {
        display: inline-block;
        vertical-align: top;
      }
      > .logo-small, > .icon-small {
        margin-right: 0.25rem;
      }
    }
    &.contained {
      position: absolute;
      bottom: 0;
    }
  }
  &.guest-one {
    padding-top: 1.5rem;
    .info {
      position: absolute;
      top: 0;
      z-index: 1;
    }
  }
}
</style>
