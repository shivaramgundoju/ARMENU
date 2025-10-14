import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Box } from "lucide-react";

const categories = ["All", "Starters", "Main Course", "Desserts", "Beverages"];

// Updated to use .glb files from public/models
const mockDishes = [
  {
    id: 1,
    name: "Butter Chicken",
    description: "Creamy tomato-based curry with tender chicken pieces",
    price: 14.99,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop",
    modelUrl: "/models/butter-chicken.glb"
  },
  {
    id: 2,
    name: "Margherita Pizza",
    description: "Classic Italian pizza with fresh mozzarella and basil",
    price: 12.99,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop",
    modelUrl: "/models/pizza.glb"
  },
  {
    id: 3,
    name: "Caesar Salad",
    description: "Crisp romaine lettuce with parmesan and croutons",
    price: 8.99,
    category: "Starters",
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop",
    modelUrl: "/models/caesar-salad.glb"
  },
  {
    id: 4,
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten center",
    price: 6.99,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop",
    modelUrl: "/models/chocolate-lava-cake.glb"
  },
  {
    id: 5,
    name: "Fresh Orange Juice",
    description: "Freshly squeezed orange juice",
    price: 4.99,
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop",
    modelUrl: "/models/fresh-orange-juice.glb"
  },
  {
    id: 6,
    name: "Spring Rolls",
    description: "Crispy vegetable spring rolls with sweet chili sauce",
    price: 7.99,
    category: "Starters",
    image: "https://images.unsplash.com/photo-1625395005224-0fce68a61f7f?w=400&h=300&fit=crop",
    modelUrl: "/models/spring-rolls.glb"
  },
  {
    id: 7,
    name: "Grilled Salmon",
    description: "Atlantic salmon with herbs and lemon butter",
    price: 18.99,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1580959375944-57b487fab2b0?w=400&h=300&fit=crop",
    modelUrl: "/models/grilled-salmon.glb"
  },
  {
    id: 8,
    name: "Tiramisu",
    description: "Classic Italian coffee-flavored dessert",
    price: 7.99,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop",
    modelUrl: "/models/tiramisu.glb"
  }
];

const MenuGrid = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDishes = mockDishes.filter((dish) => {
    const matchesCategory = selectedCategory === "All" || dish.category === selectedCategory;
    const matchesSearch =
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="menu" className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">Our Menu</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our delicious dishes in stunning 3D AR
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "hero-gradient border-0" : ""}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDishes.map((dish) => (
            <Card key={dish.id} className="card-glow overflow-hidden border-2 group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <Badge className="absolute top-3 right-3 bg-primary/90">{dish.category}</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{dish.name}</CardTitle>
                <CardDescription>{dish.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">${dish.price.toFixed(2)}</div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full hero-gradient border-0 text-white group"
                  onClick={() => navigate(`/arviewer?model=${encodeURIComponent(dish.modelUrl)}`)}
                >
                  <Box className="mr-2 w-4 h-4 group-hover:rotate-12 transition-transform" />
                  View in AR
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredDishes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">
              No dishes found. Try a different search or category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MenuGrid;
