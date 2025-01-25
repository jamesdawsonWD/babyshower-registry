import { checkLoginStatus } from "~/utils/auth";


export default defineEventHandler(async (event) => {
  try {
    const { loggedIn, name: username } = await checkLoginStatus(event);

    console.log(username);
    // Render the header with the loggedIn parameter
    const headerHtml = await loadTemplate("header")({
      loggedIn,
      username,
    });

    // Render the layout template with dynamic content
    const fullHtml = await loadTemplate("layout");

    const landing = loadView("landing-page")({});
    
    return fullHtml({
      title: "My App",
      content: landing,
      header: headerHtml,
    });
  } catch (error) {
    console.error("Error serving templates:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to load templates.",
    });
  }
});
