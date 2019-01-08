<template>
  <div>
    <q-list class="no-border">
      <q-search ref="search" @input="searchdb" class="q-ma-md" v-model="search" placeholder="search by surname or cellphone" />
      <q-item v-for="individual in household.individuals" :key="individual.id">
        {{individual.firstname}}
      </q-item>
    </q-list>
    <q-page-sticky expand position="top-right" :offset="[32, 32]">
      <q-btn round color="primary" @click="addHousehold" class="fixed" icon="fas fa-plus"/>
    </q-page-sticky>
  </div>
</template>

<script>
export default {
  data () {
    return {
      household: {},
      search: ''
    }
  },
  methods: {
    addHousehold () {
      this.$router.push({name: 'householdform', params: { action: 'add' }})
    },
    searchdb () {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.post(process.env.API + '/households/search',
        {
          search: this.search,
          societies: 667
        })
        .then(response => {
          this.groups = response.data
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  },
  mounted () {
    this.$store.commit('setToken', localStorage.getItem('NAMES_Token'))
  }

}
</script>

<style>
</style>
