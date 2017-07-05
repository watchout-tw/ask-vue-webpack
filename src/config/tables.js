export default [
  {
    name: 'events',
    validator: function(r) {
      return !!r.fields.title && !!r.fields.date && !!r.fields.start && !!r.fields.end
    }
  },
  {
    name: 'guests',
    validator: function(r) {
      return !!r.fields.name
    }
  },
  {
    name: 'partners',
    validator: function(r) {
      return !!r.fields.name
    }
  }
]
