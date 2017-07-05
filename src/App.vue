<template>
<div id="app">
  <NavigationWithIdentity :channel="channel" :isAuthenticated.sync="isAuthenticated" :modalAuthIsShown.sync="modalAuthIsShown"></NavigationWithIdentity>
  <ModalAuth v-if="modalAuthIsShown" :modalAuthIsShown.sync="modalAuthIsShown" :isAuthenticated.sync="isAuthenticated"></ModalAuth>
  <FooterStandard></FooterStandard>
</div>
</template>

<script>
import dataStore from 'common/src/lib/dataStore'
import NavigationWithIdentity from 'common/src/components/Navigation/Identity'
import ModalAuth from 'common/src/components/Modal/Auth'
import FooterStandard from 'common/src/components/Footer/Standard'

export default {
  name: 'app',
  data() {
    return {
      channel: dataStore.channels.ask,
      isAuthenticated: false,
      modalAuthIsShown: false
    }
  },
  components: {
    NavigationWithIdentity,
    ModalAuth,
    FooterStandard
  }
}
</script>

<style lang="scss">
@import '~common/src/styles/resources';
@import '~common/src/styles/main';
</style>
