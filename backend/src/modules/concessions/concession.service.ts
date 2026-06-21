export type ConcessionItem = {
  id: number;
  name: string;
  description: string;
  category: "food" | "beverage" | "combo";
  price: number;
};

const concessionItems: ConcessionItem[] = [
  {
    id: 1,
    name: "Popcorn Combo",
    description: "Caramel popcorn with one soft drink",
    category: "combo",
    price: 1800,
  },
  {
    id: 2,
    name: "Nachos Set",
    description: "Nachos with cheese dip",
    category: "food",
    price: 1400,
  },
  {
    id: 3,
    name: "Hotdog",
    description: "Classic cinema hotdog",
    category: "food",
    price: 1200,
  },
  {
    id: 4,
    name: "Soft Drink",
    description: "Choice of cola, lemon soda, or iced tea",
    category: "beverage",
    price: 700,
  },
  {
    id: 5,
    name: "Mineral Water",
    description: "Bottled mineral water",
    category: "beverage",
    price: 400,
  },
];

export async function getConcessionItems() {
  return concessionItems;
}
