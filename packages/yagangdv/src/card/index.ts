import type { App } from "vue";
import Card from "./Card";

(Card as any).install = (app: App) => {
  app.component(Card.name, Card);
};

export type { CardEmits, CardProps, CardSlots } from "./Card";

export default Card;
