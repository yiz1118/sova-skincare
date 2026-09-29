export type Ingredient = { id:string; name:string; group:string; description:string; note:string };
export const ingredients: Ingredient[] = [
  {id:"glycerin",name:"Glycerin",group:"Humectant",description:"A humectant that attracts water and helps skin feel hydrated.",note:"A familiar ingredient in many moisturizing formulas."},
  {id:"squalane",name:"Squalane",group:"Emollient",description:"An emollient that helps skin feel soft and smooth.",note:"Light in texture and useful in creams and oils."},
  {id:"niacinamide",name:"Niacinamide",group:"Vitamin B3 derivative",description:"A cosmetic ingredient commonly used to support the appearance of more even-looking skin.",note:"Used in many types of facial formulas."},
  {id:"panthenol",name:"Panthenol",group:"Humectant",description:"Provitamin B5 is used in cosmetics to help skin feel moisturized and comfortable.",note:"Often paired with other moisture-focused ingredients."},
  {id:"oat",name:"Oat-derived ingredients",group:"Botanical",description:"Oat-derived materials can contribute a soft, comforting feel in skincare textures.",note:"Exact properties depend on the specific oat material and finished formula."},
  {id:"jojoba",name:"Jojoba oil",group:"Emollient",description:"A liquid wax ester used as an emollient to leave skin feeling smooth.",note:"Its texture makes it a useful addition to body care."}
];
export const ingredientById = (id:string) => ingredients.find(ingredient => ingredient.id === id);
