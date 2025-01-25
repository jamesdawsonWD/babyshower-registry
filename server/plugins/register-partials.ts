import { registerPartials } from "~/utils/templates";

export default defineNitroPlugin(() => {
    registerPartials();
    console.log("Partials have been registered.");
});
