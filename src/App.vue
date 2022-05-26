<template>
  <div class="main">
    <Modal 
    v-if="modalOpen" 
    v-on:close-modal="toggleModal" 
    :APIkey="APIkey"
    />

    <Navigation  
    v-on:add-city="toggleModal" 
    v-on:edit-city="toggleEdit" 
    :addCityActive="addCityActive"
    :isDay="isDay"
    :isNight="isNight"
    />

    <router-view 
    :isDay="isDay"
    :isNight="isNight"
    v-bind:cities="cities" 
    v-bind:edit="edit" 
    :APIkey="APIkey"
    v-on:is-day="dayTime" 
    v-on:is-night="nightTime"
    v-on:resetDays="resetDays"
    />

  </div>
</template>

<script>
import axios from "axios";
import db from "./firebase/firebaseinit.js";
import Navigation from "./components/Navigation.vue"; 
import Modal from "./components/Modal.vue";
export default {
  name: "App",
  components: {
    Navigation,
    Modal,
},
  data() {
    return {
      isDay: null,
      isNight: null,
      APIkey: "3e9b6eb5c2e8f46ab063fac7ccf3099e",
      cities: [],
      modalOpen: null,
      edit: null,
      addCityActive: null,
    };
  },
  created() {
    this.getCityWeather();
    this.checkRoute();
  },
  methods: {
    getCityWeather() {
      let firebaseDB = db.collection("cities");

      firebaseDB.onSnapshot((snap) => {
        snap.docChanges().forEach(async (doc) => {

          if (doc.type === "added" && !doc.doc.Nd) {
            try {
              const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${doc.doc.data().city}&units=imperial&APPID=${this.APIkey}`);
              const data = response.data;
              firebaseDB
                .doc(doc.doc.id)
                .update({
                  currentWeather: data,
                })
                .then(() => {
                  this.cities.push(doc.doc.data());
                });
            } catch (err) {
              console.log(err);
            }
          } else if (doc.type === "added" && doc.doc.Nd) {
            this.cities.push(doc.doc.data());
          } else if (doc.type === 'removed') {
            this.cities = this.cities.filter((city) => city.city
            != doc.doc.data().city);
          }
        });
      });
    },
    toggleModal() {
      this.modalOpen = !this.modalOpen;
    },
    toggleEdit() {
      this.edit = !this.edit;
    },
    checkRoute() {
      if (this.$route.name === "AddCity") {
        this.addCityActive = true;
      } else {
        this.addCityActive = false;
      }
    },
    dayTime() {
      this.isDay = !this.isDay;
    },
    nightTime() {
      this.isNight = !this.isNight;
    },
    resetDays() {
      this.isDay = false;    
      this.isNight = false; 
    }
  },
  watch: {
    $route() {
      this.checkRoute();
    }
  }
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Quicksand', sans-serif;
}

/* scroll bar
================ */
// ::-webkit-scrollbar {
//   width: 12px;
// }

// ::-webkit-scrollbar-track {
//   background: #545455;
//   box-shadow: 0 0 2px rgba(0, 0, 0, 2) inset;
// }

// ::-webkit-scrollbar-thumb {
//   background: #313640;
//   border-radius: 8px;
//   border: 3px solid #9c9c9c;
// }


.day {
    transition: 500ms ease all;
    background-color: rgb(59, 150, 249);
    box-shadow: 0 4px 6px -1px 
    rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.night {
    transition: 500ms ease all;
    background-color: rgb(20, 42, 95);
    box-shadow: 0 4px 6px -1px 
    rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.main {
  margin: 0 auto;
  height: 100vh;

  .container {
    padding: 0 20px
  }
 
}
 
</style>
