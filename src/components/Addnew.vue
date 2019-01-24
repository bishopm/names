<template>
  <div class="q-ma-md text-center">
    <p class="q-ma-md caption">Add new names</p>
    <q-table :data="data" :columns="columns" row-key="firstname" hide-bottom>
      <q-tr slot="body" slot-scope="props" :props="props">
        <q-td class="nameinput" key="firstname" :props="props">
          {{ props.row.firstname }}
          <q-popup-edit v-model="props.row.firstname" buttons>
            <q-field count>
              <q-input @blur="checkrow('f')" v-model="props.row.firstname" />
            </q-field>
          </q-popup-edit>
        </q-td>
        <q-td class="nameinput" key="surname" :props="props">
          {{ props.row.surname }}
          <q-popup-edit v-model="props.row.surname" buttons>
            <q-input @blur="checkrow('s')" v-model="props.row.surname" />
          </q-popup-edit>
        </q-td>
        <q-td class="nameinput" key="sex" :props="props">
          {{ props.row.sex }}
          <q-popup-edit v-model="props.row.sex">
            <q-select v-model="props.row.sex" :options="[{ label: 'female', value: 'female' }, { label: 'male', value: 'male' }]"/>
          </q-popup-edit>
        </q-td>
        <q-td class="nameinput" key="cellphone" :props="props">
          {{ props.row.cellphone }}
          <q-popup-edit v-model="props.row.cellphone" buttons>
            <q-input v-model="props.row.cellphone" />
          </q-popup-edit>
        </q-td>
        <q-td class="nameinput" key="memberstatus" :props="props">
          {{ props.row.memberstatus }}
          <q-popup-edit v-model="props.row.memberstatus">
            <q-select v-model="props.row.memberstatus" :options="[{ label: 'Adult', value: 'adult' }, { label: 'Child', value: 'child' }, { label: 'Youth', value: 'youth' }]"/>
          </q-popup-edit>
        </q-td>
        <q-td>
          <q-btn v-if="data.length > 1" @click="deleterow(props.row)" icon="fa fa-times" size="sm" color="red" round></q-btn>
        </q-td>
      </q-tr>
    </q-table>
    <p class="q-my-lg">
      <q-btn @click="update" class="q-mr-md" color="primary">OK</q-btn>
      <q-btn @click="$router.push('/')" color="black">Cancel</q-btn>
    </p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      columns: [
        { name: 'firstname', required: true, label: 'First name', align: 'center', field: 'firstname' },
        { name: 'surname', required: true, label: 'Surname', align: 'center', field: 'surname' },
        { name: 'sex', required: true, label: 'Gender', align: 'center', field: 'sex' },
        { name: 'cellphone', required: false, label: 'Cellphone', align: 'center', field: 'cellphone' },
        { name: 'memberstatus', required: true, label: '', align: 'center', field: 'memberstatus' }
      ],
      data: [{ firstname: '', surname: '', sex: 'female', cellphone: '', memberstatus: 'adult' }]
    }
  },
  methods: {
    checkrow (ff) {
      if (((ff === 'f') && (this.data.length > 1)) || ((ff === 's') && (this.data.length === 1))) {
        var lastrow = this.data.slice(-1)[0]
        if (lastrow.firstname.length > 0) {
          this.data.push({ firstname: '', surname: lastrow.surname, sex: 'female', cellphone: '', memberstatus: 'adult' })
        }
      }
    },
    deleterow (row) {
      if (this.data.length > 1) {
        this.data.splice(row.__index, 1)
      }
      if ((this.data.length === 1) && (this.data[0].firstname.length > 0)) {
        this.data.push({ firstname: '', surname: '', sex: 'female', cellphone: '', memberstatus: 'adult' })
      }
    },
    update () {
      for (var ndx in this.data) {
        if (this.data[ndx].firstname === '') {
          this.data.splice(ndx, 1)
        } else if (this.data[ndx].surname === '') {
          this.$q.notify('Missing surname')
          break
        }
      }
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.post(process.env.API + '/households/newstickers',
        {
          indivs: this.data
        })
        .then(response => {
          this.$router.push({ name: 'home', params: { fam: response.data } })
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }
}
</script>

<style>
h4 {
  margin-top: 0px;
  text-align: center;
}
td.text-center.cursor-pointer, th.text-center {
  font-size: 115%;
}
.q-table td {
  border-style: none;
}
td.nameinput {
  padding:10px;
  background-color: #f4fff4;
  font-size: 115%;
  border-spacing: 10px 10px;
}
table.q-table {
  border-spacing: 10px;
  border-collapse: separate;
}
.q-field-bottom {
  display: none;
}
</style>
