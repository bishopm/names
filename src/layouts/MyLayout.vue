<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar color="primary" :glossy="$q.theme === 'mat'" :inverted="$q.theme === 'ios'">
        <q-btn flat dense round @click="$router.push('/')" aria-label="Settings">
          <q-icon name="fa fa-home" />
        </q-btn>
        <q-toolbar-title>
          <router-link to="/" class="text-white" style="text-decoration:none;">
            {{church}}
          </router-link>
          <div slot="subtitle">
            <router-link to="/" class="text-white" style="text-decoration:none;">
              Find your details and print a nametag
            </router-link>
          </div>
        </q-toolbar-title>
        <q-btn flat dense round @click="$router.push('settings')" aria-label="Settings">
          <q-icon name="fa fa-cog" />
        </q-btn>
      </q-toolbar>
    </q-layout-header>

    <q-page-container>
      <router-view />
    </q-page-container>
    <q-layout-footer>
      <q-toolbar class="justify-around">
        {{now}} | Service: {{nextservicetime}}
      </q-toolbar>
    </q-layout-footer>
  </q-layout>
</template>

<script>
import { date } from 'quasar'

export default {
  name: 'MyLayout',
  data () {
    return {
      church: localStorage.getItem('NAMES_Societyname') + ' Methodist Church',
      services: [],
      nextservicetime: '',
      starttimes: [],
      dayofweek: '',
      now: '',
      min: 0,
      hrs: 0,
      newdate: ''
    }
  },
  mounted () {
    if (localStorage.getItem('NAMES_Version')) {
      if (localStorage.getItem('NAMES_Version') !== process.env.VERSION) {
        this.$q.dialog({
          title: 'New version available',
          message: 'Click OK to restart the app and upgrade to version ' + process.env.VERSION,
          ok: 'OK',
          cancel: 'LATER'
        }).then(() => {
          localStorage.setItem('NAMES_Version', process.env.VERSION)
          window.location.reload()
        }).catch(() => {
          console.log('Delaying upgrade')
        })
      }
    } else {
      localStorage.setItem('NAMES_Version', process.env.VERSION)
    }
    this.dayofweek = date.formatDate(this.$store.state.now, 'd')
    this.$store.commit('setNow', Date.now())
    this.$nextTick(function () {
      window.setInterval(this.updateTime, 1000 * 60)
    })
    if (localStorage.getItem('NAMES_Society')) {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.get(process.env.API + '/services/' + localStorage.getItem('NAMES_Society'))
        .then(response => {
          this.services = response.data
          if ((this.services.length === 1) || (this.dayofweek !== 0)) {
            this.nextservicetime = this.services[0].servicetime
            this.$store.commit('setService', this.services[0].id)
          } else {
            for (var skey in this.services) {
              let thistime = this.services[skey].servicetime
              var thistimes = []
              if (thistime.indexOf('h') > 0) {
                thistimes = thistime.split('h')
              } else {
                thistimes = thistime.split(':')
              }
              var adjustedDate = date.adjustDate(this.$store.state.now, { hours: parseInt(thistimes[0]), minutes: parseInt(thistimes[1]), seconds: 0 })
              var adjustedTime = date.addToDate(adjustedDate, { minutes: 30 })
              this.services[skey].newtime = date.formatDate(adjustedTime, 'x')
              this.services[skey].formattednewt = date.formatDate(adjustedTime, 'HH:mm')
            }
          }
          this.updateTime()
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  },
  methods: {
    updateTime () {
      this.$store.commit('setNow', Date.now())
      this.now = date.formatDate(this.$store.state.now, 'HH:mm')
      if (this.dayofweek === 0) {
        for (var skey in this.services) {
          if (this.$store.state.now < this.services[skey].newtime) {
            this.nextservicetime = this.services[skey].servicetime
            this.$store.commit('setService', this.services[skey].id)
            break
          }
        }
      }
    }
  }
}
</script>

<style>
  a {
    color:white;
    text-decoration: none;
    font-weight: normal;
  }
</style>
