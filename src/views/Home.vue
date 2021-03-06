<template>
  <div class="home" v-if="displayGraphs">
    <p>Last Update: {{ formattedLastUpdated }}</p>
    <vue-frappe
      id="temperature"
      :labels="labels"
      title="Temperature"
      :height="300"
      :dataSets="temperature.datasets"
      :tooltipOptions="temperature.tooltipOptions"
    />
    <vue-frappe
      id="light"
      :labels="labels"
      title="Light"
      :height="300"
      :dataSets="light.datasets"
      :tooltipOptions="light.tooltipOptions"
    />
    <vue-frappe
      id="humidity"
      :labels="labels"
      title="Humidity"
      :height="300"
      :dataSets="humidity.datasets"
      :tooltipOptions="humidity.tooltipOptions"
    />
    <vue-frappe
      id="pressure"
      :labels="labels"
      title="Pressure"
      :height="300"
      :dataSets="pressure.datasets"
      :tooltipOptions="pressure.tooltipOptions"
    />
  </div>
</template>

<script>
import { VueFrappe } from 'vue2-frappe';

export default {
  components: {
    VueFrappe,
  },
  data: () => ({
    labels: [],
    temperature: {
      datasets: [],
      tooltipOptions: {
        formatTooltipY: (d) => `${d}C`,
      },
    },
    humidity: {
      datasets: [],
      tooltipOptions: {
        formatTooltipY: (d) => `${d}%`,
      },
    },
    pressure: {
      datasets: [],
      tooltipOptions: {
        formatTooltipY: (d) => `${d}mb`,
      },
    },
    light: {
      datasets: [],
      tooltipOptions: {
        formatTooltipY: (d) => `${d}lx`,
      },
    },
    room: 'boxroom',
    json: null,
    displayGraphs: false,
    lastUpdate: null,
  }),

  async mounted() {
    await this.loadData();
    this.setGraphData();
  },

  computed: {
    formattedLastUpdated() {
      return new Date(this.lastUpdate);
    },
  },

  methods: {
    async fetchData() {
      const NOW = +new Date();

      this.json = await fetch('/.netlify/functions/get').then((data) => data.json());

      window.localStorage.setItem(`data:${this.room}`, JSON.stringify({
        timestamp: +new Date(),
        data: this.json,
      }));

      this.lastUpdate = NOW;
    },
    async loadData() {
      const NOW = +new Date();
      const MINUTES_TILL_EXPIRE = 15;
      const TIME_TILL_EXPIRED_MS = MINUTES_TILL_EXPIRE * 60 * 1000;
      const storedData = window.localStorage.getItem(`data:${this.room}`);

      if (storedData) {
        const { timestamp, data } = JSON.parse(storedData);
        if (timestamp + TIME_TILL_EXPIRED_MS < NOW) {
          await this.fetchData();
        } else {
          this.json = data;
          this.lastUpdate = timestamp;
        }
      } else {
        await this.fetchData();
      }
    },
    setGraphData() {
      this.labels = this.json.map((record) => {
        const d = new Date(record.d);
        return `${d.getDate()}-${d.getMonth() + 1} ${d.getHours()}:${d.getMinutes()}`;
      });

      this.temperature.datasets.push({
        name: 'Temperature',
        chartType: 'line',
        values: this.json.map((x) => x.t),
      });

      this.humidity.datasets.push({
        name: 'Humidity',
        chartType: 'line',
        values: this.json.map((x) => x.h),
      });

      this.pressure.datasets.push({
        name: 'Pressure',
        chartType: 'line',
        values: this.json.map((x) => x.p),
      });

      this.light.datasets.push({
        name: 'Light',
        chartType: 'line',
        values: this.json.map((x) => x.l),
      });

      this.displayGraphs = true;
    },
  },
};
</script>
