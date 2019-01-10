<template>
  <div class="q-ma-md text-center">
    <p class="q-ma-md caption">Add a new household or individual</p>
    <q-table :data="data" :columns="columns" row-key="firstname" hide-bottom>
      <q-tr slot="body" slot-scope="props" :props="props">
        <q-td key="firstname" :props="props">
          {{ props.row.firstname }}
          <q-popup-edit v-model="props.row.firstname">
            <q-field count>
              <q-input @blur="checkrow" v-model="props.row.firstname" />
            </q-field>
          </q-popup-edit>
        </q-td>
        <q-td key="surname" :props="props">
          {{ props.row.surname }}
          <q-popup-edit v-model="props.row.surname" title="Update surname" buttons>
            <q-input v-model="props.row.surname" />
          </q-popup-edit>
        </q-td>
        <q-td key="sex" :props="props">
          {{ props.row.sex }}
          <q-popup-edit v-model="props.row.sex" title="Update sex" buttons>
            <q-select v-model="props.row.sex" :options="[{ label: 'female', value: 'female' }, { label: 'male', value: 'male' }]"/>
          </q-popup-edit>
        </q-td>
        <q-td key="cellphone" :props="props">
          {{ props.row.cellphone }}
          <q-popup-edit v-model="props.row.cellphone" title="Update cellphone" buttons>
            <q-input v-model="props.row.cellphone" />
          </q-popup-edit>
        </q-td>
        <q-td key="memberstatus" :props="props">
          {{ props.row.memberstatus }}
          <q-popup-edit v-model="props.row.memberstatus" title="Update status" buttons>
            <q-select v-model="props.row.memberstatus" :options="[{ label: 'Adult', value: 'adult' }, { label: 'Child', value: 'child' }, { label: 'Youth', value: 'youth' }]"/>
          </q-popup-edit>
        </q-td>
      </q-tr>
    </q-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      columns: [
        { name: 'firstname', required: true, label: 'First name', align: 'center', field: 'firstname' },
        { name: 'surname', required: true, label: 'Surname', align: 'center', field: 'surname' },
        { name: 'sex', required: true, label: 'Sex', align: 'center', field: 'sex' },
        { name: 'cellphone', required: false, label: 'Cellphone', align: 'center', field: 'cellphone' },
        { name: 'memberstatus', required: true, label: '', align: 'center', field: 'memberstatus' }
      ],
      data: [{ firstname: '', surname: '', sex: 'female', cellphone: '', memberstatus: 'adult' }]
    }
  },
  methods: {
    checkrow () {
      if (this.data.slice(-1).firstname === '') {
        //
      }
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
</style>
