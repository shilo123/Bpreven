import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import queshtinnre from "@/views/questionnaireView.vue";
// import queshtins from "@/views/queshtinsView.vue";
import queshtins from "@/views/QuestionsView.vue";
import Score from "@/views/ScoreView.vue";
import Messages from "@/views/MessageView.vue";
import Features from "@/views/FeaturesView.vue";
import Exercises from "@/views/ExercisesView.vue";
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
    path: "/Messages",
    name: "Messages",
    component: Messages,
  },
  {
    path: "/Users",
    name: "Users",
    component: Users,
  },
  {
    path: "/Features",
    name: "Features",
    component: Features,
  },
  {
    path: "/Exercises",
    name: "Exercises",
    component: Exercises,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
