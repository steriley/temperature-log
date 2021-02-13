<template>
  <div class="home" v-if="json">
    <vue-frappe
      id="temperature"
      :labels="labels"
      title="Temperature"
      :height="300"
      :dataSets="temperature.datasets"
      :tooltipOptions="temperature.tooltipOptions"
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
        formatTooltipY: (d) => `${d}Bar`,
      },
    },
    room: 'boxroom',
    json: null,
  }),
  async mounted() {
    this.json = await fetch('/.netlify/functions/get').then((data) => data.json());

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
      chartType: 'bar',
      values: this.json.map((x) => x.h),
    });

    this.pressure.datasets.push({
      name: 'Pressure',
      chartType: 'line',
      values: this.json.map((x) => x.p),
    });
  },
};
</script>
