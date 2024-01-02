import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import queshtinnre from "@/views/questionnaireView.vue";
// import queshtins from "@/views/queshtinsView.vue";
import queshtins from "@/views/QuestionsView.vue";
import Score from "@/views/ScoreView.vue";
import Users from "@/views/UsersView.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/queshtinnre",
    name: "queshtinnre",
    component: queshtinnre,
  },
  {
    path: "/queshtins",
    name: "queshtins",
    component: queshtins,
  },
  {
    path: "/Score",
    name: "Score",
    component: Score,
  },
  {
    path: "/Users",
    name: "Users",
    component: Users,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
