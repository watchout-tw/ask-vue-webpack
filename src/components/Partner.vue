<template>
<li>{{ p.name }}</li>
</template>

<script>
export default {
  props: {
    p: {
      type: Object,
      validator: function(data) {
        return true
      }
    }
  }
}
</script>
