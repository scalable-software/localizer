import { ComponentTemplate } from "@scalable.software/localizer";

await ComponentTemplate.Template.load("component.template.html");

customElements.define(ComponentTemplate.Tag, ComponentTemplate);
