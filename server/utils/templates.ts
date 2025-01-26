import fs from "fs";
import path from "path";
import Handlebars from "handlebars";

/**
 * Registers all Handlebars partials in the "templates" directory.
 */
export function registerPartials() {
    const partialsDir = path.resolve("templates");
    const files = fs.readdirSync(partialsDir);

    Handlebars.registerHelper("eq", (a, b) => a === b);

    Handlebars.registerHelper("ternary", (condition, trueValue, falseValue) => {
        return condition ? trueValue : falseValue;
    });

    Handlebars.registerHelper("range", function (start, end, options) {
        let result = "";
        for (let i = start; i <= end; i++) {
            result += options.fn(i);
        }
        return result;
    });

    files.forEach((file) => {
        if (file.endsWith(".hbs")) {
            const partialName = path.basename(file, ".hbs"); // Extract file name without extension
            const partialPath = path.join(partialsDir, file);
            const partialContent = fs.readFileSync(partialPath, "utf-8");
            Handlebars.registerPartial(partialName, partialContent);
        }
    });

    console.log("Partials registered:", files);
}

const templateCache = new Map<string, HandlebarsTemplateDelegate<any>>(); // In-memory cache

/**
 * Loads a Handlebars template from the "templates" directory.
 * @param templateName The name of the template (without the .hbs extension).
 * @returns The compiled Handlebars template function.
 */
export function loadTemplate(templateName: string) {
    if (templateCache.has(templateName)) {
        // Return cached template if available
        return templateCache.get(templateName);
    }

    const templatePath = path.resolve(`templates/${templateName}.hbs`);
    if (!fs.existsSync(templatePath)) {
        throw new Error(`Template not found: ${templatePath}`);
    }

    const compiledContent = Handlebars.compile(
        fs.readFileSync(templatePath, "utf-8"),
    );
    // Cache the template content
    templateCache.set(templateName, compiledContent);

    return compiledContent;
}

/**
 * Loads a Handlebars view from the "views" directory.
 * @param viewName The name of the view (without the .hbs extension).
 * @returns The compiled Handlebars view function.
 */
export function loadView(viewName: string) {
    const viewPath = path.resolve(`views/${viewName}.hbs`);
    if (!fs.existsSync(viewPath)) {
        throw new Error(`View not found: ${viewPath}`);
    }
    console.log(`Loading view: ${viewPath}`);
    return Handlebars.compile(fs.readFileSync(viewPath, "utf-8"));
}
